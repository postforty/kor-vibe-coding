import sys
import os
import openmeteo_requests
import requests_cache
from retry_requests import retry
from datetime import datetime
from geopy.geocoders import Nominatim

def get_weather(location):
    # 1. Geopy (Nominatim)을 이용한 위경도 조회
    geolocator = Nominatim(user_agent="weather_inquiry_agent_skill")
    try:
        loc_data = geolocator.geocode(location)
        if not loc_data:
            print(f"오류: '{location}' 지역의 위치 정보를 찾을 수 없습니다.")
            return
        
        latitude = loc_data.latitude
        longitude = loc_data.longitude
        print(f"위치 확인됨: {loc_data.address} (위도: {latitude}, 경도: {longitude})")
        
        # 2. Open-Meteo API를 이용한 날씨 조회
        cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
        retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
        openmeteo = openmeteo_requests.Client(session=retry_session)
        
        URL = "https://api.open-meteo.com/v1/forecast"
        
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
            "timezone": "Asia/Seoul",
            "forecast_days": 1
        }
        
        responses = openmeteo.weather_api(URL, params=params)
        response = responses[0]
        
        current = response.Current()
        
        weather_code_map = {
            0: "맑음",
            1: "대체로 맑음",
            2: "부분적으로 흐림",
            3: "흐림",
            45: "안개",
            48: "안개",
            51: "가벼운 이슬비",
            53: "이슬비",
            55: "강한 이슬비",
            61: "약한 비",
            63: "보통 비",
            65: "강한 비",
            71: "약한 눈",
            73: "보통 눈",
            75: "강한 눈",
            80: "약한 소나기",
            81: "보통 소나기",
            82: "강한 소나기",
            95: "뇌우",
            96: "뇌우 및 약간의 우박",
            99: "뇌우 및 강한 우박"
        }
        
        time = datetime.fromtimestamp(current.Time()).strftime('%Y-%m-%d %H:%M:%S')
        temp = current.Variables(0).Value()
        humidity = current.Variables(1).Value()
        weather_code = int(current.Variables(2).Value())
        wind_speed = current.Variables(3).Value()
        
        weather_desc = weather_code_map.get(weather_code, f"알 수 없음 (코드: {weather_code})")
        
        print("\n--- 날씨 정보 ---")
        print(f"기준 시간: {time}")
        print(f"현재 {location}의 날씨: {weather_desc}")
        print(f"기온: {temp:.1f}°C")
        print(f"습도: {humidity:.1f}%")
        print(f"풍속: {wind_speed:.1f} km/h")

    except Exception as e:
        print(f"실행 중 오류 발생: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python get_weather.py <지역명>")
        sys.exit(1)
    
    location_query = " ".join(sys.argv[1:])
    get_weather(location_query)
