import { config } from '../config.js';
import { t, escapeHtml } from '../i18n.js';
import { DATA, L } from '../catalog.js';
import {
  leadProcKeyboard,
  phoneKeyboard,
  commentKeyboard,
  confirmKeyboard,
  backToMenu,
  removeKeyboard,
} from '../keyboards.js';
import { getLang, ack, sendHtml, editHtml, resetFlows } from '../ui.js';
import { submitLead } from '../leads.js';

const MAX_NAME = 60;
const MAX_COMMENT = 600;
// Anti-spam: minimum gap between two lead submissions from the same user.
const LEAD_COOLDOWN_MS = 2 * 60 * 1000;

function validName(s) {
  const n = s.trim();
  return n.length >= 2 && n.length <= MAX_NAME && !n.startsWith('/');
}

function validPhone(s) {
  const digits = s.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/** Localized clickable contact for the coordinator, or null if none configured. */
function coordinatorContactHtml() {
  const c = config.coordinator;
  if (c.username) return `<a href="https://t.me/${escapeHtml(c.username)}">@${escapeHtml(c.username)}</a>`;
  if (c.whatsapp) return `<a href="https://wa.me/${escapeHtml(c.whatsapp)}">WhatsApp</a>`;
  if (c.phone) return escapeHtml(c.phone);
  return null;
}

async function startLead(ctx, { edit }) {
  const lang = getLang(ctx);
  ctx.session.calc = undefined;
  ctx.session.lead = { step: 'procedure', source: ctx.session.lastSource || 'menu' };
  const text = t(lang, 'lead_intro');
  if (edit) return editHtml(ctx, text, leadProcKeyboard(lang));
  return sendHtml(ctx, text, leadProcKeyboard(lang));
}

async function askComment(ctx) {
  const lang = getLang(ctx);
  ctx.session.lead.step = 'comment';
  // Drop the phone reply keyboard, then prompt for an optional comment.
  await ctx.reply('✅', removeKeyboard());
  await sendHtml(ctx, t(lang, 'lead_ask_comment'), commentKeyboard(lang));
}

async function showConfirm(ctx) {
  const lang = getLang(ctx);
  const l = ctx.session.lead;
  l.step = 'confirm';
  const text = t(lang, 'lead_confirm', {
    procedure: escapeHtml(l.procedureClient),
    name: escapeHtml(l.name),
    phone: escapeHtml(l.phone),
    comment: escapeHtml(l.comment || t(lang, 'no_comment')),
  });
  await sendHtml(ctx, text, confirmKeyboard(lang));
}

async function cancelLead(ctx) {
  const lang = getLang(ctx);
  resetFlows(ctx);
  await ctx.reply(t(lang, 'lead_cancelled'), removeKeyboard());
  await sendHtml(ctx, t(lang, 'menu_prompt'), backToMenu(lang));
}

export function register(bot) {
  // Enter the lead flow (from the menu, calculator CTA, FAQ, etc.).
  bot.action('m:lead', async (ctx) => {
    // Source priority: an active calculator > a screen that pre-tagged itself
    // (e.g. the guide) > plain menu.
    ctx.session.lastSource = ctx.session.calc?.dir ? 'calculator' : ctx.session.lastSource || 'menu';
    await ack(ctx);
    await startLead(ctx, { edit: true });
  });

  // Procedure chosen.
  bot.action(/^l:proc:(\w+)$/, async (ctx) => {
    const lang = getLang(ctx);
    if (!ctx.session.lead) return ack(ctx);
    const key = ctx.match[1];
    if (key === 'other') {
      ctx.session.lead.procedure = 'Не определился';
      ctx.session.lead.procedureClient = t(lang, 'lead_other');
    } else if (DATA[key]) {
      ctx.session.lead.procedure = L(DATA[key].label, 'ru');
      ctx.session.lead.procedureClient = L(DATA[key].label, lang);
    } else {
      return ack(ctx);
    }
    ctx.session.lead.step = 'name';
    await ack(ctx);
    await editHtml(ctx, t(lang, 'lead_ask_name'));
  });

  // Skip the optional comment.
  bot.action('l:skip', async (ctx) => {
    if (ctx.session.lead?.step !== 'comment') return ack(ctx);
    ctx.session.lead.comment = '';
    await ack(ctx);
    await showConfirm(ctx);
  });

  // Re-fill from the start.
  bot.action('l:edit', async (ctx) => {
    await ack(ctx);
    await startLead(ctx, { edit: true });
  });

  bot.action('l:cancel', async (ctx) => {
    await ack(ctx);
    await cancelLead(ctx);
  });

  // Submit.
  bot.action('l:submit', async (ctx) => {
    const lang = getLang(ctx);
    const l = ctx.session.lead;
    if (!l || l.step !== 'confirm') return ack(ctx);
    await ack(ctx);

    // Throttle repeat submissions so one user can't flood the manager / Sheet.
    if (Date.now() - (ctx.session.lastLeadAt || 0) < LEAD_COOLDOWN_MS) {
      resetFlows(ctx);
      return sendHtml(ctx, t(lang, 'lead_too_soon'), backToMenu(lang));
    }
    ctx.session.lastLeadAt = Date.now();

    const lead = {
      procedure: l.procedure,
      name: l.name,
      phone: l.phone,
      comment: l.comment || '',
      source: l.source,
      lang,
      user: {
        id: ctx.from.id,
        username: ctx.from.username || '',
        first_name: ctx.from.first_name || '',
      },
    };

    const result = await submitLead(bot, lead);
    resetFlows(ctx);

    const contact = coordinatorContactHtml();
    if (result.ok) {
      const contactPart = contact ? t(lang, 'lead_submitted_contact', { contact }) : '';
      await sendHtml(ctx, t(lang, 'lead_submitted', { name: escapeHtml(lead.name), contact: contactPart }), backToMenu(lang));
    } else {
      const text = contact
        ? t(lang, 'lead_error', { contact })
        : t(lang, 'lead_error_nocontact');
      await sendHtml(ctx, text, backToMenu(lang));
    }
  });

  // Phone shared via the contact button.
  bot.on('contact', async (ctx, next) => {
    if (ctx.session.lead?.step !== 'phone') return next();
    ctx.session.lead.phone = ctx.message.contact.phone_number;
    await askComment(ctx);
  });

  // Free-text steps: name / phone (typed) / comment. Passes through otherwise.
  bot.on('text', async (ctx, next) => {
    const lead = ctx.session.lead;
    const lang = getLang(ctx);
    const text = ctx.message.text.trim();

    // Reply-keyboard cancel button.
    if (lead && text === t(lang, 'lead_cancel')) return cancelLead(ctx);

    if (!lead || !['name', 'phone', 'comment'].includes(lead.step)) return next();

    if (lead.step === 'name') {
      if (!validName(text)) return sendHtml(ctx, t(lang, 'lead_invalid_name'));
      lead.name = text.slice(0, MAX_NAME);
      lead.step = 'phone';
      return sendHtml(ctx, t(lang, 'lead_ask_phone', { name: escapeHtml(lead.name) }), phoneKeyboard(lang));
    }

    if (lead.step === 'phone') {
      if (!validPhone(text)) return sendHtml(ctx, t(lang, 'lead_invalid_phone'));
      lead.phone = text;
      return askComment(ctx);
    }

    if (lead.step === 'comment') {
      lead.comment = text.slice(0, MAX_COMMENT);
      return showConfirm(ctx);
    }

    return next();
  });
}
