/**
 * 📱 스마트 영수증 가계부 (Smart Receipt Ledger) - 백엔드
 * Google Apps Script (GAS V8 Runtime)
 */

const SHEET_NAMES = {
  SETTINGS: '설정',
  EXPENSES: '지출내역',
  STATS: '카테고리별통계'
};

const DEFAULT_CONFIG = {
  FOLDER_URL: '', // 또는 'https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE'
  MONTHLY_BUDGET: 1000000 // 100만원
};

/**
 * 1. 웹앱 HTTP GET 진입점: Index.html을 렌더링합니다.
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('📱 스마트 영수증 가계부')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 2. 스프레드시트 초기화: 필요한 시트와 서식을 자동 구성합니다.
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1) '설정' 시트 생성 및 초기화
  let settingSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  if (!settingSheet) {
    settingSheet = ss.insertSheet(SHEET_NAMES.SETTINGS);
  }
  settingSheet.clear();
  
  // 설정 타이틀 및 헤더 스타일
  settingSheet.getRange('A1:C1').merge()
    .setValue('⚙️ 스마트 영수증 가계부 환경 설정')
    .setBackground('#1E293B')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setFontSize(13)
    .setHorizontalAlignment('center');

  settingSheet.getRange('A2:C2').merge()
    .setValue('※ 웹앱 및 드라이브 연동에 필요한 필수 환경 변수입니다.')
    .setFontColor('#64748B')
    .setFontSize(9)
    .setHorizontalAlignment('center');

  const settingRows = [
    ['항목', '설정값', '비고 / 안내'],
    ['영수증 드라이브 폴더 URL', DEFAULT_CONFIG.FOLDER_URL || '(영수증을 저장할 본인의 구글 드라이브 폴더 URL을 붙여넣으세요)', '영수증 이미지가 저장되는 드라이브 폴더 주소'],
    ['웹앱 배포 URL', '(배포 후 발급받은 웹앱 URL을 붙여넣으세요)', '모바일 접속용 Google Apps Script Web App URL'],
    ['이번 달 예산', DEFAULT_CONFIG.MONTHLY_BUDGET, '월간 예산 금액 (원 단위 숫자)']
  ];

  settingSheet.getRange(3, 1, settingRows.length, 3).setValues(settingRows);
  settingSheet.getRange('A3:C3')
    .setBackground('#E2E8F0')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  
  settingSheet.getRange('A4:A6').setFontWeight('bold').setBackground('#F8FAFC');
  settingSheet.getRange('B6').setNumberFormat('₩#,##0');
  settingSheet.setColumnWidth(1, 180);
  settingSheet.setColumnWidth(2, 420);
  settingSheet.setColumnWidth(3, 280);

  // 2) '지출내역' 시트 생성 및 초기화
  let expenseSheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
  if (!expenseSheet) {
    expenseSheet = ss.insertSheet(SHEET_NAMES.EXPENSES);
  }
  expenseSheet.clear();

  const headers = ['등록일시', '지출일자', '분류', '사용처', '금액', '결제수단', '메모', '영수증링크'];
  expenseSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  expenseSheet.getRange(1, 1, 1, headers.length)
    .setBackground('#2563EB')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  
  expenseSheet.setFrozenRows(1);
  expenseSheet.setColumnWidth(1, 150); // 등록일시
  expenseSheet.setColumnWidth(2, 100); // 지출일자
  expenseSheet.setColumnWidth(3, 100); // 분류
  expenseSheet.setColumnWidth(4, 150); // 사용처
  expenseSheet.setColumnWidth(5, 120); // 금액
  expenseSheet.setColumnWidth(6, 100); // 결제수단
  expenseSheet.setColumnWidth(7, 200); // 메모
  expenseSheet.setColumnWidth(8, 140); // 영수증링크

  // 금액 열 통화 서식 적용
  expenseSheet.getRange('E2:E').setNumberFormat('₩#,##0');
  expenseSheet.getRange('A2:B').setHorizontalAlignment('center');
  expenseSheet.getRange('C2:D').setHorizontalAlignment('center');
  expenseSheet.getRange('F2:F').setHorizontalAlignment('center');
  expenseSheet.getRange('H2:H').setHorizontalAlignment('center');

  // 3) '카테고리별통계' 시트 생성 및 초기화
  let statSheet = ss.getSheetByName(SHEET_NAMES.STATS);
  if (!statSheet) {
    statSheet = ss.insertSheet(SHEET_NAMES.STATS);
  }
  statSheet.clear();

  statSheet.getRange('A1:C1').merge()
    .setValue('📊 카테고리별 지출 통계')
    .setBackground('#1E293B')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  const statHeaders = ['카테고리', '지출 합계', '비율'];
  statSheet.getRange(2, 1, 1, 3).setValues([statHeaders])
    .setBackground('#E2E8F0')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  const categories = ['🍽️ 식비', '🚗 교통', '🛍️ 쇼핑', '☕ 카페/간식', '🎬 문화', '💡 기타'];
  const statData = categories.map((cat, idx) => {
    const row = idx + 3;
    return [
      cat,
      `=SUMIF(지출내역!C:C, "${cat}", 지출내역!E:E)`,
      `=IF(B9>0, B${row}/B9, 0)`
    ];
  });

  statSheet.getRange(3, 1, statData.length, 3).setValues(statData);
  
  // 합계 행
  statSheet.getRange(9, 1, 1, 3).setValues([['총합계', '=SUM(B3:B8)', '=SUM(C3:C8)']]);
  statSheet.getRange(9, 1, 1, 3).setFontWeight('bold').setBackground('#F1F5F9');
  statSheet.getRange('B3:B9').setNumberFormat('₩#,##0');
  statSheet.getRange('C3:C9').setNumberFormat('0.0%');
  statSheet.setColumnWidth(1, 140);
  statSheet.setColumnWidth(2, 140);
  statSheet.setColumnWidth(3, 100);

  SpreadsheetApp.flush();
  return { success: true, message: "시트 초기화가 완료되었습니다!" };
}

/**
 * 3. '설정' 시트에서 영수증 저장용 구글 드라이브 폴더 객체를 획득합니다.
 */
