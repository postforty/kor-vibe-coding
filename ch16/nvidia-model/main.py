import os
import sys
from dotenv import load_dotenv
from langchain_nvidia_ai_endpoints import ChatNVIDIA

# Windows 콘솔 환경에서 유니코드(이모지, 한글 등) 출력 시 발생하는 cp949 인코딩 에러 방지
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

# 1. .env 파일에서 환경변수 로드
load_dotenv()

# 2. NVIDIA API Key 로드 (.env의 NVIDIA_API_KEY 또는 api_key 키값 지원)
api_key = os.getenv("NVIDIA_API_KEY") or os.getenv("api_key")


def main():
    # 3. ChatNVIDIA 클라이언트 설정
    # - model: 사용할 NVIDIA NIM 호스팅 모델 ID (예: DeepSeek, Nemotron, Gemma 등)
    # - temperature / top_p: 답변의 다양성 및 샘플링 조절
    # - max_completion_tokens: 모델이 생성할 수 있는 최대 토큰 수
    # - timeout: 대규모 모델의 추론(Reasoning) 및 첫 청크 대기 시간을 고려한 타임아웃(초)
    # - model_kwargs: 모델의 Thinking(사고 과정) 활성화 옵션 설정
    client = ChatNVIDIA(
        # model="nvidia/nemotron-3.5-lightning-30b-a3b",
        # model="google/gemma-4-31b-it",
        # model="openai/gpt-oss-120b",
        model="deepseek-ai/deepseek-v4-flash-0731",
        api_key=api_key,
        temperature=1,
        top_p=0.95,
        max_completion_tokens=16384,
        timeout=120,
        model_kwargs={"chat_template_kwargs": {"enable_thinking": True}},
    )

    # 4. 질의할 프롬프트 정의
    prompt = "바이브코딩에 관해서 설명해줘."

    # 5. 스트리밍 방식으로 응답 수신 및 실시간 출력
    # - reasoning_content: 모델의 중간 추론 및 사고 과정 (Thinking)
    # - content: 최종 생성된 답변 내용
    for chunk in client.stream([{"role": "user", "content": prompt}]):
        if chunk.additional_kwargs and "reasoning_content" in chunk.additional_kwargs:
            print(chunk.additional_kwargs["reasoning_content"], end="", flush=True)
        print(chunk.content, end="", flush=True)


if __name__ == "__main__":
    main()
