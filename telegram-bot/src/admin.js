import { Markup } from 'telegraf';
import { config } from './config.js';
import { t } from './i18n.js';
import { track, formatStats } from './analytics.js';

export function isAdmin(ctx) {
  if (config.managerChatId && String(ctx.chat?.id) === String(config.managerChatId)) return true;
  return config.adminIds.includes(String(ctx.from?.id));
}

export function register(bot) {
  // Admin-only funnel report. Unlisted (not in the public command menu).
  bot.command('stats', async (ctx) => {
    if (!isAdmin(ctx)) return;
    await ctx.reply(formatStats(), { parse_mode: 'HTML' });
  });
}

/** Tell the manager chat the bot (re)started — repeated alerts == something's wrong. */
export async function startupAlert(bot) {
  if (!config.managerChatId) return;
  const when = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  await bot.telegram
    .sendMessage(config.managerChatId, `🟢 Бот запущен/перезапущен — ${when} (МСК)`)
    .catch(() => {});
}

function nudgeKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_lead'), 'm:lead')],
    [Markup.button.callback(t(lang, 'btn_menu'), 'm:home')],
  ]);
}

/**
 * Periodically nudge users who started the lead flow but didn't finish.
 * One nudge per abandoned lead. Best-effort (sessions are in-memory/file).
 */
export function startNudgeSweep(bot, sessionStore) {
  if (typeof sessionStore.entries !== 'function') return;
  const NUDGE_AFTER = config.nudgeAfterMin * 60 * 1000;
  const SWEEP_EVERY = 3 * 60 * 1000;

  const tick = async () => {
    try {
      const now = Date.now();
      const entries = await sessionStore.entries();
      for (const [key, s] of entries) {
        const lead = s?.lead;
        if (!lead || !['procedure', 'name', 'phone', 'comment'].includes(lead.step)) continue;
        if (lead.nudged || !lead.startedAt || !lead.chatId) continue;
        if (now - lead.startedAt < NUDGE_AFTER) continue;

        lead.nudged = true;
        await sessionStore.set(key, s);
        const lang = s.lang || config.defaultLang;
        await bot.telegram
          .sendMessage(lead.chatId, t(lang, 'lead_nudge'), { parse_mode: 'HTML', ...nudgeKeyboard(lang) })
          .catch(() => {});
        track('lead_nudged');
      }
    } catch (err) {
      console.error('[nudge] sweep error:', err.message);
    }
  };

  const handle = setInterval(tick, SWEEP_EVERY);
  if (typeof handle.unref === 'function') handle.unref();
}
