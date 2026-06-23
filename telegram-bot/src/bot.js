import http from 'node:http';
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
const sessionStore = createFileSessionStore('data/sessions.json');
bot.use(
  session({
    store: sessionStore,
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

// Tiny HTTP server so free PaaS platforms (Koyeb/Render/etc.) that expect an
// open port keep the worker alive and have a health/keep-alive URL to ping.
// Only starts when PORT is provided by the platform; no-op for local polling.
function startHealthServer() {
  const port = process.env.PORT;
  if (!port) return;
  http
    .createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('MedBridge Tourism bot — OK');
    })
    .listen(port, () => console.log(`[bot] health server listening on :${port}`));
}

// Launch polling, tolerating 409 ("another getUpdates is running"). The health
// server stays up the whole time, so the platform keeps the service "live"
// while we wait for any other instance to go away, then we take over polling.
async function launchWithRetry() {
  for (let attempt = 1; ; attempt++) {
    try {
      await bot.launch({ dropPendingUpdates: true });
      return; // resolves only on graceful stop
    } catch (err) {
      if (err?.response?.error_code === 409) {
        console.warn(
          `[bot] 409 Conflict: другой инстанс ещё опрашивает Telegram (попытка ${attempt}). ` +
            'Повтор через 10с. Должна работать только ОДНА копия бота.',
        );
        await new Promise((r) => setTimeout(r, 10_000));
        continue;
      }
      throw err;
    }
  }
}

async function main() {
  warnOptional();
  startHealthServer();
  await bot.telegram.setMyCommands(COMMANDS).catch((e) => console.warn('[bot] setMyCommands failed:', e.message));
  const me = await bot.telegram.getMe();
  console.log(`[bot] @${me.username} starting polling… (one instance only)`);
  await launchWithRetry();
}

let stopping = false;
async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  bot.stop(signal);
  // Flush any debounced session writes so in-progress flows survive a restart.
  await sessionStore.flush();
}
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => console.error('[bot] unhandledRejection:', reason));

main().catch((err) => {
  console.error('[bot] fatal startup error:', err);
  process.exit(1);
});
