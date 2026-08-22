import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { ShoppingBag, ShieldCheck } from 'lucide-react'
import CheckoutPage from './pages/CheckoutPage'
import SuccessPage from './pages/SuccessPage'
import FailPage from './pages/FailPage'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-container">
          <Link to="/" className="logo-area">
            <ShoppingBag className="w-6 h-6 text-primary" color="#3182f6" />
            <span>Toss Vibe Shop</span>
            <span className="logo-badge">V2 SDK</span>
          </Link>
          <div className="env-badge">
            <ShieldCheck size={16} />
            <span>테스트 샌드박스 연동중</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/fail" element={<FailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
