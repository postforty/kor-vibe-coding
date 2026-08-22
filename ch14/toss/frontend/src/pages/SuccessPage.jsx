import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Check, AlertTriangle, ExternalLink, RotateCcw, Home, ShoppingBag, ShieldCheck } from 'lucide-react'

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)
  const [error, setError] = useState(null)

  // 취소(환불) 상태
  const [canceling, setCanceling] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)

  useEffect(() => {
    async function confirmPayment() {
      if (!paymentKey || !orderId || !amount) {
        setError({
          code: 'INVALID_REQUEST',
          message: '필수 결제 파라미터(paymentKey, orderId, amount)가 누락되었습니다.',
        })
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // 백엔드 FastAPI 승인 엔드포인트 호출
        const res = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.detail?.message || data.detail || '결제 승인 처리 중 오류가 발생했습니다.')
        }

        setPaymentData(data.data)
      } catch (err) {
        console.error('결제 승인 실패:', err)
        setError({
          code: 'CONFIRM_FAILED',
          message: err.message,
        })
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [paymentKey, orderId, amount])

  // 결제 취소(환불) 테스트 함수
  const handleCancelPayment = async () => {
    if (!window.confirm('정말로 이 테스트 결제를 취소(환불)하시겠습니까?')) return

    try {
      setCanceling(true)
      const res = await fetch(`/api/payments/${paymentKey}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancelReason: '고객 단순 변심 (실습 테스트 취소)',
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail?.message || data.detail || '결제 취소 처리 중 오류가 발생했습니다.')
      }

      setCancelSuccess(true)
      setPaymentData(data.data)
      alert('결제가 성공적으로 취소(환불)되었습니다!')
    } catch (err) {
      alert('취소 실패: ' + err.message)
    } finally {
      setCanceling(false)
    }
  }

  if (loading) {
    return (
      <div className="result-card">
        <div className="spinner" style={{ width: 40, height: 40, marginBottom: '1.5rem' }}></div>
        <h2 className="result-title">결제 승인 처리 중...</h2>
        <p className="result-desc">FastAPI 서버에서 토스페이먼츠 코어 API로 안전하게 승인을 요청하고 있습니다.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="result-card">
        <div className="status-icon-wrapper fail">
          <AlertTriangle size={36} />
        </div>
        <h2 className="result-title">결제 승인에 실패했습니다</h2>
        <p className="result-desc">{error.message}</p>
        <div className="button-group">
          <Link to="/" className="btn-secondary">
            <Home size={18} />
            다시 시도하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="result-card">
      <div className={`status-icon-wrapper ${cancelSuccess || paymentData?.status === 'CANCELED' ? 'fail' : 'success'}`}>
        {cancelSuccess || paymentData?.status === 'CANCELED' ? <RotateCcw size={36} /> : <Check size={36} />}
      </div>

      <h2 className="result-title">
        {cancelSuccess || paymentData?.status === 'CANCELED' ? '결제가 취소(환불)되었습니다' : '결제가 완료되었습니다!'}
      </h2>
      <p className="result-desc">
        {cancelSuccess || paymentData?.status === 'CANCELED'
          ? '승인된 테스트 결제가 정상적으로 전액 환불 처리되었습니다.'
          : '토스페이먼츠 테스트 결제 및 백엔드 승인이 성공적으로 완료되었습니다.'}
      </p>

      {/* 영수증 및 승인 상세 내역 */}
      <div className="receipt-box">
        <div className="receipt-row">
          <span className="receipt-label">주문 번호</span>
          <span className="receipt-value">{paymentData?.orderId}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">주문 상품</span>
          <span className="receipt-value">{paymentData?.orderName}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">결제 금액</span>
          <span className="receipt-value" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
            {paymentData?.totalAmount?.toLocaleString()}원
          </span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">결제 수단</span>
          <span className="receipt-value">
            {paymentData?.method} {paymentData?.card ? `(${paymentData.card.cardType || '카드'})` : ''}
            {paymentData?.easyPay ? `(${paymentData.easyPay.provider})` : ''}
          </span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">결제 상태</span>
          <span className="receipt-value" style={{
            color: paymentData?.status === 'DONE' ? 'var(--success)' : 'var(--danger)',
            fontWeight: 700
          }}>
            {paymentData?.status}
          </span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">승인 시각</span>
          <span className="receipt-value" style={{ fontSize: '0.85rem' }}>
            {paymentData?.approvedAt ? new Date(paymentData.approvedAt).toLocaleString() : '-'}
          </span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">paymentKey</span>
          <span className="receipt-value" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {paymentData?.paymentKey}
          </span>
        </div>
      </div>

      <div className="button-group">
        {paymentData?.receipt?.url && (
          <a
            href={paymentData.receipt.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <ExternalLink size={16} />
            토스 영수증 확인
          </a>
        )}

        {paymentData?.status === 'DONE' && (
          <button
            onClick={handleCancelPayment}
            disabled={canceling}
            className="btn-danger"
          >
            <RotateCcw size={16} />
            {canceling ? '취소 처리 중...' : '결제 취소(환불) 테스트'}
          </button>
        )}

        <Link to="/" className="btn-secondary">
          <ShoppingBag size={16} />
          새 주문 실습하기
        </Link>
      </div>
    </div>
  )
}
