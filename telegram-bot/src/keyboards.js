import { Markup } from 'telegraf';
import { t, LANGS } from './i18n.js';
import { DIRECTIONS, DATA, L } from './catalog.js';

// --- Language ---------------------------------------------------------------
export function languageKeyboard() {
  return Markup.inlineKeyboard(LANGS.map((l) => [Markup.button.callback(l.label, `lang:${l.code}`)]));
}

// --- Main menu --------------------------------------------------------------
export function mainMenu(lang) {
  // One button per row: long labels (e.g. "Связаться с координатором") get the
  // full message width and never truncate with "…" on narrow phones.
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_lead'), 'm:lead')],
    [Markup.button.callback(t(lang, 'btn_calc'), 'm:calc')],
    [Markup.button.callback(t(lang, 'btn_savings'), 'm:save')],
    [Markup.button.callback(t(lang, 'btn_directions'), 'm:dir')],
    [Markup.button.callback(t(lang, 'btn_faq'), 'm:faq')],
    [Markup.button.callback(t(lang, 'btn_guide'), 'm:guide')],
    [Markup.button.callback(t(lang, 'btn_contact'), 'm:contact')],
    [Markup.button.callback(t(lang, 'btn_lang'), 'm:lang')],
  ]);
}

export function backToMenu(lang) {
  return Markup.inlineKeyboard([[Markup.button.callback(t(lang, 'btn_menu'), 'm:home')]]);
}

// --- FAQ --------------------------------------------------------------------
export function faqKeyboard(lang) {
  const rows = [1, 2, 3, 4, 5, 6].map((n) => [Markup.button.callback(t(lang, `faq_q${n}`), `faq:${n}`)]);
  rows.push([Markup.button.callback(t(lang, 'btn_menu'), 'm:home')]);
  return Markup.inlineKeyboard(rows);
}

export function faqAnswerKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_lead'), 'm:lead')],
    [Markup.button.callback(t(lang, 'btn_back'), 'm:faq'), Markup.button.callback(t(lang, 'btn_menu'), 'm:home')],
  ]);
}

// --- Calculator -------------------------------------------------------------
export function calcDirKeyboard(lang) {
  const rows = DIRECTIONS.map((d) => [Markup.button.callback(L(d.label, lang), `c:dir:${d.key}`)]);
  rows.push([Markup.button.callback(t(lang, 'btn_menu'), 'm:home')]);
  return Markup.inlineKeyboard(rows);
}

export function calcProcKeyboard(lang, dirKey) {
  const dir = DATA[dirKey];
  const rows = dir.procs.map((p) => [Markup.button.callback(L(p.label, lang), `c:proc:${dirKey}:${p.id}`)]);
  rows.push([Markup.button.callback(t(lang, 'btn_back'), 'm:calc'), Markup.button.callback(t(lang, 'btn_menu'), 'm:home')]);
  return Markup.inlineKeyboard(rows);
}

export function calcQtyKeyboard(lang, dirKey, procId, qty) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('➖', `c:qty:${dirKey}:${procId}:dec`),
      Markup.button.callback(String(qty), 'c:noop'),
      Markup.button.callback('➕', `c:qty:${dirKey}:${procId}:inc`),
    ],
    [Markup.button.callback(t(lang, 'calc_show'), `c:show:${dirKey}:${procId}`)],
    [Markup.button.callback(t(lang, 'btn_back'), `c:dir:${dirKey}`), Markup.button.callback(t(lang, 'btn_menu'), 'm:home')],
  ]);
}

export function calcResultKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'calc_cta'), 'm:lead')],
    [Markup.button.callback(t(lang, 'calc_again'), 'm:calc'), Markup.button.callback(t(lang, 'btn_menu'), 'm:home')],
  ]);
}

// --- Lead capture -----------------------------------------------------------
export function leadProcKeyboard(lang) {
  const rows = DIRECTIONS.map((d) => [Markup.button.callback(L(d.label, lang), `l:proc:${d.key}`)]);
  rows.push([Markup.button.callback(t(lang, 'lead_other'), 'l:proc:other')]);
  rows.push([Markup.button.callback(t(lang, 'lead_cancel'), 'l:cancel')]);
  return Markup.inlineKeyboard(rows);
}

// Reply keyboard with a one-tap "share my phone" button.
export function phoneKeyboard(lang) {
  return Markup.keyboard([
    [Markup.button.contactRequest(t(lang, 'lead_share_phone'))],
    [t(lang, 'lead_cancel')],
  ])
    .resize()
    .oneTime();
}

export function commentKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'lead_skip'), 'l:skip')],
    [Markup.button.callback(t(lang, 'lead_cancel'), 'l:cancel')],
  ]);
}

export function confirmKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'lead_submit'), 'l:submit')],
    [Markup.button.callback(t(lang, 'lead_edit'), 'l:edit'), Markup.button.callback(t(lang, 'lead_cancel'), 'l:cancel')],
  ]);
}

export function removeKeyboard() {
  return Markup.removeKeyboard();
}
