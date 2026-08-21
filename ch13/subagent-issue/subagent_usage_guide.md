# Antigravity 서브에이전트 활용 매뉴얼 (세션 컨텍스트 오염 방지)

본 문서는 **IDE 메인 채팅창의 컨텍스트 오염(Context Window Pollution)을 방지**하면서, 독립된 환경에서 대규모 코드 탐색, 리서치, 분석 작업을 수행하기 위한 **서브에이전트 활용 가이드**입니다.

---

## 📌 왜 서브에이전트를 사용해야 하는가?

* **문제점**: 메인 채팅창에서 수십 개의 파일을 검색하고 분석하면, 방대한 도구 호출 로그와 원문 코드가 대화 히스토리에 쌓여 **컨텍스트 창이 낭비되고 에이전트의 집중도와 응답 품질이 저하**됩니다.
* **해결책**: 독립된 프로세스(서브에이전트)에서 탐색 및 조사를 수행하게 한 뒤, **정제된 최종 요약 보고서 파일(`.md`) 1개만 메인 세션으로 전달**받아 컨텍스트를 완벽하게 격리합니다.

```mermaid
flowchart TD
    subgraph 메인 세션 (IDE Chat)
        MainAgent["메인 에이전트"]
        User["사용자"]
        User -->|리서치 요청| MainAgent
        MainAgent -->|1. 백그라운드 호출| Runner
        MainAgent -->|3. 최종 결과 파일만 참조| ResultFile[("📄 research_report.md")]
    end

    subgraph 격리된 서브에이전트 환경
        Runner["서브에이전트 실행기\n(agy CLI 또는 Python SDK)"]
        SubAgent["독립 서브에이전트"]
        Workspace[("코드베이스 / 문서")]
        
        Runner --> SubAgent
        SubAgent <-->|수십 번의 파일 탐색/분석| Workspace
        SubAgent -->|2. 요약 보고서 작성| ResultFile
    end
```

---

## 1. 방법 1: `agy` CLI 백그라운드 실행 방식

가장 간편하게 커맨드라인 인터페이스(`agy`)를 백그라운드로 띄워 서브에이전트 역할을 맡기는 방식입니다.

### 1.1 사전 준비
터미널에서 `agy` 명령어가 정상 동작하는지 확인합니다.
```powershell
agy --version
```

### 1.2 실행 원리 및 프롬프트 규칙
서브에이전트가 화면에 출력만 하고 끝내지 않고 **반드시 결과 마크다운 파일을 생성하도록 지시**하는 것이 핵심입니다.

### 1.3 메인 채팅창에서 실행 요청하기 (예시)
메인 대화창에서 에이전트에게 아래와 같이 요청합니다:

> **사용자 요청 예시:**  
> "터미널에서 `agy`를 백그라운드로 실행해서 `ewa-was` 프로젝트의 OnRamp 관련 트랜잭션 흐름을 심층 조사해줘. 결과는 `workspace/onramp_research.md` 파일로 작성하도록 프롬프트를 전달해줘."

### 1.4 수동/터미널 직접 실행 명령어 (Windows PowerShell)
```powershell
# 1. 비대화형 모드로 프롬프트를 전달하여 백그라운드 리서치 수행
agy "c:/Users/up/Documents/GitHub/cbdc/cbdc_2nd_release/ewa-was 디렉토리의 OnRampCommandHandler 및 관련 클래스들을 분석하여 트랜잭션 처리 흐름과 예외 처리 로직을 정리하고, 그 결과를 c:/Users/up/Documents/GitHub/cbdc/cbdc_2nd_release/ewa-web/workspace/onramp_analysis.md 파일로 저장해줘."
```

### 1.5 메인 세션에서 결과 확인
서브에이전트 작업이 완료되면, 메인 채팅창에서는 결과 파일만 불러옵니다.
```text
@file:c:/Users/up/Documents/GitHub/cbdc/cbdc_2nd_release/ewa-web/workspace/onramp_analysis.md 파일을 확인하고 다음 단계 구현을 진행해줘.
```

---

## 2. 방법 2: Antigravity Python SDK 오케스트레이션 방식

파이썬 스크립트(`google-antigravity`)를 통해 에이전트의 역할(System Instruction)과 권한(Capabilities)을 정밀하게 제어하고 자동화하는 방식입니다.

### 2.1 사전 준비
Python 환경에 SDK를 설치합니다:
```bash
pip install google-antigravity
```

### 2.2 범용 서브에이전트 러너 스크립트 작성
재사용 가능한 리서처 스크립트를 하나 작성해 둡니다.

