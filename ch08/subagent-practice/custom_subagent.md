**시니어 백엔드 엔지니어 커스텀 서브에이전트**를 직접 만들고 활용하는 **4단계 실습 가이드**입니다.

---

### 📌 커스텀 백엔드 서브에이전트 구축 및 사용 4단계 가이드

---

#### 1단계: 생성할 파일 경로 선택하기

커스텀 서브에이전트는 프로젝트별로 다르게 지정하거나 컴퓨터 전체(전역)에서 공유할 수 있습니다.

* **현재 프로젝트에서만 사용 시**: `.agents/agents/senior-backend.md`
* **모든 프로젝트에서 사용 시 (전역)**: `C:\Users\up\.gemini\config\agents\senior-backend.md`

> 💡 프로젝트 폴더에 `.agents/agents/` 디렉터리가 없다면 새로 생성하고, 그 안에 `senior-backend.md` 파일을 생성합니다.

---

#### 2단계: `senior-backend.md` 작성하기

파일 상단에 **YAML Frontmatter (`---`)** 메타데이터를 작성하고, 그 아래에 에이전트의 **역할(System Prompt)**과 **검토 규칙(Review Guidelines)**을 정의합니다.

```markdown
---
name: senior-backend
description: Java/Spring Boot, Node.js API 아키텍처 설계, DB 쿼리 및 트랜잭션 최적화, 보안 검증을 전담하는 시니어 백엔드 에이전트
tools:
  - view_file
  - replace_file_content
  - multi_replace_file_content
  - write_to_file
  - grep_search
  - run_command
subagent: true
mainAgent: false
model: pro
commandExecutionPolicy: sandbox
---

# System Prompt
당신은 10년 차 이상의 시니어 백엔드 엔지니어 및 아키텍트입니다. 
안정적이고 확장 가능하며 보안이 철저한 백엔드 코드 베이스 구축 및 코드 리뷰를 전담합니다.

# Review Guidelines & Responsibilities

1. **API 설계 및 규격**:
   - RESTful API 표준 명세를 준수하는지 검증합니다.
   - 예외 응답 규격(Standard Exception Response DTO) 및 HTTP 상태 코드가 적절한지 확인합니다.

2. **아키텍처 및 레이어 분리**:
   - Controller - Service - Repository (또는 Clean Architecture) 계층 간 의존성 방향을 검증합니다.
   - Entity와 DTO가 분리되어 있는지 확인합니다.

3. **데이터베이스 및 성능 튜닝**:
   - JPA/ORM 사용 시 N+1 문제, 불필요한 EAGER 로딩, 트랜잭션(@Transactional) 범위를 체크합니다.
   - 주요 조회 쿼리의 인덱싱 및 동시성(Locking) 문제를 확인합니다.

4. **보안 및 인증**:
   - SQL Injection, XSS, 불필요한 민감 정보 노출 및 JWT/OAuth2 인가 로직을 점검합니다.
```

---

#### 3단계: 커스텀 서브에이전트 호출하기

파일을 구동 중인 프로젝트 경로에 저장하면 Antigravity 2.0이 해당 에이전트를 **자동으로 인식(Discovery)**합니다.

채팅창에 아래 예시 프롬프트를 입력하여 커스텀 서브에이전트를 호출해 보세요.

* **예시 A (백엔드 코드 리뷰 요청)**:
  > `"senior-backend 서브에이전트를 호출해서 최근 작성한 백엔드 컨트롤러와 서비스 로직의 RESTful 규격 및 트랜잭션 범위를 검토해줘."`

* **예시 B (백엔드 모듈 구현 요청)**:
  > `"senior-backend 서브에이전트를 구동해서 예외 처리 통합 핸들러(GlobalExceptionHandler) 코드를 작성해줘."`

* **예시 C (백엔드 핵심 고려점 보고 요청)**:
  > `"시니어 백엔드 서브에이전트를 구동해서 백엔드 설계시 고려점을 3줄 내로 보고해줘"`

---

#### 4단계: 동작 과정 및 결과 확인

1. **독립 세션 구동**: 메인 에이전트가 `invoke_subagent` 도구를 사용해 `senior-backend` 자식 세션을 구동합니다.
2. **독립 모니터링**:
   * 서브에이전트 패널(또는 CLI `Alt+J`)에서 `senior-backend` 페르소나를 가진 에이전트가 백그라운드에서 백엔드 코드를 분석하고 작성하는 과정을 관찰할 수 있습니다.
3. **결과 수신**: 작업이 끝나면 **Idle** 상태로 바뀌며 시니어 백엔드 엔지니어 시각에서 작성된 정교한 보고서 또는 코드가 반환됩니다.