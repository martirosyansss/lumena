import { Markup } from 'telegraf';
import { config } from '../config.js';
import { t, escapeHtml } from '../i18n.js';
import { SAVINGS, L } from '../catalog.js';
import { faqKeyboard, faqAnswerKeyboard, backToMenu } from '../keyboards.js';
import { getLang, ack, editHtml } from '../ui.js';

// Inline keyboard reused under content screens: primary CTA + calc + menu.
function contentKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_lead'), 'm:lead')],
    [Markup.button.callback(t(lang, 'btn_calc'), 'm:calc'), Markup.button.callback(t(lang, 'btn_menu'), 'm:home')],
  ]);
}

function buildContactLinks(lang) {
  const c = config.coordinator;
  const lines = [];
  if (c.username) lines.push(`💬 Telegram: <a href="https://t.me/${escapeHtml(c.username)}">@${escapeHtml(c.username)}</a>`);
  if (c.whatsapp) lines.push(`🟢 WhatsApp: <a href="https://wa.me/${escapeHtml(c.whatsapp)}">wa.me/${escapeHtml(c.whatsapp)}</a>`);
  if (c.phone) lines.push(`📞 ${escapeHtml(c.phone)}`);
  return lines.join('\n');
}

function contactButtons(lang) {
  const c = config.coordinator;
  const rows = [];
  if (c.username) rows.push([Markup.button.url('💬 Telegram', `https://t.me/${c.username}`)]);
  if (c.whatsapp) rows.push([Markup.button.url('🟢 WhatsApp', `https://wa.me/${c.whatsapp}`)]);
  rows.push([Markup.button.callback(t(lang, 'btn_lead'), 'm:lead')]);
  rows.push([Markup.button.callback(t(lang, 'btn_menu'), 'm:home')]);
  return Markup.inlineKeyboard(rows);
}

export function register(bot) {
  bot.action('m:dir', async (ctx) => {
    const lang = getLang(ctx);
    await ack(ctx);
    await editHtml(ctx, t(lang, 'directions'), contentKeyboard(lang));
  });

  bot.action('m:save', async (ctx) => {
    const lang = getLang(ctx);
    await ack(ctx);
    const rows = SAVINGS.map((s) =>
      t(lang, 'savings_row', { icon: s.icon, proc: L(s.proc, lang), mos: s.mos, yer: s.yer, save: s.save }),
    ).join('\n\n');
    const text = `${t(lang, 'savings_title')}\n\n${rows}\n\n${t(lang, 'savings_disclaimer')}`;
    await editHtml(ctx, text, contentKeyboard(lang));
  });

  bot.action('m:faq', async (ctx) => {
    const lang = getLang(ctx);
    await ack(ctx);
    await editHtml(ctx, t(lang, 'faq_title'), faqKeyboard(lang));
  });

  bot.action(/^faq:([1-6])$/, async (ctx) => {
    const lang = getLang(ctx);
    const n = ctx.match[1];
    await ack(ctx);
    const text = `<b>${escapeHtml(t(lang, `faq_q${n}`))}</b>\n\n${t(lang, `faq_a${n}`)}`;
    await editHtml(ctx, text, faqAnswerKeyboard(lang));
  });

  bot.action('m:guide', async (ctx) => {
    const lang = getLang(ctx);
    await ack(ctx);
    if (config.guideUrl) {
      const link = `<a href="${escapeHtml(config.guideUrl)}">${t(lang, 'guide_open')}</a>`;
      const kb = Markup.inlineKeyboard([
        [Markup.button.url(t(lang, 'guide_open'), config.guideUrl)],
        [Markup.button.callback(t(lang, 'btn_lead'), 'm:lead')],
        [Markup.button.callback(t(lang, 'btn_menu'), 'm:home')],
      ]);
      await editHtml(ctx, t(lang, 'guide_text', { link }), kb);
    } else {
      await editHtml(ctx, t(lang, 'guide_none'), contentKeyboard(lang));
    }
  });

  bot.action('m:contact', async (ctx) => {
    const lang = getLang(ctx);
    await ack(ctx);
    const links = buildContactLinks(lang);
    if (links) {
      await editHtml(ctx, t(lang, 'contact_text', { links }), contactButtons(lang));
    } else {
      await editHtml(ctx, t(lang, 'contact_none'), backToMenu(lang));
    }
  });
}
