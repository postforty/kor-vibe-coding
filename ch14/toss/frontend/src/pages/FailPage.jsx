import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { XCircle, RefreshCw, ShoppingCart, HelpCircle } from 'lucide-react'

export default function FailPage() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') || 'PAY_FAILED'
  const message = searchParams.get('message') || '결제 진행 중 오류가 발생했습니다.'
  const orderId = searchParams.get('orderId')

  return (
    <div className="result-card">
      <div className="status-icon-wrapper fail">
        <XCircle size={36} />
      </div>

      <h2 className="result-title">결제에 실패했습니다</h2>
      <p className="result-desc">결제 인증이 중단되었거나 오류가 발생했습니다.</p>

      <div className="receipt-box">
        <div className="receipt-row">
          <span className="receipt-label">에러 코드</span>
          <span className="receipt-value" style={{ color: 'var(--danger)', fontWeight: 700 }}>
            {code}
          </span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">실패 사유</span>
          <span className="receipt-value">{message}</span>
        </div>
        {orderId && (
          <div className="receipt-row">
            <span className="receipt-label">주문 번호</span>
            <span className="receipt-value">{orderId}</span>
          </div>
        )}
      </div>

      <div className="button-group">
        <Link to="/" className="btn-secondary" style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}>
          <RefreshCw size={16} />
          주문서로 돌아가기
        </Link>
      </div>
    </div>
  )
}
