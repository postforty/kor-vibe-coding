# NVIDIA AI Endpoints (NIM) 모델 연동 실습

이 프로젝트는 **NVIDIA NIM (NVIDIA AI Endpoints)** 과 `langchain-nvidia-ai-endpoints`를 활용하여 다양한 파운데이션 모델(DeepSeek, Nemotron, Gemma 등)을 호출하고, 추론(Thinking/Reasoning) 과정 및 답변을 실시간 스트리밍으로 출력하는 예제입니다.

---

## 📌 주요 특징

- **다양한 오픈소스 LLM 지원**: Nemotron, DeepSeek, Gemma, Llama 등 NVIDIA NIM에서 호스팅하는 최신 모델 손쉬운 연동
- **추론 과정(Thinking / Reasoning) 스트리밍**: `enable_thinking` 옵션을 통해 모델의 사고 과정(`reasoning_content`)과 최종 답변을 실시간으로 분리하여 출력
- **안정적인 타임아웃 처리**: 대규모 모델 및 복잡한 추론 시 발생할 수 있는 네트워크 타임아웃을 방지하기 위한 타임아웃(`timeout=120`) 설정
- **Windows 환경 최적화**: Windows 터미널의 cp949 인코딩 문제(이모지 출력 에러 등)를 방지하기 위해 UTF-8 스트림 재구성
- **환경 변수 분리**: `python-dotenv`를 이용해 API Key 등 민감 정보를 `.env` 파일로 안전하게 관리

---

## 🛠️ 요구 사항 및 설치

### 1. 요구 사항
- **Python**: `>= 3.12`
- **패키지 매니저**: [uv](https://github.com/astral-sh/uv) (권장) 또는 `pip`

### 2. 패키지 설치

`uv`를 사용하는 경우 프로젝트 디렉토리에서 다음 명령어로 의존성을 설치합니다:

```bash
uv sync
```

---

## 🔑 환경 변수 설정 (`.env`)

1. [NVIDIA NIM (build.nvidia.com)](https://build.nvidia.com/)에 접속하여 API Key를 발급받습니다.
2. `ch16/nvidia-model/` 디렉토리에 `.env` 파일을 생성하고 발급받은 API 키를 입력합니다:

```env
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **주의**: `.env` 파일은 민감한 키가 포함되므로 `.gitignore`에 등록되어 Git에 커밋되지 않도록 관리합니다.

---

## 🚀 실행 방법

```bash
uv run main.py
```

> 💡 **코드 설명**: 상세한 구현 및 파라미터 설명은 [main.py](./main.py) 파일 내의 주석을 참고해주세요.

---

## 💡 지원 모델 및 팁

### 지원 모델 예시
- `deepseek-ai/deepseek-v4-flash-0731`
- `nvidia/nemotron-3.5-lightning-30b-a3b`
- `google/gemma-4-31b-it` / `google/gemma-2-27b-it`
- `meta/llama-3.3-70b-instruct`

### 사용 가능한 모델 목록 확인
현재 NVIDIA NIM 계정에서 사용 가능한 전체 모델 목록을 확인하려면 다음 명령어를 실행할 수 있습니다:

```bash
uv run python -c "from langchain_nvidia_ai_endpoints import ChatNVIDIA; print([m.id for m in ChatNVIDIA.get_available_models()])"
```
