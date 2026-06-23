/**
 * MedBridge Tourism — Google Sheets lead sink.
 *
 * SETUP
 * 1. Create a Google Sheet (this will store the leads).
 * 2. Extensions → Apps Script. Delete the sample code, paste this file.
 * 3. Set SECRET below to a random string and copy the SAME value into the
 *    bot's .env as SHEETS_SECRET.
 * 4. Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy the Web app URL into the bot's .env as SHEETS_WEBAPP_URL.
 * 5. Re-deploy after any edit (Deploy → Manage deployments → Edit → Deploy).
 *
 * Принимает заявки из двух источников:
 *   • Telegram-бот — присылает SECRET (приватный, только на сервере бота).
 *   • Форма на сайте index.html — присылает WEB_SECRET (публичный, лежит
 *     в коде страницы). Отдельный ключ нужен, чтобы публичный сайт НЕ
 *     раскрывал приватный ключ бота. Значение WEB_SECRET ниже должно
 *     совпадать с константой WEB_LEAD_SECRET в index.html.
 */

const SECRET = 'Nq4GdXTpqh9iLTHpL2HMrlKn';      // приватный — Telegram-бот
const WEB_SECRET = 'Gt9Vz5xN_o0TQOA1UxIrCafK';  // публичный — форма на сайте
const SHEET_NAME = 'Leads';
const HEADERS = [
  'Время (МСК)', 'ISO', 'Направление', 'Имя', 'Телефон',
  'Комментарий', 'Источник', 'Язык', 'User ID', 'Username',
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const okSecret = body.secret === SECRET || (WEB_SECRET && body.secret === WEB_SECRET);
    if (!okSecret) {
      return jsonOut({ ok: false, error: 'forbidden' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    sheet.appendRow([
      body.time || '',
      body.iso || '',
      body.procedure || '',
      body.name || '',
      body.phone || '',
      body.comment || '',
      body.source || '',
      body.lang || '',
      body.userId || '',
      body.username || '',
    ]);

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonOut({ ok: true, service: 'MedBridge Tourism leads' });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
