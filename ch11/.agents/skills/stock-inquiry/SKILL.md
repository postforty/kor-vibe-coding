---
name: stock-inquiry
description: Python과 yfinance를 사용하여 특정 주식 종목의 현재 주가 및 관련 정보를 검색합니다. 사용자가 주가를 물어볼 때 사용하세요.
---

# 주가 정보 검색 스킬 (Stock Inquiry Skill)

특정 회사나 주식 종목의 현재 가격, 금일 변동폭, 전일 대비 증감 등의 정보를 조회해야 할 때 이 스킬을 사용합니다.

## 사용 조건
- 사용자가 특정 회사나 주식 티커(ticker)의 주가 정보를 요청할 때.

## 사용 방법
- `scripts/get_stock_price.py` 스크립트를 사용하여 주가 정보를 검색합니다.
- 스크립트 실행 시 종목의 티커(ticker) 심볼을 인자로 전달해야 합니다. 한국 주식의 경우 통상적으로 종목코드 뒤에 `.KS`(코스피) 또는 `.KQ`(코스닥)를 붙여야 합니다 (예: 삼성전자 -> `005930.KS`).
- 미국 주식은 티커 그대로 사용합니다 (예: Apple -> `AAPL`).

### 스크립트 실행 예시
```bash
python .agents/skills/stock-inquiry/scripts/get_stock_price.py AAPL
python .agents/skills/stock-inquiry/scripts/get_stock_price.py 005930.KS
```

### 주의 사항
- `yfinance` 패키지가 시스템에 설치되어 있어야 정상 작동합니다. 모듈을 찾을 수 없다는 에러가 발생하면 `pip install yfinance`를 먼저 실행해주세요.
- 검색 결과를 확인한 후, 사용자에게 자연스러운 한국어로 주가 정보를 요약하여 전달하세요.
