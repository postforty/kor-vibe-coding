# Antigravity IDE 2.0 서브에이전트(Subagent) 공식 가이드

Antigravity IDE 2.0의 **서브에이전트(Subagent)**는 복잡한 태스크를 병렬 처리하고 메인 대화의 컨텍스트(Context Window)를 보존하기 위해 독립된 세션으로 작업을 수행하는 비동기 전담 에이전트 아키텍처입니다.

---

## 1. 개요 및 핵심 동작 메커니즘

* **비동기 자율 실행 (Asynchronous Execution)**: 메인 에이전트는 `invoke_subagent` 도구를 호출하여 독립적인 자식 세션을 비동기로 생성합니다.
* **컨텍스트 격리 (Context Isolation)**: 서브에이전트는 메인 에이전트의 이전 대화 내역을 보류하고 깨끗한 상태(Clean slate)에서 할당된 프롬프트와 역할로 구동되어 메인 에이전트의 토큰 오염을 방지합니다.
* **워크스페이스 분리 옵션 (Workspace Options)**:
  * `inherit`: 메인 에이전트와 동일한 워크스페이스 상속
  * `branch`: 독립된 Git Worktree를 생성하여 안전하게 코드 작업
  * `share`: 디렉터리 저장소 공유
* **인터에이전트 통신 및 상령 깊이 (Inter-Agent Communication & Nesting)**:
  * Conversation ID 기반 메시지 전달을 통해 에이전트 간 통신 및 자동 깨어남(Auto-Wake) 지원.
  * 중첩 깊이는 **최대 10단계(Nesting Depth Limit: 10)**까지 제한됩니다.

---

## 2. 내장 서브에이전트 (Built-In Subagents)

Antigravity 2.0은 기본적으로 다음과 같은 내장 서브에이전트를 제공합니다:

| 내장 서브에이전트 | 설명 및 용도 |
| :--- | :--- |
| **`research`** | 코드베이스 파일 탐색, 구조 분석 및 기술 리서치 전담 |
| **`browser`** | 샌드박스 웹 브라우저를 구동하여 브라우저 인터랙션 및 테스트 전담 (`/browser` 슬래시 커맨드 및 자동 구동) |
| **`self`** | 호출한 메인 에이전트와 동일한 프롬프트 및 도구 세트를 갖춘 직접적인 자기 자신 클론 에이전트 |

---

## 3. 서브에이전트 생명주기 및 상태 (Lifecycle & States)

서브에이전트는 백그라운드에서 비동기로 실행되며 다음 3가지 상태를 가집니다:

1. **Running (실행 중)**: 주어진 태스크를 수행하며 도구(Tools)를 자율 호출. (필요 시 사용자/메인이 취소 가능)
2. **Idle (유휴 상태)**: 태스크 완료 후 메인 에이전트에 결과를 보내고 일시정지. 메시지를 받으면 다시 **Running** 상태로 자율 재개(Auto-Wake).
3. **Killed (종료)**: 에이전트 세션이 영구 종료된 상태. 생성되었던 임시 Git Worktree 등은 자동 정돈됨.

---

## 4. 커스텀 서브에이전트 정의 방법 (`.md`)

사용자는 `.md` 마크다운 파일에 **YAML Frontmatter**와 **System Prompt**를 작성하여 자신만의 커스텀 서브에이전트를 만들 수 있습니다.

### 4.1 저장 경로 (Agent Discovery)
Antigravity는 다음 경로에서 커스텀 에이전트 마크다운 파일을 자동으로 감지합니다:

* **프로젝트 전용**: `.agents/agents/<name>.md` 또는 `.agents/agents/<name>/agent.md`
* **전역(Machine-wide)**: `~/.gemini/config/agents/<name>.md` 또는 `.../agents/<name>/agent.md`
* **플러그인**: `plugins/<plugin_name>/agents/`

### 4.2 Frontmatter 속성 (YAML)

```yaml
---
name: code-auditor
description: 보안 감사, 정적 분석 및 코드 품질 리뷰를 전담하는 서브에이전트.
tools:
  - view_file
  - grep_search
  - run_command
mainAgent: false
subagent: true
model: pro
commandExecutionPolicy: sandbox
skills:
  - skills/security-checklist
---
```

