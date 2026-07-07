/**
 * Google Apps Script – Backend dla formularza kawalerskiego
 * ──────────────────────────────────────────────────────────
 *
 * JAK WDROŻYĆ:
 * 1. Otwórz Google Sheets (utwórz nowy arkusz).
 * 2. Kliknij Rozszerzenia → Apps Script.
 * 3. Wklej całą zawartość tego pliku do edytora.
 * 4. Zmień SPREADSHEET_ID na ID swojego arkusza
 *    (część URL pomiędzy /d/ a /edit).
 * 5. Zmień SHEET_NAME na nazwę zakładki (domyślnie "Arkusz1").
 * 6. Kliknij Wdróż → Nowe wdrożenie:
 *      - Typ: Aplikacja internetowa
 *      - Wykonaj jako: Ja (your account)
 *      - Kto ma dostęp: Wszyscy
 * 7. Skopiuj URL wdrożenia i wklej do js/form.js:
 *      CONFIG.APPS_SCRIPT_URL = 'https://script.google.com/...'
 *      CONFIG.SUBMIT_METHOD   = 'apps_script'
 * ──────────────────────────────────────────────────────────
 */

const SPREADSHEET_ID = 'TWOJ_SPREADSHEET_ID'; // ← zmień
const SHEET_NAME     = 'Odpowiedzi';           // ← zmień jeśli potrzeba

// Nagłówki kolumn – muszą być zgodne z kluczami w formData (js/form.js)
const COLUMNS = ['timestamp', 'imie', 'email', 'obecnosc', 'nocleg', 'transport', 'koszulka', 'uwagi'];

/**
 * Obsługuje żądania POST z formularza.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendRow(data);
    return buildResponse({ status: 'ok', message: 'Zgłoszenie zapisane.' });
  } catch (err) {
    return buildResponse({ status: 'error', message: err.toString() }, 500);
  }
}

/**
 * Odpowiada na żądania GET (test połączenia).
 */
function doGet() {
  return buildResponse({ status: 'ok', message: 'Kawalerski API działa poprawnie.' });
}

/**
 * Dopisuje wiersz do arkusza.
 */
function appendRow(data) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Utwórz nagłówki jeśli arkusz jest pusty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }

  const row = COLUMNS.map(col => (data[col] !== undefined ? String(data[col]) : ''));
  sheet.appendRow(row);
}

/**
 * Buduje odpowiedź JSON z nagłówkami CORS.
 */
function buildResponse(payload) {
  const output = ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
