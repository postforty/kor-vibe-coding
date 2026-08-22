import base64
import os
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

TOSS_SECRET_KEY = os.getenv("TOSS_SECRET_KEY", "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6")
TOSS_CLIENT_KEY = os.getenv("TOSS_CLIENT_KEY", "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm")

app = FastAPI(
    title="Toss Payments Integration API",
    description="토스페이먼츠 V2 테스트 결제 연동 백엔드 서버 (FastAPI)",
    version="1.0.0"
)

# CORS 설정 (React 프론트엔드 연동)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory 주문 저장소 (실무에서는 RDBMS/NoSQL 사용)
orders_db: Dict[str, Dict[str, Any]] = {}

# 토스페이먼츠 Basic Auth 헤더 생성 헬퍼 (secret_key + ':')
def get_toss_auth_header() -> str:
    # 토스페이먼츠 규격: 시크릿 키 뒤에 콜론(:)을 붙여 base64 인코딩
    encoded = base64.b64encode(f"{TOSS_SECRET_KEY}:".encode("utf-8")).decode("utf-8")
    return f"Basic {encoded}"


# --- Pydantic 요청 모델 ---
class CreateOrderRequest(BaseModel):
    orderId: str
    orderName: str
    amount: int
    customerName: Optional[str] = "고객"
    customerEmail: Optional[str] = "customer@example.com"

class ConfirmPaymentRequest(BaseModel):
    paymentKey: str
    orderId: str
    amount: int

class CancelPaymentRequest(BaseModel):
    cancelReason: str
    cancelAmount: Optional[int] = None


# --- API 엔드포인트 ---

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Toss Payments FastAPI Backend",
        "clientKey": TOSS_CLIENT_KEY
    }

@app.post("/api/orders")
def create_order(request: CreateOrderRequest):
    """
    [결제 전 필수 단계]
    클라이언트에서 결제창을 띄우기 전 주문 정보를 서버에 사전 등록합니다.
    (추후 클라이언트 결제 인증 후 승인 시 금액 위변조 검증에 사용)
    """
    orders_db[request.orderId] = {
        "orderId": request.orderId,
        "orderName": request.orderName,
        "amount": request.amount,
        "customerName": request.customerName,
        "customerEmail": request.customerEmail,
        "status": "READY",
        "paymentKey": None,
        "paymentDetail": None
    }
    return {
        "success": True,
        "order": orders_db[request.orderId]
    }

@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    if order_id not in orders_db:
        raise HTTPException(status_code=404, detail="주문 정보를 찾을 수 없습니다.")
    return orders_db[order_id]

@app.post("/api/payments/confirm")
async def confirm_payment(request: ConfirmPaymentRequest):
    """
    [결제 승인 API]
    1. 클라이언트가 넘겨준 amount와 서버에 등록된 주문 amount 대조 (위변조 검증)
    2. 토스페이먼츠 코어 승인 API (POST https://api.tosspayments.com/v1/payments/confirm) 호출
    3. 승인 결과 반환 및 주문 상태 업데이트
    """
    # 1. 서버 측 금액 위변조 검증
    saved_order = orders_db.get(request.orderId)
    if saved_order:
        if saved_order["amount"] != request.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"결제 금액 위변조 감지: 등록된 금액({saved_order['amount']}원)과 요청 금액({request.amount}원)이 일치하지 않습니다."
            )
    else:
        # 실습 편의상 서버 재시작 등의 사유로 메모리 주문이 없으면 경고 후 통과하도록 처리
        print(f"[경고] 메모리에 orderId '{request.orderId}' 가 없습니다. 실습 모드로 계속 진행합니다.")

    # 2. 토스페이먼츠 결제 승인 API 호출
    headers = {
        "Authorization": get_toss_auth_header(),
        "Content-Type": "application/json"
    }
    payload = {
        "paymentKey": request.paymentKey,
        "orderId": request.orderId,
        "amount": request.amount
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.tosspayments.com/v1/payments/confirm",
                headers=headers,
                json=payload,
                timeout=15.0
            )
            response_data = response.json()

            if response.status_code != 200:
                # 토스페이먼츠 에러 응답 전달
                error_code = response_data.get("code", "UNKNOWN_ERROR")
                error_message = response_data.get("message", "결제 승인 중 오류가 발생했습니다.")
                raise HTTPException(
                    status_code=response.status_code,
                    detail={"code": error_code, "message": error_message}
                )

            # 3. 주문 저장소 상태 업데이트
            if saved_order:
                saved_order["status"] = "DONE"
                saved_order["paymentKey"] = request.paymentKey
                saved_order["paymentDetail"] = response_data

            return {
                "success": True,
                "message": "결제가 성공적으로 승인되었습니다.",
                "data": response_data
            }

        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"토스페이먼츠 통신 오류: {str(exc)}"
            )

@app.post("/api/payments/{payment_key}/cancel")
async def cancel_payment(payment_key: str, request: CancelPaymentRequest):
    """
    [결제 취소/환불 API]
    토스페이먼츠 취소 API (POST https://api.tosspayments.com/v1/payments/{paymentKey}/cancel) 호출
    """
    headers = {
        "Authorization": get_toss_auth_header(),
        "Content-Type": "application/json"
    }
    payload: Dict[str, Any] = {
        "cancelReason": request.cancelReason
    }
    if request.cancelAmount is not None:
        payload["cancelAmount"] = request.cancelAmount

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"https://api.tosspayments.com/v1/payments/{payment_key}/cancel",
                headers=headers,
                json=payload,
                timeout=15.0
            )
            response_data = response.json()

            if response.status_code != 200:
                error_code = response_data.get("code", "UNKNOWN_ERROR")
                error_message = response_data.get("message", "결제 취소 중 오류가 발생했습니다.")
                raise HTTPException(
                    status_code=response.status_code,
                    detail={"code": error_code, "message": error_message}
                )

            # 취소 내역 반영
            for order in orders_db.values():
                if order.get("paymentKey") == payment_key:
                    order["status"] = "CANCELED"
                    order["paymentDetail"] = response_data
                    break

            return {
                "success": True,
                "message": "결제가 성공적으로 취소(환불)되었습니다.",
                "data": response_data
            }

        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"토스페이먼츠 통신 오류: {str(exc)}"
            )

@app.get("/api/payments/{payment_key}")
async def get_payment(payment_key: str):
    """
    [결제 상세 조회 API]
    """
    headers = {
        "Authorization": get_toss_auth_header(),
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.tosspayments.com/v1/payments/{payment_key}",
            headers=headers,
            timeout=10.0
        )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
