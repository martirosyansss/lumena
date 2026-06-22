import { promises as fs } from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { escapeHtml } from './i18n.js';

const LEADS_PATH = path.resolve(process.cwd(), config.leadsFile);

const SOURCE_LABELS = { menu: 'меню', calculator: 'калькулятор', guide: 'гайд' };

/** Append the lead to a local JSONL file so nothing is ever lost. Best-effort. */
async function appendBackup(lead) {
  try {
    await fs.mkdir(path.dirname(LEADS_PATH), { recursive: true });
    await fs.appendFile(LEADS_PATH, JSON.stringify(lead) + '\n', 'utf8');
    return true;
  } catch (err) {
    console.error('[leads] backup write failed:', err.message);
    return false;
  }
}

/** Send the lead to the manager Telegram chat. Returns true on success. */
async function deliverTelegram(bot, lead) {
  if (!config.managerChatId) return { configured: false, ok: false };

  const u = lead.user || {};
  const userLink = u.username
    ? `@${escapeHtml(u.username)}`
    : `<a href="tg://user?id=${u.id}">${escapeHtml(u.first_name || 'пользователь')}</a>`;

  const text =
    '🔔 <b>Новая заявка — MedBridge Tourism</b>\n\n' +
    `<b>Направление:</b> ${escapeHtml(lead.procedure)}\n` +
    `<b>Имя:</b> ${escapeHtml(lead.name)}\n` +
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}\n` +
    `<b>Комментарий:</b> ${escapeHtml(lead.comment || '—')}\n\n` +
    `<b>Источник:</b> ${SOURCE_LABELS[lead.source] || lead.source}\n` +
    `<b>Язык:</b> ${lead.lang}\n` +
    `<b>Клиент:</b> ${userLink} (id ${u.id})\n` +
    `<b>Время:</b> ${escapeHtml(lead.time)}`;

  try {
    await bot.telegram.sendMessage(config.managerChatId, text, {
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
    });
    return { configured: true, ok: true };
  } catch (err) {
    console.error('[leads] telegram delivery failed:', err.message);
    return { configured: true, ok: false };
  }
}

/** Log the lead to a Google Sheet via the Apps Script Web App. */
async function deliverSheet(lead) {
  if (!config.sheets.webAppUrl) return { configured: false, ok: false };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(config.sheets.webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: config.sheets.secret,
        time: lead.time,
        iso: lead.iso,
        procedure: lead.procedure,
        name: lead.name,
        phone: lead.phone,
        comment: lead.comment || '',
        source: lead.source,
        lang: lead.lang,
        userId: lead.user?.id ?? '',
        username: lead.user?.username ?? '',
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error('[leads] sheet delivery HTTP', res.status);
      return { configured: true, ok: false };
    }
    return { configured: true, ok: true };
  } catch (err) {
    console.error('[leads] sheet delivery failed:', err.message);
    return { configured: true, ok: false };
  }
}

/**
 * Persist + deliver a lead across all channels.
 * @returns {Promise<{ok: boolean, telegram: boolean, sheet: boolean, backup: boolean}>}
 *          ok=false means every *configured* delivery channel failed and the
 *          client should be nudged to contact the coordinator directly.
 */
export async function submitLead(bot, lead) {
  const now = new Date();
  const enriched = {
    ...lead,
    iso: now.toISOString(),
    time: now.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ' (МСК)',
  };

  const backup = await appendBackup(enriched);
  const [tg, sheet] = await Promise.all([deliverTelegram(bot, enriched), deliverSheet(enriched)]);

  const configuredFailed =
    (tg.configured && !tg.ok) && (sheet.configured ? !sheet.ok : true) && !backup;
  const anyDelivered = tg.ok || sheet.ok;
  const noChannels = !tg.configured && !sheet.configured;

  const ok = anyDelivered || (noChannels && backup);

  return { ok, telegram: tg.ok, sheet: sheet.ok, backup, configuredFailed };
}
