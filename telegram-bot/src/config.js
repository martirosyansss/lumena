import fs from 'node:fs';
import dotenv from 'dotenv';

// Load the local .env (if any) first...
dotenv.config();
// ...then fall back to PaaS "secret file" mounts (Render mounts Secret Files at
// /etc/secrets/<name>). Lets you paste the whole .env as one file instead of
// entering each variable separately. Existing vars are not overwritten.
for (const p of ['/etc/secrets/.env', '/etc/secrets/env']) {
  try {
    if (fs.existsSync(p)) dotenv.config({ path: p });
  } catch {
    /* ignore */
  }
}

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

function required(name) {
  const v = clean(process.env[name]);
  if (!v) {
    console.error(`[config] Missing required env var: ${name}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
  return v;
}

export const config = {
  botToken: required('BOT_TOKEN'),

  // Telegram chat (group or personal) that receives leads. Empty => leads not delivered to TG.
  managerChatId: clean(process.env.MANAGER_CHAT_ID),

  sheets: {
    webAppUrl: clean(process.env.SHEETS_WEBAPP_URL),
    secret: clean(process.env.SHEETS_SECRET),
  },

  coordinator: {
    username: clean(process.env.COORDINATOR_USERNAME).replace(/^@/, ''),
    whatsapp: clean(process.env.COORDINATOR_WHATSAPP).replace(/[^\d]/g, ''),
    phone: clean(process.env.COORDINATOR_PHONE),
  },

  guideUrl: clean(process.env.GUIDE_URL),
  siteUrl: clean(process.env.SITE_URL) || 'https://medbridge-tourism.com',
  defaultLang: clean(process.env.DEFAULT_LANG) || 'ru',
  leadsFile: clean(process.env.LEADS_FILE) || 'data/leads.jsonl',
};

/** Print non-fatal warnings about optional-but-recommended config at boot. */
export function warnOptional() {
  if (!config.managerChatId) {
    console.warn('[config] MANAGER_CHAT_ID is not set — leads will NOT be delivered to Telegram (local backup still works).');
  }
  if (!config.sheets.webAppUrl) {
    console.warn('[config] SHEETS_WEBAPP_URL is not set — leads will NOT be written to Google Sheets.');
  }
  if (!config.coordinator.username && !config.coordinator.whatsapp && !config.coordinator.phone) {
    console.warn('[config] No coordinator contacts set — the "contact" button will show a generic message.');
  }
}
