import fs from 'node:fs';
import path from 'node:path';

// Lightweight funnel analytics. In-memory counters with debounced persistence
// to data/stats.json. NOTE: on an ephemeral PaaS filesystem (Render free) this
// file resets on redeploy, so /stats reflects "since last deploy" — good enough
// to watch conversion; for permanent history, log events to the Sheet instead.

const FILE = path.resolve(process.cwd(), 'data/stats.json');

const data = { since: new Date().toISOString(), events: {} };
try {
  Object.assign(data, JSON.parse(fs.readFileSync(FILE, 'utf8')));
} catch {
  /* no stats file yet */
}

let timer = null;
function persist() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    try {
      fs.mkdirSync(path.dirname(FILE), { recursive: true });
      fs.writeFileSync(FILE, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, 2000);
}

/** Increment an event counter (fire-and-forget). */
export function track(event, n = 1) {
  data.events[event] = (data.events[event] || 0) + n;
  persist();
}

export function stats() {
  return data;
}

/** Render an admin-facing funnel report (Russian, HTML). */
export function formatStats() {
  const e = data.events;
  const g = (k) => e[k] || 0;
  const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '—');

  const starts = g('start');
  const ls = g('lead_started');
  const lc = g('lead_completed');

  return [
    '📊 <b>Статистика бота</b>',
    `<i>с ${data.since.replace('T', ' ').slice(0, 16)} UTC</i>`,
    '',
    `👋 Запусков (/start): <b>${starts}</b>`,
    `🧮 Калькулятор: <b>${g('calc_used')}</b>`,
    `❓ FAQ открыт: <b>${g('faq_view')}</b>`,
    '',
    '<b>Воронка заявок:</b>',
    `• Начали заявку: <b>${ls}</b> (${pct(ls, starts)} от стартов)`,
    `• Завершили: <b>${lc}</b> (${pct(lc, ls)} от начавших · ${pct(lc, starts)} от стартов)`,
    `• Дожим-напоминаний: <b>${g('lead_nudged')}</b>`,
    '',
    `🛡 Заблокировано (спам/лимит): <b>${g('spam_blocked')}</b>`,
  ].join('\n');
}
