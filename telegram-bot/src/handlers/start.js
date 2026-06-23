import { t } from '../i18n.js';
import { languageKeyboard, mainMenu } from '../keyboards.js';
import { getLang, ack, sendHtml, editHtml, showMenu, resetFlows } from '../ui.js';
import { guideView } from './menu.js';
import { track } from '../analytics.js';

async function sendWelcome(ctx) {
  const lang = getLang(ctx);
  return sendHtml(ctx, t(lang, 'welcome'), mainMenu(lang));
}

/** Deliver the free guide as a fresh message (deep-link entry point). */
async function sendGuide(ctx) {
  ctx.session.lastSource = 'guide';
  const { text, kb } = guideView(getLang(ctx));
  return sendHtml(ctx, text, kb);
}

export function register(bot) {
  bot.start(async (ctx) => {
    resetFlows(ctx);
    track('start');
    // Website lead magnet sends users here via t.me/<bot>?start=guide2026.
    const wantsGuide = /^guide/i.test(ctx.startPayload || '');
    if (!ctx.session.lang) {
      // Remember the intent so we can deliver the guide right after they pick a language.
      ctx.session.pendingGuide = wantsGuide || undefined;
      await ctx.reply(t('ru', 'choose_language'), languageKeyboard());
      return;
    }
    if (wantsGuide) {
      await sendGuide(ctx);
      return;
    }
    await sendWelcome(ctx);
  });

  bot.command('menu', async (ctx) => {
    resetFlows(ctx);
    await showMenu(ctx);
  });

  bot.command('help', async (ctx) => {
    await showMenu(ctx);
  });

  bot.command('cancel', async (ctx) => {
    const lang = getLang(ctx);
    resetFlows(ctx);
    await sendHtml(ctx, t(lang, 'lead_cancelled'), mainMenu(lang));
  });

  bot.command('lang', async (ctx) => {
    await ctx.reply(t('ru', 'choose_language'), languageKeyboard());
  });

  // Language picked (first run or via the 🌐 button).
  bot.action(/^lang:(ru|en|hy)$/, async (ctx) => {
    const firstTime = !ctx.session.lang;
    ctx.session.lang = ctx.match[1];
    const lang = ctx.session.lang;
    if (firstTime) track('lang_set');
    await ack(ctx);
    // Arrived via the guide deep-link and just picked a language → show the guide.
    if (ctx.session.pendingGuide) {
      ctx.session.pendingGuide = undefined;
      ctx.session.lastSource = 'guide';
      const { text, kb } = guideView(lang);
      await editHtml(ctx, text, kb);
      return;
    }
    if (firstTime) {
      await editHtml(ctx, t(lang, 'welcome'), mainMenu(lang));
    } else {
      await editHtml(ctx, t(lang, 'lang_changed'), mainMenu(lang));
    }
  });

  bot.action('m:lang', async (ctx) => {
    await ack(ctx);
    await editHtml(ctx, t('ru', 'choose_language'), languageKeyboard());
  });

  bot.action('m:home', async (ctx) => {
    resetFlows(ctx);
    await ack(ctx);
    await showMenu(ctx, { edit: true });
  });
}

export { sendWelcome };