* `name` *(필수)*: 서브에이전트 식별자
* `description` *(필수)*: 플래너(Planner)가 작업 위임 여부를 결정하는 데 사용하는 상세 설명
* `tools`: 허용할 도구 목록 (`view_file`, `replace_file_content`, `grep_search`, `run_command` 등)
* `mainAgent`: 채팅 메인 에이전트로 직접 선택 가능 여부 (`true`/`false`)
* `subagent`: `invoke_subagent`로 호출 가능 여부 (`true`/`false`)
* `model`: 에이전트 모델 티어 (`inherit`, `flash`, `pro`)
* `commandExecutionPolicy`: 명령어 자동 실행 정책 (`sandbox`, `off`, `auto`, `eager`)
* `skills` / `plugins`: 포함할 스킬/플러그인 경로

---

## 5. 커스텀 FE / BE 시니어 엔지니어 서브에이전트 예시

### 5.1 시니어 프런트엔드 서브에이전트 (`.agents/agents/senior-frontend.md`)
```markdown
---
name: senior-frontend
description: React, TypeScript, Next.js UI/UX 구조 검증, 웹 접근성 및 성능 리팩토링 전담 시니어 FE 에이전트
tools:
  - view_file
  - replace_file_content
  - grep_search
  - run_command
subagent: true
mainAgent: false
model: pro
commandExecutionPolicy: sandbox
---

# System Prompt
당신은 10년 차 시니어 프런트엔드 엔지니어입니다. 코드 베이스의 UI 컴포넌트 구조, 타입 안정성, 불필요한 리렌더링, 웹 접근성(a11y)을 엄격하게 리뷰하고 최적화합니다.

# Review Guidelines
1. State Colocation 원칙에 따라 상태 관리 범위를 최소화합니다.
2. Atomic Design 및 컴포넌트 재사용성을 유지합니다.
3. 성능 저하 원인(렌더링 병목)을 찾아 수정안을 제공합니다.
```

### 5.2 시니어 백엔드 서브에이전트 (`.agents/agents/senior-backend.md`)
```markdown
---
name: senior-backend
description: Java/Spring, Node.js API 아키텍처, DB 쿼리 최적화, 보안 및 트랜잭션 검증 전담 시니어 BE 에이전트
tools:
  - view_file
  - replace_file_content
  - grep_search
  - run_command
subagent: true
mainAgent: false
model: pro
commandExecutionPolicy: sandbox
---

# System Prompt
당신은 10년 차 시니어 백엔드 아키텍트입니다. RESTful API 표준화, Layered Architecture 준수, DB 인덱싱 및 보안 취약점을 심층 분석합니다.

# Review Guidelines
1. Clean Architecture 및 DTO-Entity 표준 분리를 검증합니다.
2. DB N+1 문제 및 트랜잭션 동시성 이슈를 체크합니다.
3. 예외 처리(Standard Exception Response) 규격을 준수하는지 확인합니다.
```

---

## 6. 팀워크 모드 (Multi-Agent Teamwork - Ultra Plan)

Antigravity 2.0에서는 `/teamwork-preview` 커맨드를 통해 여러 서브에이전트가 팀을 이루어 오케스트레이션 및 자동 에러 복구(Auto Retries)를 수행하는 고도화된 멀티 에이전트 협업 기능을 제공합니다.

---

## 요약

| 구분 | 메인 에이전트 (Main Agent) | 서브에이전트 (Subagent) |
| :--- | :--- | :--- |
| **호출 방식** | 사용자 직접 대화 및 지휘 | `invoke_subagent` 도구를 통한 비동기 생성 |
| **정의 경로** | - | `.agents/agents/<name>.md` 또는 `~/.gemini/config/agents/` |
| **주요 상태** | Active | Running ➔ Idle (Auto-Wake 가능) ➔ Killed |
| **내장 에이전트**| Antigravity Main | `research`, `browser`, `self` |
| **특징** | 전체 컨텍스트 관리 및 오케스트레이션 | 깨끗한 세션(Clean Slate) 독립 실행으로 토큰 및 맥락 보존 |
