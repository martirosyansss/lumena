import { t } from '../i18n.js';
import { config } from '../config.js';
import { languageKeyboard, mainMenu } from '../keyboards.js';
import { getLang, ack, sendHtml, editHtml, showMenu, resetFlows } from '../ui.js';

async function sendWelcome(ctx) {
  const lang = getLang(ctx);
  return sendHtml(ctx, t(lang, 'welcome'), mainMenu(lang));
}

export function register(bot) {
  bot.start(async (ctx) => {
    resetFlows(ctx);
    if (!ctx.session.lang) {
      await ctx.reply(t('ru', 'choose_language'), languageKeyboard());
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
    await ack(ctx);
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
