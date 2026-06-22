import { config } from './config.js';
import { t } from './i18n.js';
import { mainMenu } from './keyboards.js';

const HTML = { parse_mode: 'HTML', link_preview_options: { is_disabled: true } };

export function getLang(ctx) {
  return (ctx.session && ctx.session.lang) || config.defaultLang;
}

/** Answer a callback query, swallowing the "query is too old" error. */
export async function ack(ctx, text) {
  try {
    await ctx.answerCbQuery(text);
  } catch {
    /* stale callback query — safe to ignore */
  }
}

export async function sendHtml(ctx, text, extra = {}) {
  return ctx.reply(text, { ...HTML, ...extra });
}

/** Edit the message behind a callback; fall back to a fresh reply if uneditable. */
export async function editHtml(ctx, text, extra = {}) {
  try {
    return await ctx.editMessageText(text, { ...HTML, ...extra });
  } catch {
    return ctx.reply(text, { ...HTML, ...extra });
  }
}

export async function showMenu(ctx, { edit = false } = {}) {
  const lang = getLang(ctx);
  const text = t(lang, 'menu_prompt');
  const kb = mainMenu(lang);
  return edit ? editHtml(ctx, text, kb) : sendHtml(ctx, text, kb);
}

export function resetFlows(ctx) {
  if (ctx.session) {
    ctx.session.lead = undefined;
    ctx.session.calc = undefined;
  }
}
