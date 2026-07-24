import requests
import time
from email.utils import parsedate_to_datetime

def get_naver_time_offset():
    """
    네이버 서버에 요청을 보내 서버 시간과 로컬 시간의 오차(offset)를 초 단위로 반환합니다.
    offset = (서버 시간 - 로컬 시간)
    따라서 현재 서버 시간 = 로컬 시간 + offset
    """
    try:
        start_time = time.time()
        # GET 대신 HEAD 요청을 사용하여 헤더만 빠르게 받아옴
        response = requests.head('https://www.naver.com', timeout=3)
        end_time = time.time()
        
        # 네트워크 왕복 시간(Ping)
        ping = end_time - start_time
        
        if 'Date' in response.headers:
            date_str = response.headers['Date']
            # HTTP Date 헤더를 datetime 객체로 변환 (UTC 기준)
            server_dt_utc = parsedate_to_datetime(date_str)
            # 타임스탬프로 변환
            server_timestamp = server_dt_utc.timestamp()
            
            # 서버가 응답을 생성한 정확한 시점 보정:
            # 보낸 시간과 받은 시간의 딱 중간쯤이라고 추정하여 (ping / 2) 추가
            exact_server_timestamp = server_timestamp + (ping / 2)
            
            # (서버 시간 - 내 컴퓨터 시간) = 오차
            offset = exact_server_timestamp - end_time
            return offset
        else:
            print("응답 헤더에 Date 값이 없습니다.")
            return 0
    except Exception as e:
        print(f"시간 동기화 오류: {e}")
        return 0
