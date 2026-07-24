# Mytion (마이션)

**Notion 스타일의 빠르고 가벼운 마크다운 데스크톱 에디터**

Mytion은 Next.js 기반의 프론트엔드와 Tauri를 결합하여 만든 독립 실행형 윈도우 데스크톱 애플리케이션입니다. 외부 서버 의존 없이 모든 문서와 이미지를 사용자의 로컬 환경(AppData)에 안전하게 저장하며, 오프라인 환경에서도 쾌적하게 동작합니다.

## 🚀 주요 기능

- **Notion 스타일 에디터**: 직관적인 블록 기반 마크다운 에디터 (`@blocknote/core` 사용)
- **로컬 자동 저장**: 글을 작성하는 동안 1초 주기로 자동 저장되어 데이터 유실을 방지합니다.
- **사이드바 문서 관리**: 작성된 문서 목록을 최신순으로 쉽게 탐색하고 새 문서를 생성할 수 있습니다.
- **이미지 첨부 지원**: 에디터 내 이미지 첨부 시 Tauri 로컬 파일 시스템을 통해 안전하게 앱 데이터 폴더에 저장됩니다.

## 🛠️ 기술 스택

- **Frontend**: Next.js 16 (App Router / Static Export), React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI (Radix UI)
- **Editor Engine**: BlockNote, marked
- **Desktop Runtime**: Tauri v2 (Rust 기반)

## 💻 개발 환경 설정 및 빌드 가이드

### 필수 요구 사항 (Prerequisites)
이 프로젝트를 로컬에서 실행하고 데스크톱 앱으로 빌드하려면 아래 도구들이 설치되어 있어야 합니다.
- **Node.js** (v18 이상 권장)
- **Rust** 및 **Visual Studio C++ Build Tools** (Tauri 윈도우 환경 빌드를 위해 필수)

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 모드 실행
Next.js 로컬 서버와 Tauri 윈도우 창이 동시에 실행되어 변경 사항을 실시간으로 확인하며 개발할 수 있습니다.
```bash
npm run tauri dev
```

### 3. 설치 프로그램 빌드 (Release)
실제 윈도우 설치 파일(`.msi`, `.exe`)을 생성하려면 아래 명령어를 사용합니다.
```bash
npm run tauri build
```
> 빌드가 성공적으로 완료되면, `src-tauri/target/release/bundle/` 폴더 내에서 인스톨러 파일을 찾을 수 있습니다.

## 📁 파일 저장 위치
- **문서(마크다운)**: OS의 AppData 폴더 하위 `documents` 폴더 내에 `.md` 파일로 저장됩니다.
- **이미지**: OS의 AppData 폴더 하위 `uploads` 폴더 내에 저장되며, 앱 내에서는 `asset://` 프로토콜을 통해 안전하게 불러옵니다.
