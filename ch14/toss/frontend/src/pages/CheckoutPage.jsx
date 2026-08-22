import React, { useEffect, useRef, useState } from 'react'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { CreditCard, Tag, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react'

// 토스 기본 테스트 클라이언트 키
const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

// 고유한 customerKey (회원 결제 테스트용)
const CUSTOMER_KEY = 'CUST_' + Math.random().toString(36).substring(2, 10)

export default function CheckoutPage() {
  const [widgets, setWidgets] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 상품 기본 금액 및 할인 쿠폰
  const basePrice = 50000
  const [discount, setDiscount] = useState(0)
  const finalPrice = basePrice - discount

  const isInitialized = useRef(false)

  // 1. 토스 V2 SDK 초기화 및 위젯 렌더링
  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    async function initTossWidgets() {
      try {
        setLoading(true)
        setErrorMessage('')

        // SDK 로드
        const tossPayments = await loadTossPayments(CLIENT_KEY)
        
        // 회원 위젯 인스턴스 생성
        const tossWidgets = tossPayments.widgets({
          customerKey: CUSTOMER_KEY,
        })

        // 결제 금액 설정
        await tossWidgets.setAmount({
          currency: 'KRW',
          value: 50000,
        })

        // 결제수단 UI 렌더링
        await tossWidgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        })

        // 약관 UI 렌더링
        await tossWidgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        })

        setWidgets(tossWidgets)
      } catch (err) {
        console.error('위젯 초기화 오류:', err)
        setErrorMessage('결제 위젯을 불러오는 중 오류가 발생했습니다: ' + (err.message || err))
      } finally {
        setLoading(false)
      }
    }

    initTossWidgets()
  }, [])

  // 2. 할인 쿠폰 변경 시 실시간 결제 금액 업데이트 (setAmount)
  const handleCouponChange = async (e) => {
    const couponDiscount = Number(e.target.value)
    setDiscount(couponDiscount)
    const newPrice = basePrice - couponDiscount

    if (widgets) {
      try {
        await widgets.setAmount({
          currency: 'KRW',
          value: newPrice,
        })
      } catch (err) {
        console.error('금액 업데이트 실패:', err)
      }
    }
  }

  // 3. 결제하기 버튼 클릭
  const handlePayment = async () => {
    if (!widgets || isProcessing) return

    try {
      setIsProcessing(true)
      setErrorMessage('')

      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      const orderName = 'Vibe 바이브 개발자 후디 & 키캡 세트'

      // 백엔드에 주문 정보 사전 등록 (보안 위변조 검증용)
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            orderName,
            amount: finalPrice,
            customerName: '홍길동',
            customerEmail: 'vibe_user@example.com',
          }),
        })
      } catch (backendErr) {
        console.warn('백엔드 주문 생성 연결 알림:', backendErr)
      }

      // 토스페이먼츠 결제창 호출
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        customerEmail: 'vibe_user@example.com',
        customerName: '홍길동',
        customerMobilePhone: '01012345678',
      })
    } catch (err) {
      console.error('결제 요청 오류:', err)
      if (err.code === 'USER_CANCEL') {
        setErrorMessage('결제를 취소하셨습니다.')
      } else {
        setErrorMessage(err.message || '결제 요청 중 오류가 발생했습니다.')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="checkout-grid">
      {/* 왼쪽: 상품 및 주문 정보 */}
      <div className="card">
        <h2 className="card-title">
          <ShoppingCart size={22} color="#3182f6" />
          주문 내역
        </h2>

        <div className="order-item-card">
          <img
            src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&auto=format&fit=crop&q=80"
            alt="상품 이미지"
            className="item-image"
          />
          <div className="item-info">
            <div>
              <span className="item-tag">한정판 기획상품</span>
              <h3 className="item-name">Vibe 개발자 후디 & 기계식 키캡</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                옵션: 블랙 / L / 체리 프로파일
              </p>
            </div>
            <div className="item-price">{basePrice.toLocaleString()}원</div>
          </div>
        </div>

        {/* 쿠폰 선택 */}
        <div className="coupon-section">
          <label className="coupon-label">
            <Tag size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            할인 쿠폰 적용 (실시간 위젯 금액 변경 테스트)
          </label>
          <select className="coupon-select" onChange={handleCouponChange} value={discount}>
            <option value="0">쿠폰 선택 안 함</option>
            <option value="5000">🎉 신규 가입 5,000원 즉시 할인</option>
            <option value="10000">🔥 바이브 코딩 특별 10,000원 쿠폰</option>
          </select>
        </div>

        {/* 금액 요약 */}
        <div className="price-summary">
          <div className="summary-row">
            <span>상품 금액</span>
            <span>{basePrice.toLocaleString()}원</span>
          </div>
          {discount > 0 && (
            <div className="summary-row discount">
              <span>쿠폰 할인 금액</span>
              <span>-{discount.toLocaleString()}원</span>
            </div>
          )}
          <div className="summary-row">
            <span>배송비</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>무료배송</span>
          </div>
          <div className="summary-row total">
            <span>최종 결제 금액</span>
            <span className="total-amount">{finalPrice.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 오른쪽: 토스페이먼츠 V2 결제 위젯 영역 */}
      <div className="card">
        <h2 className="card-title">
          <CreditCard size={22} color="#3182f6" />
          결제 수단 선택
        </h2>

        {errorMessage && (
          <div style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.8rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ marginBottom: '1rem' }}></div>
            <p>토스 결제위젯을 안전하게 불러오는 중입니다...</p>
          </div>
        )}

        <div className="widget-container" style={{ display: loading ? 'none' : 'block' }}>
          {/* 토스 결제수단 UI가 렌더링되는 영역 */}
          <div id="payment-method"></div>
          {/* 토스 약관 UI가 렌더링되는 영역 */}
          <div id="agreement"></div>

          {/* 결제하기 버튼 */}
          <button
            id="pay-button"
            className="pay-button"
            onClick={handlePayment}
            disabled={loading || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderColor: '#fff', borderTopColor: 'transparent' }}></div>
                결제 요청 중...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                {finalPrice.toLocaleString()}원 결제하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
