---
name: weather-inquiry
description: 특정 지역의 현재 날씨를 조회합니다. 사용자가 날씨를 물어볼 때 사용하세요.
---

# Weather Inquiry Skill

사용자가 특정 지역의 현재 날씨를 물어볼 때 다음 단계를 따르세요:

## 실행 단계
1. 사용자가 날씨를 알고 싶어 하는 지역을 파악합니다.
2. `run_command` 도구를 사용하여 이 스킬에 포함된 파이썬 스크립트를 실행합니다. 
   - 명령어: `python .agents/skills/weather-inquiry/scripts/get_weather.py "[지역명]"`
   - 실행 위치: 워크스페이스(프로젝트) 루트 디렉터리를 기준으로 명령어를 실행하세요.
   - 주의: 스크립트 실행에 필요한 패키지가 없다면 `pip install openmeteo-requests requests-cache retry-requests geopy`를 실행하세요.
3. 스크립트의 출력 결과를 분석하여 현재 기온, 날씨 상태, 풍속, 습도 등 유용한 정보를 추출합니다.
4. 스크립트 출력 정보를 바탕으로 사용자에게 자연스러운 한국어로 날씨 정보를 제공합니다. 

## 참고 사항
- 스크립트는 `geopy` 모듈을 이용해 위치의 위경도를 찾고, 무료 API인 `Open-Meteo`를 통해 날씨 데이터를 가져옵니다. 별도의 인증 키(API Key)는 필요하지 않습니다.
- 기온 외에도 풍속, 습도 등 도움이 될 만한 정보를 답변에 포함하면 좋습니다.
