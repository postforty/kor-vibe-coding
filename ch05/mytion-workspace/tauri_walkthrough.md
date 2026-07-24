# Tauri 윈도우 앱 변환 완료

웹 기반 마크다운 에디터(`mytion`)를 **Tauri 기반의 윈도우 데스크톱 애플리케이션**으로 성공적으로 변환했습니다.

## 주요 변경 사항

### 1. 정적 빌드 전환 (Next.js)
Tauri 환경에 맞게 `next.config.ts` 파일에서 `output: 'export'`를 설정하여 Node.js 서버 없이 동작하는 정적(Static) 파일 기반 애플리케이션으로 변경했습니다.

### 2. Node.js API 라우트 삭제
파일 읽기 및 저장을 담당하던 기존 백엔드 라우트(`src/app/api/...`) 폴더를 삭제했습니다. 이제 앱은 외부 서버 없이 데스크톱 로컬 파일 시스템에 직접 접근합니다.

### 3. Tauri 파일 시스템 API 도입
프론트엔드 코드(`src/app/page.tsx`, `src/components/Editor.tsx`)가 `fetch` 대신 Tauri의 플러그인(`@tauri-apps/plugin-fs`, `@tauri-apps/api/path`)을 사용하여 데스크톱 파일 시스템에 직접 접근하도록 수정되었습니다.
- **문서 저장 위치**: 이제 마크다운 파일과 업로드된 이미지 파일은 OS의 안전한 앱 데이터 디렉토리(AppData) 하위의 `documents` 및 `uploads` 폴더에 저장됩니다. 앱 업데이트 시에도 데이터가 유실되지 않습니다.
- **이미지 업로드 경로**: 로컬 파일 시스템에 업로드한 이미지 경로를 브라우저에서 안전하게 로드할 수 있도록 `asset://` 프로토콜을 활성화했습니다.

## 실행 및 빌드 방법

터미널에서 아래 명령어들을 사용하여 Tauri 앱을 테스트하고 배포용 설치 프로그램을 만들 수 있습니다:

### 데스크톱 앱 테스트 (개발 모드)
```bash
npm run tauri dev
```
*(명령어 실행 시 자체 창으로 데스크톱 앱이 실행됩니다.)*

### 윈도우 설치 프로그램 빌드 (릴리스 모드)
```bash
npm run tauri build
```
빌드가 완료되면 `src-tauri/target/release/bundle/` 폴더 내에 윈도우 설치용 `.msi` 및 `.exe` 인스톨러가 생성됩니다.
> 주의: 빌드 과정에서 Rust 컴파일러와 C++ Build Tools가 구동되므로 다소 시간이 소요될 수 있습니다.