* **스크립트 경로**: [`workspace/run_research_subagent.py`](file:///c:/Users/up/Documents/GitHub/cbdc/cbdc_2nd_release/ewa-web/workspace/run_research_subagent.py)

```python
import asyncio
import sys
import os
from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig

async def main():
    if len(sys.argv) < 3:
        print("사용법: python run_research_subagent.py <타겟_디렉토리> <결과_저장_경로> <리서치_지시사항>")
        sys.exit(1)

    target_dir = sys.argv[1]
    output_file = sys.argv[2]
    task_prompt = sys.argv[3]

    # 서브에이전트 전용 시스템 지침 설정
    system_prompt = f"""
    당신은 코드베이스 심층 분석 및 기술 리서치를 전담하는 전문 서브에이전트입니다.
    주어진 작업 디렉토리의 코드를 정밀하게 분석하고 핵심 내용을 구조화된 마크다운 보고서로 작성해야 합니다.
    
    [중요 규칙]
    1. 분석이 완료되면 반드시 최종 결과를 '{output_file}' 파일에 마크다운 형식으로 작성(Write)하십시오.
    2. 다이어그램(Mermaid), 클래스/메서드 호출 관계, 핵심 로직 흐름을 상세히 포함하십시오.
    """

    config = LocalAgentConfig(
        system_instructions=system_prompt,
        capabilities=CapabilitiesConfig()  # 파일 읽기/쓰기 및 도구 실행 활성화
    )

    print(f"[*] 서브에이전트 리서치 시작 (대상: {target_dir})")
    print(f"[*] 결과 저장 대상: {output_file}")

    # 지정된 작업 디렉토리(cwd)를 기준으로 에이전트 실행
    async with Agent(config, cwd=target_dir) as agent:
        full_instruction = f"{task_prompt}\n\n결과는 반드시 '{output_file}' 파일에 저장하십시오."
        response = await agent.chat(full_instruction)
        
        # 진행 상황 스트리밍 출력
        async for token in response:
            sys.stdout.write(token)
            sys.stdout.flush()

    print(f"\n[+] 리서치 완료: {output_file}")

if __name__ == "__main__":
    asyncio.run(main())
```

### 2.3 실행 방법
터미널 또는 메인 에이전트가 백그라운드 명령으로 실행합니다:

```powershell
# Java WAS 프로젝트 대상 리서치 실행 예시
python c:/Users/up/Documents/GitHub/cbdc/cbdc_2nd_release/ewa-web/workspace/run_research_subagent.py `
  "c:/Users/up/Documents/GitHub/cbdc/cbdc_2nd_release/ewa-was" `
  "c:/Users/up/Documents/GitHub/cbdc/cbdc_2nd_release/ewa-web/workspace/onramp_flow_report.md" `
  "OnRampCommandHandler 클래스에서 시작되는 전체 이벤트 발행 및 DB 저장 흐름을 분석해줘."
```

---

## 3. 두 방식 비교 및 권장 시나리오

| 항목 | 방법 1: `agy` CLI 백그라운드 | 방법 2: Python SDK 러너 |
| :--- | :--- | :--- |
| **적합한 상황** | 즉흥적인 단발성 리서치, 빠른 조사 | 정형화된 분석 파이프라인, CI/CD 자동화 |
| **설정 복잡도** | 매우 낮음 (`agy` 명령어만 사용) | 보통 (Python 스크립트 작성 필요) |
| **제어 세밀도** | 기본 CLI 옵션 기반 | 프롬프트, 도구 권한, 출력 형식 정밀 제어 가능 |
| **컨텍스트 격리** | 완벽히 격리됨 (결과 파일만 생성) | 완벽히 격리됨 (결과 파일만 생성) |

---

## 💡 컨텍스트 오염 방지를 위한 실무 Best Practice

1. **`@conversation` 대신 `@file` 사용**:
   * 대화창을 따로 열어 수동으로 조사했을 때도 `@conversation`으로 이전 대화를 불러오면 전체 히스토리가 들어와 세션이 오염됩니다.
   * 조사창에서 **"핵심만 `summary.md`로 저장해줘"**라고 한 뒤 메인 창에서 **`@file:summary.md`**로 참조하십시오.
2. **서브에이전트 프롬프트에 명확한 출력 파일명 명시**:
   * 서브에이전트 실행 시 항상 *"결과를 `workspace/<파일명>.md` 파일로 작성하라"*는 지침을 포함하십시오.
3. **작업 완료 후 결과 파일만 메인 세션에 주입**:
   * 메인 에이전트는 생성된 결과 파일만 읽어 즉시 코딩/리팩토링/테스트 작업에 착수합니다.
