# 🔰 [초보자 가이드] Google Apps Script & Clasp 대시보드 전체 구현 매뉴얼

본 문서는 **Google Apps Script API 활성화** 및 **Clasp 설치/로그인**부터 시작하여, 수강생 계좌 수집 및 Google Drive 증빙 파일 업로드 대시보드를 구동하기까지의 모든 과정을 초보자 눈높이에 맞춰 순서대로 정리한 안내서입니다.

---

## 📌 전체 흐름 한눈에 보기

```text
[1단계: 사전 준비] ────> [2단계: clasp 및 개발환경] ────> [3단계: 스프레드시트/드라이브 세팅]
 Google Apps Script         Node.js & clasp 설치          구글 시트 & 저장 폴더 생성
   API 스위치 ON               구글 계정 로그인              ID/URL 복사 및 .clasp.json 설정
       │
       ▼
[4단계: 소스코드 작성] ──> [5단계: 코드 업로드 & 배포] ───> [6단계: 초기화 & 테스트]
 Code.js / Index.html       npm run push (clasp push)     setupSheets() 실행 및 
  파일 구현/확인             웹 앱(Web App) 배포           웹 앱 URL / 드라이브 URL 입력
```

---

## 🛠️ 상세 단계별 구현 가이드

### STEP 1. Google Apps Script API 활성화 (최초 1회)
> 구글 외부(내 컴퓨터 cmd 등)에서 구글 스크립트를 제어하려면 API 스위치를 켜야 합니다.

1. 인터넷 브라우저를 열고 [Google Apps Script 설정 페이지](https://script.google.com/home/usersettings)로 이동합니다.
2. 계정 설정을 확인하고 **`Google Apps Script API`** 항목을 **`사용함 (ON)`**으로 변경합니다.

---

### STEP 2. 개발 환경 구축 & Clasp 설치 및 로그인

1. **Node.js 설치**: 컴퓨터에 Node.js가 설치되어 있지 않다면 공식 홈페이지에서 설치합니다.
2. **프로젝트 폴더 생성 및 cmd 열기**:
   - 바탕화면 등에 원하는 이름의 폴더(예: `대시보드`)를 생성합니다.
   - 해당 폴더 경로 주소창에 `cmd`를 입력하고 엔터를 눌러 명령 프롬프트를 엽니다.
3. **Clasp 글로벌 설치**:
   ```bash
   npm install -g @google/clasp
   ```
4. **Google 계정 로그인 (Clasp 인증)**:
   ```bash
   clasp login
   ```
   - 브라우저 창이 열리면 Google 계정으로 로그인하고 액세스 권한을 **허용**합니다.
   - `Logged in! Cached credentials to ~/.clasprc.json` 메시지가 뜨면 성공입니다.

---

### STEP 3. 구글 스프레드시트 & 구글 드라이브 폴더 준비

1. **구글 스프레드시트 생성**:
   - 구글 드라이브에서 새로운 스프레드시트를 만듭니다 (예 제목: `수강생동의_계좌확인`).
   - 주소창 URL에서 ID를 확인합니다: `https://docs.google.com/spreadsheets/d/`**`[이 부분이 Parent ID]`**`/edit`
2. **증빙 파일 저장용 구글 드라이브 폴더 생성**:
   - 결제 내역 압축파일이 들어갈 폴더를 구글 드라이브에 만들고, 해당 폴더의 **공유 링크 또는 URL**을 복사해 둡니다.
3. **로컬 프로젝트와 스프레드시트 연결 (`.clasp.json`)**:
   - 프로젝트 폴더 내 `.clasp.json` 파일에 복사한 스프레드시트 ID를 입력합니다:
     ```json
     {
       "scriptId": "발급받은_스크립트_ID",
       "parentId": ["복사한_스프레드시트_ID"]
     }
     ```

---

### STEP 4. 백엔드 및 프론트엔드 코드 구현

1. **`package.json`**: clasp 실행용 npm 스크립트 등록 (`push`, `pull`, `open` 등).
2. **`Code.js`** (Apps Script 백엔드):
   - `setupSheets()`: 구글 시트에 `정보`, `수집정보`, `자료제출` 시트 자동 생성 및 기본 양식 세팅.
   - `getTargetDriveFolder()`: B4 셀의 드라이브 주소에서 폴더 객체 자동 로드.
   - `submitStudentData()`: 계좌 수집 정보 기록.
   - `submitPaymentReceipt()`: 제출된 압축파일을 구글 드라이브 폴더에 저장하고 URL 연동.
3. **`Index.html`** (대시보드 UI):
   - 모바일/데스크톱 대응 모던 파스텔 계열 탭 화면 구현 (계좌동의 탭 / 자료제출 탭).

---

### STEP 5. 구글로 코드 업로드 & 웹 앱 배포

1. **코드 업로드 (`clasp push`)**:
   ```bash
   clasp push  (또는 npm run push)
   ```
2. **Apps Script 에디터 열기**:
   ```bash
   clasp open  (또는 npm run open)
   ```
3. **웹 앱(Web App) 배포**:
   - 구글 에디터 우측 상단 `배포` -> `새 배포` 클릭
   - 유형 선택: **웹 앱 (Web App)**
   - 실행 주체: **나 (Me)**
   - 액세스 권한: **모든 사용자 (Anyone)**
   - **배포** 버튼 클릭 후 생성된 **웹 앱 URL**을 복사합니다.

---

### STEP 6. 최초 시트 초기화 및 동작 검증

1. Apps Script 에디터 상단 함수 목록에서 **`setupSheets`**를 선택하고 **실행**을 누릅니다 (최초 1회 구글 권한 승인 진행).
2. 구글 스프레드시트로 돌아가 `정보` 시트의 아래 셀 값을 채웁니다:
   - **B4 셀**: STEP 3에서 만든 **구글 드라이브 폴더 URL**
   - **B5 셀**: STEP 5에서 배포받은 **웹 앱 URL**
3. 배포된 웹 앱 URL로 접속하여 계좌 수집 및 파일 업로드가 정상 동작하는지 최종 테스트합니다.
