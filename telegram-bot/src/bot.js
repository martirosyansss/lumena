import { Telegraf, session } from 'telegraf';
import { config, warnOptional } from './config.js';
import { createFileSessionStore } from './sessionStore.js';
import { t } from './i18n.js';
import { languageKeyboard } from './keyboards.js';
import { showMenu } from './ui.js';
import * as start from './handlers/start.js';
import * as menu from './handlers/menu.js';
import * as calculator from './handlers/calculator.js';
import * as lead from './handlers/lead.js';

const bot = new Telegraf(config.botToken, { handlerTimeout: 30_000 });

// --- Session ----------------------------------------------------------------
bot.use(
  session({
    store: createFileSessionStore('data/sessions.json'),
    defaultSession: () => ({}),
  }),
);
// Safety net in case the running Telegraf build ignores defaultSession.
bot.use((ctx, next) => {
  if (ctx.session == null) ctx.session = {};
  return next();
});

// --- Feature handlers (order matters: lead's text/contact handlers must run
//     before the generic fallbacks below) -----------------------------------
start.register(bot);
menu.register(bot);
calculator.register(bot);
lead.register(bot);

// --- Fallbacks --------------------------------------------------------------
// Any other text → if no language yet, ask for it; otherwise nudge to the menu.
bot.on('text', async (ctx) => {
  if (!ctx.session.lang) {
    return ctx.reply(t('ru', 'choose_language'), languageKeyboard());
  }
  return showMenu(ctx);
});

// Acknowledge any callback that nothing else handled (prevents spinner hang).
bot.on('callback_query', async (ctx) => {
  try {
    await ctx.answerCbQuery();
  } catch {
    /* stale */
  }
});

// --- Global error handler ---------------------------------------------------
bot.catch((err, ctx) => {
  console.error(`[bot] unhandled error on ${ctx?.updateType}:`, err);
});

// --- Boot -------------------------------------------------------------------
const COMMANDS = [
  { command: 'start', description: 'Начать / Start / Սկսել' },
  { command: 'menu', description: 'Меню / Menu / Մենյու' },
  { command: 'lang', description: 'Сменить язык / Language / Լեզու' },
  { command: 'help', description: 'Помощь / Help / Օգնություն' },
];

async function main() {
  warnOptional();
  await bot.telegram.setMyCommands(COMMANDS).catch((e) => console.warn('[bot] setMyCommands failed:', e.message));
  const me = await bot.telegram.getMe();
  console.log(`[bot] @${me.username} is up (long polling). Press Ctrl+C to stop.`);
  await bot.launch({ dropPendingUpdates: true });
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
process.on('unhandledRejection', (reason) => console.error('[bot] unhandledRejection:', reason));

main().catch((err) => {
  console.error('[bot] fatal startup error:', err);
  process.exit(1);
});
