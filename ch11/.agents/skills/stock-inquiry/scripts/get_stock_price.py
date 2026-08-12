import yfinance as yf
import argparse

def get_stock_info(ticker_symbol):
    try:
        stock = yf.Ticker(ticker_symbol)
        info = stock.info
        
        # yfinance info dict might not have currentPrice for all tickers/regions
        current_price = info.get('currentPrice') or info.get('regularMarketPrice')
        currency = info.get('currency', 'USD')
        short_name = info.get('shortName', ticker_symbol)
        
        # Fallback to history if currentPrice is not in info
        if current_price is None:
            history = stock.history(period="1d")
            if not history.empty:
                current_price = history['Close'].iloc[-1]
            else:
                print(f"[{ticker_symbol}] 주가 정보를 가져올 수 없습니다. 티커를 확인해주세요.")
                return

        print(f"[{short_name} ({ticker_symbol})]")
        print(f"현재 주가: {current_price} {currency}")
        
        day_high = info.get('dayHigh')
        day_low = info.get('dayLow')
        if day_high and day_low:
             print(f"금일 변동폭: {day_low} - {day_high}")
             
        previous_close = info.get('previousClose')
        if previous_close and current_price:
            change = current_price - previous_close
            change_percent = (change / previous_close) * 100
            print(f"전일 대비: {change:+.2f} ({change_percent:+.2f}%)")

    except Exception as e:
        print(f"에러 발생 ({ticker_symbol}): {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="yfinance를 이용한 현재 주가 조회")
    parser.add_argument("ticker", help="주식 티커 심볼 (예: AAPL, MSFT, 005930.KS)")
    args = parser.parse_args()
    
    get_stock_info(args.ticker)
