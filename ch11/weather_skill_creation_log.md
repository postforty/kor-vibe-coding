# 날씨 조회 에이전트 스킬 생성 과정

이 문서는 Antigravity 에이전트를 위한 "날씨 조회(weather-inquiry)" 스킬을 설계하고 구현한 과정을 기록한 문서입니다.

## 1. 개요 및 요구사항
- **목적**: 사용자가 특정 지역의 날씨를 물어볼 때, 에이전트가 이를 인식하고 정확한 날씨 정보를 한국어로 제공하는 기능을 추가.
- **참고 자료**: 프로젝트 내 `agent_skills.md`의 에이전트 스킬 작성 가이드.
- **스킬 경로**: 워크스페이스 스킬 경로인 `.agents/skills/weather-inquiry/` 디렉터리에 구성.

## 2. 1차 구현: 웹 검색 기반 스킬
최초에는 별도의 코드 없이 에이전트의 기본 도구를 활용하도록 설계했습니다.
- **파일명**: `.agents/skills/weather-inquiry/SKILL.md`
- **방식**: 에이전트가 자체 내장 도구인 `search_web`을 사용해 "[지역명] 현재 날씨"를 검색하고, 검색 결과를 분석하여 답변하도록 지침 작성.
- **한계점**: 검색 결과의 포맷이 항상 일정하지 않으며 구조화된 데이터를 안정적으로 확보하기 어려울 수 있음.

## 3. 2차 구현: 파이썬 스크립트 기반 스킬 고도화 (API 연동)
구조화되고 정확한 날씨 데이터를 안정적으로 확보하기 위해 파이썬 스크립트를 작성하고, 에이전트가 이를 실행하도록 스킬을 업데이트했습니다.

### 3.1. 사용된 API 및 패키지
- **위경도 변환 (Geocoding)**: `Geopy` 모듈의 `Nominatim` (무료 오픈소스)
- **날씨 데이터 조회**: `OpenWeatherMap API` (무료 티어 사용, API Key 필요)

### 3.2. 파이썬 스크립트 작성
- **경로**: `.agents/skills/weather-inquiry/scripts/get_weather.py`
- **구현 내용**:
  1. 인자로 전달받은 '지역명'을 `Geopy`를 통해 위도(Latitude)와 경도(Longitude)로 변환.
  2. 시스템 환경 변수 `OPENWEATHERMAP_API_KEY`에서 인증 키를 로드.
  3. 앞서 얻은 위경도 정보를 활용해 OpenWeatherMap API(`https://api.openweathermap.org/data/2.5/weather`)를 호출.
  4. 응답 JSON을 파싱하여 날씨 상태, 기온, 체감 온도, 습도를 콘솔에 출력.

### 3.3. 스킬 지침(SKILL.md) 업데이트
에이전트가 기존의 웹 검색 대신 작성된 스크립트를 직접 실행(`run_command`)하도록 `SKILL.md`의 실행 단계를 수정했습니다.
- **명령어 지침**: `python .agents/skills/weather-inquiry/scripts/get_weather.py "[지역명]"`
- **경로 및 이식성 고려**: 스크립트 실행 시 절대 경로 대신 상대 경로를 사용하고, "워크스페이스 루트 디렉터리를 기준으로 실행할 것"을 명시하여 프로젝트 폴더 이동 시에도 스킬이 정상 작동하도록 이식성(Portability)을 높였습니다.
- **예외 처리 가이드라인 추가**:
  - 스크립트 실행에 필요한 라이브러리(`requests`, `geopy`) 부재 시 `pip install` 실행 안내.
  - `OPENWEATHERMAP_API_KEY` 환경 변수 누락 시, 사용자에게 환경 변수 세팅을 요청하도록 명시.

## 4. 최종 결과물 구조

```text
프로젝트 루트 (ch11)
└── .agents/
    └── skills/
        └── weather-inquiry/
            ├── SKILL.md                 # 에이전트가 읽고 따르는 핵심 지침서
            └── scripts/
                └── get_weather.py       # API를 호출하여 날씨 데이터를 가져오는 스크립트
```
