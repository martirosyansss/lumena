import { t } from '../i18n.js';
import { DATA, L, findProc, priceRange } from '../catalog.js';
import {
  calcDirKeyboard,
  calcProcKeyboard,
  calcQtyKeyboard,
  calcResultKeyboard,
} from '../keyboards.js';
import { getLang, ack, editHtml } from '../ui.js';
import { track } from '../analytics.js';

const MAX_QTY = 20;

function renderResult(lang, dirKey, procId, qty) {
  const { proc } = findProc(dirKey, procId);
  if (!proc) return null;

  if (proc.custom) {
    const text = `${t(lang, 'calc_custom', { label: L(proc.label, lang) })}\n\n${t(lang, 'calc_disclaimer')}`;
    return text;
  }

  const q = proc.qty ? qty : 1;
  const yer = priceRange(proc.yer[0] * q, proc.yer[1] * q, proc.from);
  const mos = priceRange(proc.mos[0] * q, proc.mos[1] * q, proc.from);
  const fromWord = t(lang, 'from');
  const yerText = (yer.isFrom ? `${fromWord} ` : '') + yer.text;
  const mosText = (mos.isFrom ? `${fromWord} ` : '') + mos.text;

  let label = L(proc.label, lang);
  if (proc.qty) label += ` · ${q} ${L(proc.unit, lang)}`;

  return (
    `${t(lang, 'calc_result', { label, mos: mosText, yer: yerText, save: L(proc.save, lang) })}\n\n` +
    `${t(lang, 'calc_disclaimer')}`
  );
}

export function register(bot) {
  // Open calculator / "calculate again".
  bot.action('m:calc', async (ctx) => {
    const lang = getLang(ctx);
    ctx.session.calc = undefined;
    track('calc_used');
    await ack(ctx);
    await editHtml(ctx, t(lang, 'calc_choose_dir'), calcDirKeyboard(lang));
  });

  // Direction chosen (also the "back" target from the quantity step).
  bot.action(/^c:dir:(\w+)$/, async (ctx) => {
    const lang = getLang(ctx);
    const dirKey = ctx.match[1];
    if (!DATA[dirKey]) return ack(ctx);
    await ack(ctx);
    await editHtml(ctx, t(lang, 'calc_choose_proc', { dir: L(DATA[dirKey].label, lang) }), calcProcKeyboard(lang, dirKey));
  });

  // Procedure chosen.
  bot.action(/^c:proc:(\w+):([\w-]+)$/, async (ctx) => {
    const lang = getLang(ctx);
    const [, dirKey, procId] = ctx.match;
    const { proc } = findProc(dirKey, procId);
    if (!proc) return ack(ctx);
    await ack(ctx);

    if (!proc.custom && proc.qty) {
      ctx.session.calc = { dir: dirKey, procId, qty: 1 };
      await editHtml(ctx, t(lang, 'calc_qty', { unit: L(proc.unit, lang) }), calcQtyKeyboard(lang, dirKey, procId, 1));
      return;
    }
    await editHtml(ctx, renderResult(lang, dirKey, procId, 1), calcResultKeyboard(lang));
  });

  // Quantity +/-.
  bot.action(/^c:qty:(\w+):([\w-]+):(inc|dec)$/, async (ctx) => {
    const lang = getLang(ctx);
    const [, dirKey, procId, dir] = ctx.match;
    const calc = ctx.session.calc || { dir: dirKey, procId, qty: 1 };
    calc.qty = Math.max(1, Math.min(MAX_QTY, (calc.qty || 1) + (dir === 'inc' ? 1 : -1)));
    ctx.session.calc = calc;
    await ack(ctx);
    const { proc } = findProc(dirKey, procId);
    await editHtml(ctx, t(lang, 'calc_qty', { unit: L(proc.unit, lang) }), calcQtyKeyboard(lang, dirKey, procId, calc.qty));
  });

  bot.action('c:noop', (ctx) => ack(ctx));

  // Show the estimate for the chosen quantity.
  bot.action(/^c:show:(\w+):([\w-]+)$/, async (ctx) => {
    const lang = getLang(ctx);
    const [, dirKey, procId] = ctx.match;
    const qty = ctx.session.calc?.qty || 1;
    await ack(ctx);
    await editHtml(ctx, renderResult(lang, dirKey, procId, qty), calcResultKeyboard(lang));
  });
}
