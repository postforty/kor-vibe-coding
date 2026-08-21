import asyncio
import sys
import os

try:
    from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig
except ImportError:
    print("[!] 'google-antigravity' 패키지가 설치되어 있지 않습니다.")
    print("[!] 실행 명령어: pip install google-antigravity")
    sys.exit(1)

async def main():
    if len(sys.argv) < 4:
        print("=" * 60)
        print(" [Antigravity 리서치 전용 서브에이전트 러너] ")
        print("=" * 60)
        print("사용법:")
        print("  python run_research_subagent.py <타겟_디렉토리> <결과_저장_경로> <리서치_지시사항>")
        print("\n예시:")
        print("  python run_research_subagent.py \"../ewa-was\" \"./workspace/onramp_analysis.md\" \"OnRamp 트랜잭션 흐름 분석\"")
        sys.exit(1)

    target_dir = os.path.abspath(sys.argv[1])
    output_file = os.path.abspath(sys.argv[2])
    task_prompt = sys.argv[3]

    system_prompt = f"""
당신은 코드베이스 심층 분석 및 기술 리서치를 전담하는 전문 서브에이전트입니다.
주어진 작업 디렉토리의 코드를 정밀하게 분석하고 핵심 내용을 구조화된 마크다운 보고서로 작성해야 합니다.

[필수 규칙]
1. 분석이 완료되면 반드시 최종 결과를 '{output_file}' 파일에 마크다운 형식으로 작성(Write)하십시오.
2. 다이어그램(Mermaid), 클래스/메서드 호출 관계, 핵심 로직 흐름을 상세히 포함하십시오.
3. 메인 세션의 컨텍스트 오염을 막기 위해 핵심 결론 위주로 정제하여 명확하게 작성하십시오.
"""

    config = LocalAgentConfig(
        system_instructions=system_prompt,
        capabilities=CapabilitiesConfig()
    )

    print(f"[*] 서브에이전트 리서치 시작 (대상 디렉토리: {target_dir})")
    print(f"[*] 결과 저장 대상 파일: {output_file}")
    print("-" * 60)

    async with Agent(config, cwd=target_dir) as agent:
        full_instruction = f"{task_prompt}\n\n[중요] 결과 보고서는 반드시 '{output_file}' 파일로 저장하십시오."
        response = await agent.chat(full_instruction)
        
        async for token in response:
            sys.stdout.write(token)
            sys.stdout.flush()

    print("\n" + "-" * 60)
    print(f"[+] 리서치 완료! 생성된 파일: {output_file}")

if __name__ == "__main__":
    asyncio.run(main())
