# 🎮 게임 세이브포인트로 이해하는 Git & GitHub 실습 튜토리얼

> **한 줄 요약**: 코딩 망했을 때 멘탈 지켜주는 마법의 타임머신 & 클라우드 백업 배우기

---

## 0. 30초 개념 컷 (비유로 끝내기)

- **Git**: 내 컴퓨터 전용 **세이브 머신 (타임머신)**
- **Commit**: 게임 **세이브 슬롯에 저장하기** (세이브포인트 찍기)
- **Git Log**: 지금까지 저장한 **세이브 목록 확인하기**
- **GitHub**: 내 세이브 파일을 인터넷에 올리는 **클라우드 드라이브 & 자랑용 쇼케이스**
- **Push**: 로컬 세이브를 클라우드로 **업로드하기**

---

## 1단계: 로컬 세이브 머신 가동 (Git 기본)

### ① 실습 폴더 만들고 Git 시작하기
터미널 열고 아래 명령어 입력하기.

```bash
# 실습 폴더 생성 및 이동
mkdir my-savepoint-game
cd my-savepoint-game

# Git 타임머신 켜기 (최초 1회만)
git init
```

### ② 첫 번째 세이브포인트 찍기 (캐릭터 생성)
`hero.txt` 파일을 만들고 아래 내용 입력 후 저장.

```text
[용사 상태창]
이름: 바이브 용사
레벨: 1
무기: 나무 몽둥이
상태: 모험을 막 시작함!
```

이제 세이브 슬롯에 저장하기:
```bash
# 1. 세이브할 파일 장바구니에 담기 (Staging)
git add hero.txt

# 2. 세이브 버튼 누르고 메모 남기기 (Commit)
git commit -m "Lv1 용사 생성 및 몽둥이 획득"
```

---

## 2단계: 레벨업 & 타임머신(되돌리기) 마법 체험 🧙‍♂️

### ① 레벨업하고 두 번째 세이브 찍기
`hero.txt` 내용을 수정하기.

```text
[용사 상태창]
이름: 바이브 용사
레벨: 10
무기: 불꽃의 전설검
상태: 던전 보스 앞 도착!
```

수정했으면 다시 세이브포인트 찍기:
```bash
git add hero.txt
git commit -m "Lv2 전직 및 불꽃검 장착"
```

### ② 대형 사고 발생 시뮬레이션 💥
보스와 싸우다가 치명적인 실수를 해서 `hero.txt` 내용이 박살 났다고 가정해봄.  
`hero.txt` 내용을 전부 지우고 아래처럼 적고 저장해버리기.

```text
💀 보스 공격에 전멸... 아이템 전부 증발... 게임 망함...
```

### ③ 세이브포인트로 시간 되돌리기 (마법 발동)
망했다고 울지 말고 타임머신 돌리기.

```bash
# 방금 망친 수정을 직전 세이브(Lv2) 상태로 롤백!
git restore hero.txt
```

> 💡 **확인**: `hero.txt` 열어보면 방금 날아간 줄 알았던 `Lv2 불꽃의 전설검` 상태로 완벽 복구되어 있음.  
> ➡️ *"아, 커밋만 잘 찍어두면 아무리 코드를 망쳐도 무적이다!"*

### ④ 지금까지 찍은 세이브 목록 보기
```bash
git log --oneline
```
화면에 내가 저장한 세이브 목록과 메시지들이 예쁘게 뜸.

---

## 3단계: 클라우드에 백업하기 (GitHub 연동)

내 컴퓨터가 고장 나거나 다른 컴퓨터에서 이어 하고 싶을 때 클라우드에 백업함.

### ① GitHub에서 새 리포지토리 만들기
1. [github.com](https://github.com) 로그인
2. 우측 상단 `+` 버튼 ➡️ **New repository** 클릭
3. 저장소 이름: `my-savepoint-game` 입력
4. **Public** 체크 후 **Create repository** 클릭

### ② 내 컴퓨터와 GitHub 연결하고 업로드(Push)
GitHub 화면에 나오는 명령어를 복사해서 터미널에 입력:

```bash
# 기본 브랜치 이름을 main으로 설정
git branch -M main

# 내 컴퓨터와 깃허브 저장소 주소 연결
git remote add origin https://github.com/<내_아이디>/my-savepoint-game.git

# 세이브포인트 클라우드로 쏘아올리기
git push -u origin main
```

> 💡 GitHub 웹페이지 새로고침하면 내가 올린 `hero.txt`와 커밋 메시지가 인터넷에 올라와 있는 걸 볼 수 있음!

---

## 4단계: 내 프로필 웹페이지 배포하기 (성취감 끝판왕) 🚀

텍스트 파일만 올리면 심심하니까 웹페이지 하나 만들어서 전 세계에 공개해보기.

### ① `index.html` 만들기
폴더에 `index.html` 파일을 만들고 아래 코드 붙여넣기:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>내 첫 깃허브 웹사이트</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      color: #333;
    }
    .card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #4f46e5; margin-bottom: 0.5rem; }
    p { color: #666; line-height: 1.6; }
    .badge {
      display: inline-block;
      background: #e0e7ff;
      color: #4338ca;
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-weight: bold;
      font-size: 0.9rem;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎉 Git & GitHub 마스터!</h1>
    <p>게임 세이브포인트 개념으로 깃을 정복함.<br>내 첫 정적 웹사이트 배포 성공!</p>
    <div class="badge">🚀 Level UP!</div>
  </div>
</body>
</html>
```

### ② 커밋하고 푸시하기
```bash
git add index.html
git commit -m "첫 웹페이지 카드 추가"
git push
```

### ③ GitHub Pages 무료 호스팅 켜기
1. GitHub 저장소 페이지 상단 **Settings** 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Build and deployment** 섹션의 **Branch**를 `None` ➡️ `main` 으로 변경 후 **Save** 클릭
4. 1~2분 뒤 새로고침하면 상단에 나오는 `https://<내_아이디>.github.io/my-savepoint-game/` 링크 접속
5. **내 스마트폰이나 친구한테 링크 보내서 자랑하기!** 📱

---

## 🤖 [보너스] AI 바이브 코딩 필수 생존 팁

> **"AI에게 큰 코딩을 시키기 전에는 무조건 세이브포인트(Commit)를 찍어둘 것!"**

- AI 에이전트가 코드를 화려하게 짜주다가 가끔 엉뚱하게 기존 코드를 다 망가뜨릴 때가 있음.
- 미리 `git commit`을 해두면 아무리 AI가 코드를 꼬아놔도 한 방에 안전하게 직전 상태로 복구할 수 있음.
- **세이브포인트 습관 = AI 개발자의 가장 강력한 방어구**
