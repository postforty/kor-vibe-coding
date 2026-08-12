import sys
import os
import requests
from geopy.geocoders import Nominatim

def get_weather(location):
    # 1. Geopy (Nominatim)을 이용한 위경도 조회
    geolocator = Nominatim(user_agent="weather_inquiry_agent_skill")
    try:
        loc_data = geolocator.geocode(location)
        if not loc_data:
            print(f"오류: '{location}' 지역의 위치 정보를 찾을 수 없습니다.")
            return
        
        lat = loc_data.latitude
        lon = loc_data.longitude
        print(f"위치 확인됨: {loc_data.address} (위도: {lat}, 경도: {lon})")
        
        # 2. OpenWeatherMap API를 이용한 날씨 조회
        api_key = os.environ.get("OPENWEATHERMAP_API_KEY")
        if not api_key:
            print("오류: OPENWEATHERMAP_API_KEY 환경 변수가 설정되지 않았습니다.")
            print("OpenWeatherMap API 키를 환경 변수에 등록한 후 다시 실행해주세요.")
            return

        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=kr"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            weather_desc = data['weather'][0]['description']
            temp = data['main']['temp']
            feels_like = data['main']['feels_like']
            humidity = data['main']['humidity']
            
            print("\n--- 날씨 정보 ---")
            print(f"현재 {location}의 날씨: {weather_desc}")
            print(f"기온: {temp}°C (체감 온도: {feels_like}°C)")
            print(f"습도: {humidity}%")
        else:
            print(f"날씨 데이터 조회 오류: HTTP {response.status_code}")
            print(response.text)

    except Exception as e:
        print(f"실행 중 오류 발생: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python get_weather.py <지역명>")
        sys.exit(1)
    
    location_query = " ".join(sys.argv[1:])
    get_weather(location_query)
