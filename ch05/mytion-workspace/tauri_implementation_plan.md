# Goal Description
현재 Next.js 기반의 웹 애플리케이션(`mytion`)을 Tauri를 사용하여 Windows 설치 프로그램(.msi 또는 .exe) 형태의 데스크톱 앱으로 변환합니다.

## User Review Required

> [!WARNING]
> Tauri 빌드를 위해서는 사용자의 시스템(Windows)에 **Rust**와 **Visual Studio C++ Build Tools**가 설치되어 있어야 합니다. 진행하기 전에 해당 환경이 구축되어 있는지 확인해주세요.

> [!CAUTION]
> **아키텍처 변경점**: Tauri는 Node.js 서버 없이 정적 파일(Static Export)로 동작해야 합니다. 따라서 현재 사용 중인 Next.js API 라우트(`/api/files`, `/api/upload`)는 동작하지 않게 됩니다.
> 파일 읽기/쓰기 및 이미지 업로드 기능은 프론트엔드에서 바로 Tauri의 **네이티브 파일 시스템 API**(`@tauri-apps/plugin-fs`)를 호출하는 방식으로 모두 수정되어야 합니다. 

> [!IMPORTANT]
> **파일 저장 위치**: 기존에는 프로젝트의 `documents`나 `public/uploads` 폴더에 파일을 저장했지만, 데스크톱 앱 환경에서는 앱 업데이트 시 데이터가 보존되도록 OS의 **앱 데이터(AppData)** 폴더를 사용하게 됩니다.

## Proposed Changes

### Tauri 및 Next.js 설정
#### [MODIFY] [next.config.ts](file:///c:/Users/dandycode/Documents/GitHub/kor-vibe-coding/ch05/mytion/next.config.ts)
- `output: 'export'` 설정을 추가하여 Next.js가 정적 빌드(`out` 폴더)를 생성하도록 변경합니다.
#### [MODIFY] [package.json](file:///c:/Users/dandycode/Documents/GitHub/kor-vibe-coding/ch05/mytion/package.json)
- Tauri CLI 관련 의존성을 설치하고, 실행 스크립트(`"tauri": "tauri"`)를 추가합니다.
#### [NEW] [src-tauri/tauri.conf.json](file:///c:/Users/dandycode/Documents/GitHub/kor-vibe-coding/ch05/mytion/src-tauri/tauri.conf.json)
- Tauri 프로젝트를 초기화하고 프론트엔드 빌드 경로(`../out`)를 설정합니다.

### API 코드 마이그레이션 (Next.js -> Tauri IPC)
#### [DELETE] src/app/api 폴더 전체
- 기존 백엔드 라우트는 더 이상 사용할 수 없으므로 삭제합니다.
#### [MODIFY] [src/app/page.tsx](file:///c:/Users/dandycode/Documents/GitHub/kor-vibe-coding/ch05/mytion/src/app/page.tsx)
- 마크다운 파일 목록 조회 및 저장을 `fetch` 대신 Tauri의 `fs` 플러그인(또는 커스텀 Rust 명령)을 이용해 로컬 앱 데이터 폴더에서 관리하도록 수정합니다.
#### [MODIFY] [src/components/Editor.tsx](file:///c:/Users/dandycode/Documents/GitHub/kor-vibe-coding/ch05/mytion/src/components/Editor.tsx)
- 에디터 내 이미지 업로드 로직을 로컬 파일 시스템 저장 및 로컬 경로 반환 형태로 수정합니다. (`@tauri-apps/api` 사용)

## Verification Plan

### Manual Verification
1. `npm run tauri dev`를 실행하여 데스크톱 앱 창이 뜨고 파일 생성/수정/조회가 잘 되는지 수동 검증합니다.
2. `npm run tauri build` 명령으로 번들링을 진행하여 `src-tauri/target/release/bundle` 폴더 내에 Windows 설치 프로그램 파일이 생성되는지 확인합니다.
