/**
 * ==============================================================================
 * [실습용 코드] 의도적인 간헐적 클릭 먹통 버그가 포함된 로그인 스크립트
 * ==============================================================================
 * 
 * 📌 버그 현상:
 * 사용자가 로그인을 시도할 때 가끔(약 40% 확률) 네트워크 에러가 발생하면,
 * 이후부터는 로그인 버튼을 아무리 눌러도 아무런 반응이 없는 먹통 상태가 됩니다.
 * 
 * 📌 교육 목적:
 * AI 에이전트에게 단순 "고쳐줘"가 아니라, 
 * "[원인 분석 ➔ 부작용 검토 ➔ 해결 코드]" 순서로 체계적인 CoT 디버깅을 지시해 봅니다.
 */

// 전역 상태 관리 변수
let isSubmitting = false;
let totalClickCount = 0;

// DOM 요소 참조
const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const statusFlag = document.getElementById("status-flag");
const statusDisabled = document.getElementById("status-disabled");
const clickCountSpan = document.getElementById("click-count");
const logConsole = document.getElementById("log-console");
const btnReset = document.getElementById("btn-reset");

// 디버그 로그 출력 함수
function addLog(message, type = "info") {
  const item = document.createElement("div");
  item.className = `log-item ${type}`;
  const time = new Date().toLocaleTimeString();
  item.textContent = `[${time}] ${message}`;
  logConsole.appendChild(item);
  logConsole.scrollTop = logConsole.scrollHeight;
}

// 상태 UI 갱신 함수
function updateMonitorUI() {
  statusFlag.textContent = String(isSubmitting);
  if (isSubmitting) {
    statusFlag.className = "danger";
    statusDisabled.textContent = "비활성 (잠김)";
    statusDisabled.className = "danger";
  } else {
    statusFlag.className = "";
    statusDisabled.textContent = "활성";
    statusDisabled.className = "";
  }
  clickCountSpan.textContent = totalClickCount;
}

// 가상 백엔드 로그인 API (약 40% 확률로 에러를 일으켜 불안정한 통신 시뮬레이션)
function fakeLoginApi(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 40% 확률로 일시적 서버 오류 발생
      const isRandomFail = Math.random() < 0.4;
      if (isRandomFail) {
        reject(new Error("네트워크 응답 시간 초과 (504 Gateway Timeout)"));
      } else {
        resolve({ success: true, user: email, token: "jwt_token_sample_12345" });
      }
    }, 800);
  });
}

// 로그인 클릭 핸들러
async function handleLogin() {
  totalClickCount++;
  updateMonitorUI();

  // ⚠️ [의도적 버그 지점 1]: 중복 클릭 방지 가드
  // isSubmitting이 true로 굳어버리면 이후 모든 클릭이 이 가드에 걸려 침묵(무반응)합니다.
  if (isSubmitting) {
    addLog(`클릭 무시됨! (사유: isSubmitting이 여전히 true 상태입니다)`, "error");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    addLog("이메일과 비밀번호를 모두 입력해주세요.", "error");
    return;
  }

  // 요청 시작: 플래그 켜기 및 버튼 잠금
  isSubmitting = true;
  loginBtn.disabled = true;
  loginBtn.textContent = "로그인 처리 중...";
  updateMonitorUI();
  addLog(`로그인 요청 시작 (이메일: ${email})...`, "info");

  try {
    const response = await fakeLoginApi(email, password);
    addLog(`✅ 로그인 성공! (환영합니다, ${response.user}님)`, "success");
    
    // 성공 시에는 상태를 정상적으로 해제함
    isSubmitting = false;
    loginBtn.disabled = false;
    loginBtn.textContent = "로그인";
    updateMonitorUI();

  } catch (error) {
    // ⚠️ [의도적 치명적 버그 지점 2]:
    // 실패(에러) 시 에러 로그만 찍고, isSubmitting = false 및 버튼 활성화 처리를 누락함!
    // finally 블록이 없기 때문에 에러가 한 번 발생하면 영구적으로 먹통이 됨.
    addLog(`❌ 로그인 실패: ${error.message}`, "error");
    addLog(`⚠️ 치명적 버그 발생: 플래그가 해제되지 않아 이후 버튼이 잠깁니다!`, "error");

    // ❌ 누락된 코드 (버그 유발 원인):
    // isSubmitting = false;
    // loginBtn.disabled = false;
    // loginBtn.textContent = "로그인";
    // updateMonitorUI();
  }
}

// 이벤트 리스너 등록
loginBtn.addEventListener("click", handleLogin);

// 디버그용 초기화 버튼
btnReset.addEventListener("click", () => {
  isSubmitting = false;
  loginBtn.disabled = false;
  loginBtn.textContent = "로그인";
  totalClickCount = 0;
  updateMonitorUI();
  addLog("상태가 수동으로 초기화되었습니다. 다시 시도해 보세요.", "info");
});