function getTargetDriveFolder() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
    let folderUrlOrId = DEFAULT_CONFIG.FOLDER_URL;
    
    if (sheet) {
      const val = sheet.getRange('B4').getValue();
      if (val && typeof val === 'string' && val.trim().length > 0) {
        folderUrlOrId = val.trim();
      }
    }

    if (!folderUrlOrId || folderUrlOrId.includes('YOUR_FOLDER_ID_HERE') || folderUrlOrId.includes('붙여넣으세요')) {
      console.warn('영수증 드라이브 폴더 URL이 설정되지 않았습니다. [설정] 시트의 B4 셀에 드라이브 폴더 URL을 입력해주세요.');
      return null;
    }

    // URL에서 폴더 ID 추출 (다양한 드라이브 URL 패턴 대응)
    let folderId = folderUrlOrId;
    const match = folderUrlOrId.match(/folders\/([a-zA-Z0-9_-]+)/) || folderUrlOrId.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      folderId = match[1];
    }

    return DriveApp.getFolderById(folderId);
  } catch (error) {
    console.error('드라이브 폴더 획득 실패:', error);
    return null;
  }
}

/**
 * 4. 지출 등록 처리 (영수증 이미지 Base64 업로드 + 시트 행 추가)
 */
function submitExpense(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
    if (!sheet) {
      throw new Error("지출내역 시트를 찾을 수 없습니다. setupSheets를 먼저 실행해주세요.");
    }

    const {
      date,
      category,
      title,
      amount,
      payMethod,
      memo,
      receiptData,
      receiptName
    } = payload;

    const numAmount = parseInt(String(amount).replace(/[^0-9]/g, ''), 10) || 0;
    const now = new Date();
    const timestamp = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    const dateFormatted = date || Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd');

    let receiptUrl = '';
    let receiptFormula = '-';

    // 영수증 이미지가 첨부된 경우 구글 드라이브에 저장
    if (receiptData && receiptData.indexOf('base64,') > -1) {
      const folder = getTargetDriveFolder();
      if (folder) {
        const base64Data = receiptData.split('base64,')[1];
        const decodedBytes = Utilities.base64Decode(base64Data);
        
        // 파일명 생성: YYYYMMDD_사용처_금액원.jpg (특수문자 정제)
        const cleanDate = dateFormatted.replace(/-/g, '');
        const cleanTitle = (title || '영수증').replace(/[\/\\:*?"<>|]/g, '_');
        const fileName = `${cleanDate}_${cleanTitle}_${numAmount}원.jpg`;
        
        const blob = Utilities.newBlob(decodedBytes, 'image/jpeg', fileName);
        const file = folder.createFile(blob);
        file.setDescription(`가계부 영수증 - 등록일: ${timestamp}, 금액: ${numAmount}원`);
        receiptUrl = file.getUrl();
        receiptFormula = `=HYPERLINK("${receiptUrl}", "📸 영수증 보기")`;
      }
    }

    // 지출내역 행 추가
    const newRow = [
      timestamp,
      dateFormatted,
      category || '🍽️ 식비',
      title || '미지정',
      numAmount,
      payMethod || '신용카드',
      memo || '',
      receiptFormula
    ];

    sheet.appendRow(newRow);

    // 추가된 행 서식 보정
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 5).setNumberFormat('₩#,##0');
    sheet.getRange(lastRow, 1, 1, 8).setVerticalAlignment('middle');
    sheet.getRange(lastRow, 1, 1, 4).setHorizontalAlignment('center');
    sheet.getRange(lastRow, 6, 1, 1).setHorizontalAlignment('center');
    sheet.getRange(lastRow, 8, 1, 1).setHorizontalAlignment('center');

    // 최신 월간 통계 갱신 데이터 조회
    const summary = getMonthlySummary();

    return {
      success: true,
      message: '지출 내역이 성공적으로 저장되었습니다.',
      receiptUrl: receiptUrl,
      summary: summary
    };
  } catch (error) {
    console.error('submitExpense 에러:', error);
    return {
      success: false,
      message: '저장 중 오류가 발생했습니다: ' + error.message
    };
  }
}

