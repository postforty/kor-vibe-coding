# 기존 UI를 shadcn/ui 컴포넌트로 교체하는 구현 계획

현재 프로젝트에 하드코딩되어 있거나 네이티브 HTML 요소를 사용 중인 UI를 shadcn/ui 컴포넌트로 교체하여 디자인 일관성과 UX를 개선합니다.

## User Review Required

> [!IMPORTANT]
> - 기존 네이티브 `<button>` 태그들을 shadcn `<Button>`으로 교체합니다.
> - 파일 목록의 스크롤 영역을 커스텀 CSS 대신 shadcn `<ScrollArea>` 컴포넌트로 교체합니다.
> - 새 문서를 만들 때 사용하던 투박한 브라우저 기본 `prompt()` 창을 세련된 shadcn `<Dialog>`(모달)와 `<Input>` 컴포넌트로 교체합니다.

## Open Questions

> [!WARNING]
> 현재 사이드바 디자인이 Notion과 유사하게 구성되어 있습니다. shadcn `Button`의 `ghost` 변형(variant)을 사용하여 현재의 깔끔한 느낌을 유지할 계획입니다. 혹시 특별히 원하시는 테마나 색상 포인트가 있다면 알려주세요! (기본적으로 기존의 흑백 모노톤 기반 테마를 따릅니다.)

## Proposed Changes

### 1. shadcn 컴포넌트 추가 설치
명령어를 통해 다음 컴포넌트들을 추가합니다.
- `dialog`: 새 문서 생성 모달창용
- `input`: 모달창 내 파일명 입력 필드용
- `scroll-area`: 사이드바 파일 목록 스크롤용

### 2. Sidebar.tsx 컴포넌트 리팩토링
- 상단의 `Plus` 버튼을 shadcn `<Button variant="ghost" size="icon">`으로 변경
- 파일 목록 리스트를 `<ScrollArea>`로 감싸기
- 개별 파일 항목들을 `<Button variant="ghost" className="w-full justify-start">` 형태로 변경하여 활성화 상태(현재 파일)에 따라 스타일 적용

#### [MODIFY] [Sidebar.tsx](file:///c:/Users/dandycode/Documents/GitHub/kor-vibe-coding/ch05/mytion/src/components/Sidebar.tsx)

### 3. page.tsx 내 새 문서 생성 로직(prompt) 교체
- `handleNewFile` 함수 내의 `prompt()` 로직을 제거
- `<Dialog>`를 통해 "새 문서 이름 입력" UI를 구현
- 상태(state) 관리를 통해 다이얼로그 열림/닫힘 및 입력값 제어

#### [MODIFY] [page.tsx](file:///c:/Users/dandycode/Documents/GitHub/kor-vibe-coding/ch05/mytion/src/app/page.tsx)

## Verification Plan

### Automated Tests
```bash
npm run build
npm run lint
```

### Manual Verification
1. 사이드바 항목 호버 및 클릭 시 스타일이 자연스러운지 확인
2. '+' 버튼 클릭 시 브라우저 프롬프트 대신 모달(Dialog) 창이 뜨는지 확인
3. 모달에서 이름을 입력하고 생성했을 때 파일이 정상적으로 만들어지는지 확인
4. 파일 목록이 많아졌을 때 ScrollArea를 통해 예쁘게 스크롤 되는지 확인
