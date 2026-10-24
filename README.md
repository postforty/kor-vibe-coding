# 🚀 AI 바이브코딩 (Vibe Coding) 실무 가이드

> **"코더에서 설계자로, AI 에이전트를 지휘하는 에이전틱 엔지니어링의 시작"**  
> 본 저장소는 Google Antigravity, Gemini API 모델, 다양한 AI 모델 및 최신 개발 도구를 활용하여 기획부터 배포·포트폴리오 완성까지 실습하는 **AI 바이브코딩 실무 과정**의 강의 노트 및 실습 코드 저장소입니다.

<p align="left">
  <img src="https://img.shields.io/badge/Antigravity_(Non--IDE)-Agentic_Coding-4285F4?style=flat-square&logo=google" alt="Antigravity (Non-IDE)" />
  <img src="https://img.shields.io/badge/Gemini_API-Model-8E75C4?style=flat-square&logo=google-gemini" alt="Gemini API" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-Deployment-black?style=flat-square&logo=vercel" alt="Vercel" />
</p>

---

## 📌 목차 (Table of Contents)

- [과정 개요 및 핵심 원칙](#-과정-개요-및-핵심-원칙)
- [일차별 커리큘럼 한눈에 보기](#-일차별-커리큘럼-한눈에-보기)
- [일차별 상세 커리큘럼 로드맵](#-일차별-상세-커리큘럼-로드맵)
  - [[1일차] 바이브코딩 시작과 안티그래비티 환경 설정](#-1일차-바이브코딩-시작과-안티그래비티-환경-설정)
  - [[2일차] LLM의 원리와 마크다운 문서화](#-2일차-llm의-원리와-마크다운-문서화)
  - [[3일차] 프롬프트 엔지니어링과 웹 기초](#-3일차-프롬프트-엔지니어링과-웹-기초)
  - [[4일차] 컨텍스트 관리, Rules, Git & Cloudflare 배포](#-4일차-컨텍스트-관리-rules-git--cloudflare-배포)
  - [[5일차] 실전 외주 워크플로우(Workflow) & Mytion 데스크톱 앱](#-5일차-실전-외주-워크플로우workflow--mytion-데스크톱-앱)
  - [[6일차] 의심과 실험, 그리고 SNS / 메모 앱 구현](#-6일차-의심과-실험-그리고-sns--메모-앱-구현)
  - [[7일차] 프런트엔드 아키텍처와 Supabase BaaS(Backend-as-a-Service) 연동](#-7일차-프런트엔드-아키텍처와-supabase-baasbackend-as-a-service-연동)
  - [[8일차] 페르소나 프롬프팅 & Vercel 배포](#-8일차-페르소나-프롬프팅--vercel-배포)
  - [[9일차] 에이전트와 하네스(Harness)의 개념](#-9일차-에이전트와-하네스harness의-개념)
  - [[10일차] 툴 콜링(Tool Calling) & Jemini 풀스택 개발](#-10일차-툴-콜링tool-calling--jemini-풀스택-개발)
  - [[11일차] 커스텀 Skill 제작 & 자동화 워크플로우(Workflow) 구축](#-11일차-커스텀-skill-제작--자동화-워크플로우workflow-구축)
  - [[12일차] 제약 프롬프트, 디자인 시스템 & Render 배포](#-12일차-제약-프롬프트-디자인-시스템--render-배포)
  - [[13일차] Git 체크포인트 (세이브포인트) & 멀티 모델 / RAG 챗봇](#-13일차-git-체크포인트-세이브포인트--멀티-모델--rag-챗봇)
  - [[14일차] 구글 로그인(OAuth 2.0) & 토스페이먼츠 결제 MCP & GA4](#-14일차-구글-로그인oauth-20--토스페이먼츠-결제-mcp--ga4)
  - [[15일차] 오픈 API(Open API) 연동 & Google Apps Script 업무 자동화](#-15일차-오픈-apiopen-api-연동--google-apps-script-업무-자동화)
  - [[16일차] 보안 암호화, 고급 확장 & 포트폴리오 발표](#-16일차-보안-암호화-고급-확장--포트폴리오-발표)
- [도서 및 주요 참고 링크](#-도서-및-주요-참고-링크)
- [상세 커리큘럼 문서](#-상세-커리큘럼-문서)

---

## 💡 과정 개요 및 핵심 원칙

> [!NOTE]
> **교육 철학: 에이전틱 엔지니어링 (Agentic Engineering)**  
> 코드를 한 줄씩 타이핑하는 대신, **"설계서(프롬프트) 작성 → AI 에이전트 실행 → 결과물 검증 → 설계서 개선"**의 사이클로 개발을 지휘합니다.

1. **설계자형 개발 역량**: 프롬프트와 규칙(`AGENTS.md`, `rules`, `workflows`)을 정교하게 설계하여 AI에게 위임합니다.
2. **토큰 이코노미 (Token Economy)**: 가벼운 작업(Flash/기획)과 깊은 추론(Pro/검증) 모델을 유연하게 스위칭하여 생산성과 비용을 최적화합니다.
3. **에이전트 오케스트레이션**: 기획, 아키텍트, 프런트엔드, 백엔드, 코드 리뷰어 서브 에이전트를 병렬로 운용합니다.

---

## 🧭 일차별 커리큘럼 한눈에 보기

| 일차 | 핵심 주제 | 주요 실습 및 다루는 도구 |
| :---: | :--- | :--- |
| **[1일차](#-1일차-바이브코딩-시작과-안티그래비티-환경-설정)** | 바이브코딩 시작과 환경 설정 | 터미널 조작, 사과게임, 보라부산 사례 분석 |
| **[2일차](#-2일차-llm의-원리와-마크다운-문서화)** | LLM의 원리와 마크다운 문서화 | 다음 토큰 예측(Next-Token Prediction), 마크다운, Mermaid, draw.io(diagrams.net) |
| **[3일차](#-3일차-프롬프트-엔지니어링과-웹-기초)** | 프롬프트 엔지니어링과 웹 기초 | reveal.js, make-slide, HTML/CSS/JS 기초 |
| **[4일차](#-4일차-컨텍스트-관리-rules-git--cloudflare-배포)** | 컨텍스트 관리, Rules, Git & 배포 | uv, .env, 3D 명함 페이지, Cloudflare Pages |
| **[5일차](#-5일차-실전-외주-워크플로우workflow--mytion-데스크톱-앱)** | 실전 외주 워크플로우(Workflow) & 데스크톱 앱 | Rules 고정, Mytion (Next.js + Tauri 데스크톱 앱) |
| **[6일차](#-6일차-의심과-실험-그리고-sns--메모-앱-구현)** | 의심과 실험, SNS / 메모 앱 | Outstargram(Next.js), 다크모드, Stitch 메모 앱 |
| **[7일차](#-7일차-프런트엔드-아키텍처와-supabase-baasbackend-as-a-service-연동)** | 프런트엔드 아키텍처와 Supabase 연동 | 토큰 이코노미, Tailwind, shadcn/ui, Supabase Auth |
| **[8일차](#-8일차-페르소나-프롬프팅--vercel-배포)** | 페르소나 프롬프팅 & Vercel 배포 | 사서 vs 개발자 페르소나, 코드 리뷰, Vercel 배포 |
| **[9일차](#-9일차-에이전트와-하네스harness의-개념)** | 에이전트와 하네스(Harness)의 개념 | AGENTS.md, SKILL.md, 서브 에이전트 분리, 프로젝트 킥오프 |
| **[10일차](#-10일차-툴-콜링tool-calling--jemini-풀스택-개발)** | 툴 콜링(Tool Calling) & Jemini 풀스택 개발 | /grill-me, Jemini(React+FastAPI), FSD, TDD |
| **[11일차](#-11일차-커스텀-skill-제작--자동화-워크플로우workflow-구축)** | 커스텀 Skill 제작 & 자동화 워크플로우(Workflow) | 날씨/주식 Skill, /commit, /tdd, Todo-List 하네스 |
| **[12일차](#-12일차-제약-프롬프트-디자인-시스템--render-배포)** | 제약 프롬프트, 디자인 시스템 & Render 배포 | 모델별 제약 프롬프트, DESIGN.md, Render/Supabase 배포 |
| **[13일차](#-13일차-git-체크포인트-세이브포인트--멀티-모델--rag-챗봇)** | Git 체크포인트 (세이브포인트) & 멀티 모델 / RAG | 롤백 전략, LangChain, Ollama/NVIDIA NIM, RAG 챗봇 |
| **[14일차](#-14일차-구글-로그인oauth-20--토스페이먼츠-결제-mcp--ga4)** | 구글 로그인(OAuth 2.0) & 토스페이먼츠 결제 MCP & GA4 | Google Login, 사용량 모달, Toss 결제 연동, GA4 |
| **[15일차](#-15일차-오픈-apiopen-api-연동--google-apps-script-업무-자동화)** | 오픈 API(Open API) 연동 & Google Apps Script | 브이월드(Vworld) GIS, 공공 데이터 대시보드, GAS 가계부 자동화 |
| **[16일차](#-16일차-보안-암호화-고급-확장--포트폴리오-발표)** | 보안 암호화, 고급 확장 & 포트폴리오 | AES-256-GCM 암호화, Plugin/Hook, 포트폴리오 발표 |

---

## 🗓️ 일차별 상세 커리큘럼 로드맵

### 📅 [1일차] 바이브코딩 시작과 안티그래비티 환경 설정
- **강사 및 수업 소개**: 수업 일정, 교재 안내, 필수 서비스 계정 가입 확인
- **바이브코딩 사례 탐색**: [보라부산 (Bora Busan)](https://bora-busan.vercel.app/ko) 실제 서비스 분석
- **개발 환경 설정**: 터미널 기본 조작 및 에디터 설치
- **터미널 & 안티그래비티 실습**: 터미널 명령어 익히기 및 [사과게임 (Fruit Box)](https://www.gamesaien.com/game/fruit_box_a/) 실습 진행

---

### 📅 [2일차] LLM의 원리와 마크다운 문서화
- **도입 질문**: *"AI는 영혼이 있을까?"* vs *"운동화 끈 묶는 방법을 알려줘"*
  - 확률 기반 다음 토큰 예측(Next-Token Prediction) 메커니즘의 본질 이해
- **영상 학습**: LLM 원리 유튜브 영상 시청 및 확률 기계로서의 AI 특성 학습
- **마크다운(Markdown) 기초**: 개발 문서 작성을 위한 필수 마크다운 문법
- **문서화 도구 실습**: 바이브 코딩 역사 문서 작성, `pandoc`, `Mermaid` 다이어그램, `draw.io(diagrams.net)` 활용

---

### 📅 [3일차] 프롬프트 엔지니어링과 웹 기초
- **도입 질문**: *"AI의 답변은 진실일까? 거짓일까?"* → 환각(Hallucination) 극복을 위한 프롬프트 전략
- **강의 자료 학습**:
  - [LLM의 기초와 동작 원리](https://github.com/postforty/workshop/blob/main/ax_poongsan_260312/ch01/LLM.md)
  - [프롬프트 엔지니어링 기법](https://github.com/postforty/workshop/blob/main/genai_workshop_260716/ch02/prompt_engineering.md)
- **Node.js 환경 구축**: `nvm` 설치 및 노드 버전 관리
- **프레젠테이션 제작 실습**: `reveal.js`, `make-slide` Skill, Genspark를 활용한 슬라이드 자동 생성
- **웹 기본기 다지기**: HTML → CSS → JavaScript 기초 학습 ([PoiemaWeb](https://poiemaweb.com/))

---

### 📅 [4일차] 컨텍스트 관리, Rules, Git & Cloudflare 배포
- **도입 질문**: *"LLM은 기억을 할 수 있을까?"* → 컨텍스트 윈도우와 Gemini API 모델의 메모리 특성
- **Python 환경 구축**: 초고속 패키지 매니저 `uv` 설치 및 프로젝트 `rules` 설정
- **보안 및 환경 변수**: `.env` 파일과 민감 정보 격리
- **인터랙티브 웹 실습**: 3D 입체 명함 효과를 적용한 자기소개 페이지 제작
- **버전 관리 및 배포**: Git/GitHub 워크플로우(Workflow) 설정 후 [Cloudflare Pages](https://pages.cloudflare.com/)에 정적 웹 배포

---

### 📅 [5일차] 실전 외주 워크플로우(Workflow) & Mytion 데스크톱 앱
- **바이브코딩으로 외주 프로젝트 수행하기**:
  - 교재 참고: [요즘 바이브 코딩 커서 X 클로드 코드 실전 외주 돈 벌기](https://goldenrabbit.co.kr/books/9791124516010) (골든래빗)
- **일관성을 위한 Rules 적용**: 프롬프트 규칙 파일로 에이전트 출력 품질 고정
- **Python 윈도우 프로그램 제작**: 업무 자동화 스크립트 작성
- **Mytion 프로젝트**:
  - Next.js 기반 노션(Notion) 스타일의 블록형 마크다운 에디터 구현
  - Tauri를 활용하여 경량 윈도우 데스크톱 실행 파일(`.exe`)로 패키징

---

### 📅 [6일차] 의심과 실험, 그리고 SNS / 메모 앱 구현
- **의심하고 실험하라**: 에디터 코드 영역 vs 터미널 영역에서의 `Ctrl+L` 단축키 동작 차이 분석 (`cls` 클리어 적극 권장)
- **Outstargram 프로젝트**: Next.js 기반 인스타그램 클론 웹 애플리케이션 제작
- **테마 시스템 구현**: `localStorage`를 활용한 클라이언트 측 라이트/다크 모드 상태 저장
- **My-Memo 프로젝트**: Stitch UI 디자인 도구를 연동한 인터랙티브 메모 앱 프로토타이핑

---

### 📅 [7일차] 프런트엔드 아키텍처와 Supabase BaaS(Backend-as-a-Service) 연동
- **프런트엔드 생태계 이해**: 라이브러리 vs 프레임워크 비교 ([PoiemaWeb](https://poiemaweb.com/))
- **도서 소개**: 『커서로 시작하는 AI코딩 입문』
- **토큰 이코노미 실전**: 최신 모델(Gemini Flash)로 기획/구현 계획 초안 작성 → 고급 모델(Gemini Pro)로 검증 및 고도화
- **Coffee-Order-App 프로젝트 (1단계)**:
  - Tailwind CSS를 활용한 반응형 스타일링
  - Context7 MCP와 shadcn/ui 컴포넌트 라이브러리 결합
  - Supabase MCP 연결, 회원가입 및 데이터베이스 테이블 설계
  - Supabase Auth를 활용한 Admin 로그인 기능 (`Authentication` > `Users`)

---

### 📅 [8일차] 페르소나 프롬프팅 & Vercel 배포
- **페르소나 프롬프팅의 힘**:  
  - *"라이브러리에 대해 어떻게 생각해?"* vs *"사서 관점에서"* vs *"소프트웨어 아키텍트 관점에서"*
- **체계적 코드 리뷰**: *"시니어 코드 리뷰어로서 단계별로 면밀히 분석해서 개선점을 보고해줘"* 프롬프트 패턴
- **Coffee-Order-App 프로젝트 (2단계)**:
  - [Vercel](https://vercel.com/) 가입 및 원클릭 CI/CD 배포 파이프라인 완성

---

### 📅 [9일차] 에이전트와 하네스(Harness)의 개념
- **에이전트 아키텍처**:  
  - $\text{Agent} = \text{Model} + \text{Harness}$ ([LangChain: The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness))
- **`AGENTS.md` 파일 설계**: 글로벌 에이전트 행동 지침 및 제약사항 선언
- **`SKILL.md` 스킬 시스템**: 상황별 톤앤매너 전환 (개조식(음슴체) 요약 메모 / 정중체 고객 안내문 / 신조어 메신저 등)
- **서브 에이전트(Sub-agents) 운용**:
  - 내장 서브 에이전트 (`browser`)
  - 안티그래비티 (Non-IDE)에서 역할별 전문 에이전트 분리 (기획자, 시스템 아키텍트, 프런트엔드, 백엔드, 코드 리뷰어)
- **개인 프로젝트 킥오프**: 나만의 최종 프로젝트 아이디어 기획 및 진행 시작

---

### 📅 [10일차] 툴 콜링(Tool Calling) & Jemini 풀스택 개발
- **에이전트의 현실 인식**: *"AI 에이전트는 지금 시간을 알 수 있을까?"*
- **도구(Tools) 연동 실습**: Gemini API 도구 바인딩 (시계 도구, 실시간 부산 날씨 도구)
- **구현 계획 도출**: `/grill-me` 인터뷰 슬래시 커맨드를 통한 요구사항 도출
- **Jemini 프로젝트 구축**:
  - React.js 프런트엔드 + FastAPI 백엔드
  - 세션별 대화 목록 저장, 조회, 이어 말하기(Multi-turn Session) 지원
- **설계 원칙 적용**: 백엔드 클린 코드, TDD, 프런트엔드 FSD(Feature-Sliced Design)
- **안드레이 카파시(Andrej Karpathy) 코딩 가이드라인 스킬 적용**: 체계적인 리팩토링 및 가이드라인 반영

---

### 📅 [11일차] 커스텀 Skill 제작 & 자동화 워크플로우(Workflow) 구축
- **Skill 직접 만들기**: 실시간 날씨 조회 스크립트 도구 및 주식 시세 정보 Skill 구현
- **워크플로우(Workflow) 슬래시 커맨드**:
  - `/commit`: 컨텍스트 기반 규격 커밋 메시지 자동 생성
  - `/tdd`: 테스트 케이스 우선 작성 및 통과 검증 워크플로우(Workflow)
- **Todo-List 프로젝트 (하네스 종합 적용)**:
  - `AGENTS.md`, `DESIGN.md`, custom skills, Context7 MCP, Supabase MCP 통합 적용

---

### 📅 [12일차] 제약 프롬프트, 디자인 시스템 & Render 배포
- **에이전트의 자기 인식 및 환각 제어**:  
  - *"안티그래비티의 서브 에이전트에 대해 알고 있다면 설명하고, 모르면 추측하지 말고 모른다고 답해"* (모델별 제약 프롬프트 검증)
- **Todo-List 배포**: GitHub 계정 연동 [Render](https://render.com/) 웹 서비스 및 Supabase DB 프로덕션 배포
- **Jemini 프로젝트 고도화**:
  - 모노레포 구조화 및 FSD / TDD 완성
  - 답변 생성 시 동적 추천 프롬프트 버튼 생성 기능 추가
  - 통일된 UI/UX 디자인 가이드라인 문서(`DESIGN.md`) 적용
  - Jemini 전체 스택 Render 및 Supabase 프로덕션 배포

---

### 📅 [13일차] Git 체크포인트 (세이브포인트) & 멀티 모델 / RAG 챗봇
- **위기 관리**: *"AI 에이전트가 멀쩡한 코드를 망쳐 놨다면?"* → Git 체크포인트(세이브포인트) 활용과 롤백 전략
- **LangChain 연동 (Context7 MCP)**: 다양한 AI 공급자(Multi-vendor) 교체 인터페이스 구성
- **로컬 & 엔터프라이즈 모델**: Ollama 및 [NVIDIA NIM](https://build.nvidia.com/) 클라우드 모델 호출
- **Supabase 인증 연동 및 RAG 챗봇**: 지식 베이스 기반 검색 증강 생성(RAG) 파이프라인 구축

---

### 📅 [14일차] 구글 로그인(OAuth 2.0) & 토스페이먼츠 결제 MCP & GA4
- **인증 및 사용량 제어**:
  - [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 소셜 로그인
  - 3회 초과 질문 시 로그인 유도 모달 팝업 (`/grill-me` 기획 적용)
- **전자결제 연동**:
  - [토스페이먼츠(Toss Payments) LLM 가이드](https://docs.tosspayments.com/guides/v2/get-started/llms-guide#mcp-%EC%84%9C%EB%B2%84-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0) 기반 결제 MCP 연동
- **사용자 행동 분석**: Google Analytics 4 (GA4) 트래킹 태그 삽입

---

### 📅 [15일차] 오픈 API(Open API) 연동 & Google Apps Script 업무 자동화
- **공공 데이터 & GIS 연동**: 브이월드(Vworld) API 지오코딩 및 지도 시각화
- **공공 데이터 대시보드 제작**: 실시간 오픈 API 데이터 가공 및 차트 렌더링
- **Google Workspace 자동화**:
  - Google Apps Script(GAS) & clasp 연동
  - 구글 스프레드시트 스마트 가계부 및 지출 분석 대시보드 구축

---

### 📅 [16일차] 보안 암호화, 고급 확장 & 포트폴리오 발표
- **My-Profile 프로젝트**: 바이브코딩 종합 포트폴리오 웹사이트 제작
- **안티그래비티 고급 확장**: Plugin 시스템 및 생명주기 Hook 활용
- **엔드투엔드 데이터 보안 암호화**:
  - DB 확장 의존성을 줄이고, FastAPI 백엔드에서 `AES-256-GCM`으로 `messages.content`를 암호화하여 Supabase에 안전하게 적재
- **수료식 및 최종 프로젝트 발표**: 문제 해결 경험 공유, 코드 리뷰 및 향후 커리어 로드맵 설정

---

## 📚 도서 및 주요 참고 링크

| 분류 | 링크 / 출처 | 설명 |
| :--- | :--- | :--- |
| **교재** | [요즘 바이브 코딩 안티그래비티 완벽 가이드](https://goldenrabbit.co.kr/) | 골든래빗, 2026 (최지호 저) |
| **참고 도서** | [요즘 바이브 코딩 커서 X 클로드 코드 실전 외주 돈 벌기](https://goldenrabbit.co.kr/books/9791124516010) | 골든래빗 실전 외주 바이블 |
| **배포 가이드** | [웹 서비스 배포 방법 총정리 (요즘IT)](https://yozm.wishket.com/magazine/detail/3662/) | 클라우드 플랫폼별 배포 비교 |
| **개발 프로세스** | [소프트웨어 개발 5단계 프로세스](https://codedragon.tistory.com/9099) | 기획-설계-구현-테스트-배포 원칙 |
| **클라우드 배포** | [Render 공식 사이트](https://render.com/) | 백엔드(FastAPI) 및 웹 서비스 배포 |
| **브라우저 자동화** | [브라우저 제어와 자동화 가이드 (위키독스)](https://wikidocs.net/331007?utm_source=perplexity) | 웹 브라우저 에이전트 제어 |
| **결제 시스템** | [토스페이먼츠 MCP 서버 활용 가이드 (Toss Tech)](https://toss.tech/article/tosspayments-mcp) | LLM 결제 MCP 연동 공식 아티클 |
| **전자책 뷰어** | [YES24 eBook PC 뷰어 안내](https://www.yes24.com/notice/ebookguide/guide_pc.aspx) | 전자교재 열람 가이드 |

---

## 📑 상세 커리큘럼 문서

회차별/교시별 상세 수업 계획, 시간표, 루브릭 및 학습 목표는 아래 문서에서 확인하실 수 있습니다.

👉 **[상세 교육과정 커리큘럼 전문 보기 (`detail_curriculum.md`)](./curriculum/detail_curriculum.md)**