/**
 * 5. 이번 달 지출 총액, 건수, 예산 대비 잔여액 및 카테고리별 통계 반환
 */
function getMonthlySummary() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const expenseSheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
    const settingSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);

    // 예산 가져오기
    let budget = DEFAULT_CONFIG.MONTHLY_BUDGET;
    if (settingSheet) {
      const budgetVal = settingSheet.getRange('B6').getValue();
      if (budgetVal && !isNaN(budgetVal)) {
        budget = Number(budgetVal);
      }
    }

    if (!expenseSheet || expenseSheet.getLastRow() < 2) {
      return {
        totalAmount: 0,
        count: 0,
        budget: budget,
        remaining: budget,
        usageRate: 0,
        isOverBudget: false,
        categoryStats: {}
      };
    }

    const currentMonth = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM');
    const data = expenseSheet.getRange(2, 1, expenseSheet.getLastRow() - 1, 8).getValues();

    let totalAmount = 0;
    let count = 0;
    const categoryStats = {};

    data.forEach(row => {
      const dateVal = row[1];
      let rowMonth = '';
      if (dateVal instanceof Date) {
        rowMonth = Utilities.formatDate(dateVal, 'Asia/Seoul', 'yyyy-MM');
      } else if (typeof dateVal === 'string') {
        rowMonth = dateVal.substring(0, 7);
      }

      if (rowMonth === currentMonth) {
        const amount = Number(row[4]) || 0;
        const category = String(row[2]) || '기타';
        
        totalAmount += amount;
        count += 1;
        categoryStats[category] = (categoryStats[category] || 0) + amount;
      }
    });

    const usageRate = budget > 0 ? Math.round((totalAmount / budget) * 100) : 0;
    const remaining = budget - totalAmount;

    return {
      totalAmount,
      count,
      budget,
      remaining,
      usageRate,
      isOverBudget: totalAmount > budget,
      categoryStats
    };
  } catch (error) {
    console.error('getMonthlySummary 에러:', error);
    return {
      totalAmount: 0,
      count: 0,
      budget: DEFAULT_CONFIG.MONTHLY_BUDGET,
      remaining: DEFAULT_CONFIG.MONTHLY_BUDGET,
      usageRate: 0,
      isOverBudget: false,
      categoryStats: {}
    };
  }
}

/**
 * 6. 최근 지출 내역 N건을 최신순으로 조회합니다.
 */
function getRecentExpenses(limit = 5) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
    if (!sheet || sheet.getLastRow() < 2) {
      return [];
    }

    const lastRow = sheet.getLastRow();
    const startRow = Math.max(2, lastRow - limit + 1);
    const numRows = lastRow - startRow + 1;
    
    const range = sheet.getRange(startRow, 1, numRows, 8);
    const values = range.getValues();
    const formulas = range.getFormulas();

    const results = [];

    for (let i = values.length - 1; i >= 0; i--) {
      const row = values[i];
      const formulaRow = formulas[i];
      
      let dateStr = row[1];
      if (dateStr instanceof Date) {
        dateStr = Utilities.formatDate(dateStr, 'Asia/Seoul', 'yyyy-MM-dd');
      }

      // 영수증 URL 추출 (수식 또는 텍스트)
      let receiptLink = '';
      const receiptCellFormula = formulaRow[7] || '';
      const formulaMatch = receiptCellFormula.match(/HYPERLINK\("([^"]+)"/i);
      if (formulaMatch && formulaMatch[1]) {
        receiptLink = formulaMatch[1];
      } else if (typeof row[7] === 'string' && row[7].startsWith('http')) {
        receiptLink = row[7];
      }

      results.push({
        id: startRow + i,
        createdAt: row[0],
        date: String(dateStr),
        category: row[2],
        title: row[3],
        amount: Number(row[4]) || 0,
        payMethod: row[5],
        memo: row[6],
        receiptUrl: receiptLink
      });
    }

    return results;
  } catch (error) {
    console.error('getRecentExpenses 에러:', error);
    return [];
  }
}

/**
 * 7. 초기 앱 데이터 일괄 로드 (월간 요약 + 최근 내역)
 */
function getInitialData() {
  return {
    summary: getMonthlySummary(),
    recentExpenses: getRecentExpenses(5)
  };
}

/**
 * 8. [확장 퀘스트 2] 주간 지출 리포트 자동 이메일 발송 함수
 * (주간 트리거: 매주 일요일 저녁 실행 권장)
 */
function sendWeeklyReport() {
  try {
    const userEmail = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
    if (!userEmail) {
      throw new Error("발송할 사용자 이메일을 가져올 수 없습니다.");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
    if (!sheet || sheet.getLastRow() < 2) {
      console.log("기록된 지출 내역이 없어 리포트를 발송하지 않습니다.");
      return { success: false, message: "지출 내역 없음" };
    }

    // 지난 7일간의 지출 데이터 필터링
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues();
    let weeklyTotal = 0;
    let weeklyCount = 0;
    const catMap = {};
    const recentItems = [];

    values.forEach(row => {
      const d = row[1] instanceof Date ? row[1] : new Date(row[1]);
      if (d >= sevenDaysAgo && d <= now) {
        const amt = Number(row[4]) || 0;
        const cat = String(row[2]) || '기타';
        weeklyTotal += amt;
        weeklyCount++;
        catMap[cat] = (catMap[cat] || 0) + amt;
        recentItems.push({
          date: Utilities.formatDate(d, 'Asia/Seoul', 'MM/dd'),
          title: row[3],
          category: cat,
          amount: amt
        });
      }
    });

    const formattedTotal = Number(weeklyTotal).toLocaleString('ko-KR');

    // 이메일 HTML 본문 생성
    let catRowsHtml = '';
    for (const [cat, sum] of Object.entries(catMap)) {
      const pct = weeklyTotal > 0 ? Math.round((sum / weeklyTotal) * 100) : 0;
      catRowsHtml += `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0;">${cat}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: bold;">₩${sum.toLocaleString('ko-KR')}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #64748B;">${pct}%</td>
        </tr>`;
    }

    const htmlBody = `
      <div style="max-width: 520px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1E293B; background: #F8FAFC; padding: 24px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #2563EB, #1D4ED8); padding: 24px; border-radius: 12px; color: #FFFFFF; text-align: center;">
          <h2 style="margin: 0 0 8px 0; font-size: 20px;">📊 이번 주 스마트 가계부 브리핑</h2>
          <p style="margin: 0; opacity: 0.9; font-size: 14px;">최근 7일간 지출 총합</p>
          <div style="font-size: 32px; font-weight: bold; margin-top: 12px;">₩${formattedTotal}</div>
          <div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">총 ${weeklyCount}건의 지출이 기록되었습니다.</div>
        </div>

        <div style="margin-top: 20px; background: #FFFFFF; padding: 18px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #334155;">🏷️ 카테고리별 지출</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tbody>
              ${catRowsHtml || '<tr><td colspan="3" style="text-align: center; color: #94A3B8; padding: 12px;">지출 내역이 없습니다.</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #94A3B8;">
          본 메일은 Google Apps Script '스마트 영수증 가계부' 시스템에서 자동 발송되었습니다.
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: userEmail,
      subject: `[스마트 가계부] 이번 주 지출 브리핑 (총 ₩${formattedTotal})`,
      htmlBody: htmlBody
    });

    return { success: true, message: `주간 리포트가 ${userEmail}로 전송되었습니다.` };
  } catch (error) {
    console.error('sendWeeklyReport 에러:', error);
    return { success: false, message: '이메일 발송 실패: ' + error.message };
  }
}
