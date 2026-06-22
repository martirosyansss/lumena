// Internationalization. Messages use Telegram HTML parse mode (<b>, <i>).
// Any user-supplied value injected into a message must be passed through
// escapeHtml() by the caller before interpolation.

export const LANGS = [
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'hy', label: '🇦🇲 Հայերեն' },
];

export const LANG_CODES = LANGS.map((l) => l.code);

const ru = {
  choose_language: 'Выберите язык / Choose language / Ընտրեք լեզուն',
  lang_changed: 'Готово, язык переключён. 👇',

  welcome:
    '👋 Здравствуйте! Это <b>MedBridge Tourism</b> — ваш проводник в лечении в клиниках Армении «под ключ».\n\n' +
    '• Ориентир экономии <b>30–60%</b> к частной Москве\n' +
    '• <b>Без виз</b> — въезд по паспорту РФ\n' +
    '• Перелёт <b>2,5–3 часа</b> из Москвы\n' +
    '• Личный координатор <b>24/7</b> — живой человек, не бот\n\n' +
    'Подберём клинику под ваш случай и бесплатно посчитаем смету за 1 день. Это ни к чему не обязывает.\n\n' +
    'С чего начнём? 👇',

  menu_prompt: 'Чем помочь? Выберите пункт меню 👇',

  btn_calc: '🧮 Рассчитать смету',
  btn_directions: '🩺 Направления лечения',
  btn_savings: '💰 Сколько сэкономлю',
  btn_lead: '📩 Оставить заявку',
  btn_guide: '📕 Бесплатный гайд',
  btn_faq: '❓ Частые вопросы',
  btn_contact: '👤 Связаться с координатором',
  btn_lang: '🌐 Язык',
  btn_back: '← Назад',
  btn_menu: '🏠 В меню',

  directions:
    '<b>Направления, которые мы организуем:</b>\n\n' +
    '🦷 <b>Стоматология</b> — импланты, виниры, All-on-4/6, протезирование.\n' +
    '💉 <b>Пластическая хирургия</b> — ринопластика, абдоминопластика и др.\n' +
    '🩺 <b>Чек-апы и диагностика</b> — расширенное обследование за 1–2 дня.\n' +
    '🏥 <b>Плановая и общая хирургия</b> — включая эндопротезирование суставов.\n' +
    '👶 <b>Репродукция и ЭКО</b> — легальные для граждан РФ программы, суррогатное материнство и донорство, полная приватность.\n\n' +
    'За лечение вы платите напрямую клинике — наша координация уже включена в пакет.',

  savings_title: '<b>Сколько можно сэкономить: ориентиры по ценам</b>\nКурс пересчёта: 1 USD ≈ 85 ₽.',
  savings_row: '{icon} <b>{proc}</b>\nМосква: {mos} → Ереван: {yer} ({save})',
  savings_disclaimer:
    '<i>Это рыночные ориентиры из открытых прайс-листов, а не публичная оферта и не ваша персональная смета. ' +
    'Итоговая стоимость индивидуальна. Имеются противопоказания, необходима консультация специалиста.</i>',

  faq_title: 'Частые вопросы — выберите свой 👇',
  faq_q1: 'А качество лечения там достойное?',
  faq_a1:
    'Мы работаем с многопрофильными клиниками и профильными центрами Армении — современное оборудование, опытные врачи, репутация среди пациентов, в том числе из России. Мы не клиника и не обещаем результат лечения — его определяет врач после очной консультации. Имеются противопоказания, необходима консультация специалиста.',
  faq_q2: 'Кто отвечает, если возникнут вопросы по лечению?',
  faq_a2:
    'За медицинскую часть отвечает клиника, с которой вы заключаете прямой договор. MedBridge Tourism отвечает за организацию: подбор, координацию, сопровождение и связь с клиникой. Координатор поможет быстро выйти на врача и разобраться в ситуации.',
  faq_q3: 'Это не развод? Почему вам можно доверять?',
  faq_a3:
    'Понимаем опасение — поэтому всё строится на прозрачности. За лечение вы платите напрямую клинике по её договору, деньги не проходят через нас. Смету «под ключ» вы видите заранее, до поездки. Расчёт и подбор клиники бесплатны и ни к чему не обязывают.',
  faq_q4: 'Сколько в итоге я заплачу? Есть скрытые доплаты?',
  faq_a4:
    'Мы заранее показываем смету «под ключ»: лечение, перелёт, проживание, трансферы. Цены на сайте — это диапазоны-ориентиры, а не ваша персональная смета. Итоговую стоимость мы рассчитаем бесплатно перед поездкой, чтобы сюрпризов на месте не было.',
  faq_q5: 'Насколько безопасно ехать лечиться в другую страну?',
  faq_a5:
    'Армения — страна ЕАЭС: въезд по внутреннему паспорту РФ, без виз. Перелёт из Москвы — 2,5–3 часа, в клиниках есть русскоязычный персонал, координатор на связи 24/7. Вся поездка обычно занимает от 3 до 14 дней.',
  faq_q6: 'ЭКО и репродукция — это конфиденциально?',
  faq_a6:
    'Да, полная приватность — наш приоритет. Деликатно помогаем с доступом к легальным для граждан РФ программам, включая суррогатное материнство и донорство. Общение — только по удобным вам каналам. Медицинские вопросы решаются с профильными специалистами клиники.',

  calc_choose_dir: 'Что вас интересует? Выберите направление 👇',
  calc_choose_proc: '<b>{dir}</b>: выберите процедуру 👇',
  calc_qty: 'Сколько {unit}?',
  calc_show: 'Показать ориентир →',
  calc_result:
    '<b>{label}</b>\n\n' +
    'Частная Москва: ~{mos}\n' +
    '<b>Ереван «под ключ»: {yer}</b>\n\n' +
    '✅ {save}',
  calc_custom:
    '<b>{label}</b>\n\n' +
    'Эту программу считаем индивидуально под ваш случай. Оставьте контакт — координатор бесплатно посчитает смету «под ключ» за 1 день, ни к чему вас не обязывая.',
  calc_cta: '📩 Получить точную смету бесплатно',
  calc_again: '↻ Посчитать заново',
  calc_disclaimer:
    '<i>Рыночный ориентир из открытых прайс-листов, а не оферта и не персональная смета. Итоговая стоимость индивидуальна. Имеются противопоказания, необходима консультация специалиста.</i>',
  from: 'от',

  lead_intro:
    '📩 Оставьте заявку — координатор свяжется с вами, бесплатно подберёт клинику и посчитает смету «под ключ» за 1 день. Это ни к чему не обязывает.\n\nЧто вас интересует?',
  lead_other: '🤔 Пока не определился(ась)',
  lead_ask_name: 'Как к вам обращаться? Напишите имя.',
  lead_ask_phone:
    'Спасибо, {name}! Оставьте номер телефона — нажмите кнопку ниже, чтобы поделиться, или впишите вручную (например, +7 900 000-00-00).',
  lead_share_phone: '📞 Поделиться телефоном',
  lead_ask_comment:
    'Хотите что-то добавить? Опишите ситуацию или удобное время для звонка. Можно пропустить.',
  lead_skip: 'Пропустить',
  lead_confirm:
    'Проверьте заявку:\n\n' +
    '<b>Направление:</b> {procedure}\n' +
    '<b>Имя:</b> {name}\n' +
    '<b>Телефон:</b> {phone}\n' +
    '<b>Комментарий:</b> {comment}\n\n' +
    'Всё верно?',
  lead_submit: '✅ Отправить заявку',
  lead_edit: '✏️ Заполнить заново',
  lead_cancel: '✖️ Отменить',
  lead_submitted:
    '🎉 Спасибо, {name}! Заявка принята.\n\n' +
    'Координатор MedBridge Tourism свяжется с вами в ближайшее время.{contact}\n\n' +
    'Хорошего дня и крепкого здоровья! 💙',
  lead_submitted_contact: ' Если удобнее — напишите напрямую: {contact}.',
  lead_error:
    '⚠️ Не получилось отправить заявку автоматически, но мы сохранили ваши данные.\nПожалуйста, напишите координатору напрямую: {contact}',
  lead_error_nocontact:
    '⚠️ Не получилось отправить заявку автоматически, но мы сохранили ваши данные и скоро свяжемся с вами.',
  lead_invalid_name: 'Пожалуйста, напишите имя текстом (минимум 2 буквы).',
  lead_invalid_phone:
    'Это не похоже на номер. Впишите в формате +7 900 000-00-00 или нажмите «Поделиться телефоном».',
  lead_cancelled: 'Заявка отменена. Если передумаете — я на связи 👇',
  no_comment: '—',

  contact_text: 'Личный координатор MedBridge Tourism на связи 24/7:\n\n{links}\n\nНапишите в удобном канале — ответим и поможем.',
  contact_none: 'Координатор скоро свяжется с вами. Оставьте заявку через меню 👇',
  contact_tg: '💬 Telegram: @{username}',
  contact_wa: '🟢 WhatsApp: {link}',
  contact_phone: '📞 Телефон: {phone}',

  guide_text:
    '📕 <b>Бесплатный гайд «Лечение в Армении под ключ»</b> — как выбрать клинику, что входит в смету и как сэкономить без потери качества.\n\n{link}\n\nХотите, чтобы координатор разобрал ваш случай лично? Оставьте заявку 👇',
  guide_none: 'Гайд скоро будет доступен. А пока оставьте заявку — координатор ответит на все вопросы 👇',
  guide_open: '📥 Открыть гайд',
};

const en = {
  choose_language: 'Выберите язык / Choose language / Ընտրեք լեզուն',
  lang_changed: 'Done, language switched. 👇',

  welcome:
    '👋 Hello! This is <b>MedBridge Tourism</b> — your guide to all-inclusive treatment at clinics in Armenia.\n\n' +
    '• Save an estimated <b>30–60%</b> vs. private Moscow\n' +
    '• <b>No visa</b> — entry with a Russian passport\n' +
    '• <b>2.5–3 hour</b> flight from Moscow\n' +
    '• A personal coordinator <b>24/7</b> — a real person, not a bot\n\n' +
    "We'll match a clinic to your case and prepare a free turnkey estimate within 1 day. No obligation.\n\n" +
    'Where shall we start? 👇',

  menu_prompt: 'How can we help? Pick a menu item 👇',

  btn_calc: '🧮 Estimate the cost',
  btn_directions: '🩺 Treatments',
  btn_savings: '💰 How much I save',
  btn_lead: '📩 Request a quote',
  btn_guide: '📕 Free guide',
  btn_faq: '❓ FAQ',
  btn_contact: '👤 Contact a coordinator',
  btn_lang: '🌐 Language',
  btn_back: '← Back',
  btn_menu: '🏠 Menu',

  directions:
    '<b>Treatments we organize:</b>\n\n' +
    '🦷 <b>Dentistry</b> — implants, veneers, All-on-4/6, prosthetics.\n' +
    '💉 <b>Plastic surgery</b> — rhinoplasty, abdominoplasty and more.\n' +
    '🩺 <b>Check-ups & diagnostics</b> — extended screening in 1–2 days.\n' +
    '🏥 <b>Elective & general surgery</b> — including joint replacement.\n' +
    '👶 <b>Reproduction & IVF</b> — programs legal for Russian citizens, surrogacy and donor programs, full privacy.\n\n' +
    'You pay the clinic directly — our coordination is already included in the package.',

  savings_title: '<b>How much you can save: price benchmarks</b>\nConversion: 1 USD ≈ 85 ₽.',
  savings_row: '{icon} <b>{proc}</b>\nMoscow: {mos} → Yerevan: {yer} ({save})',
  savings_disclaimer:
    '<i>These are market benchmarks from public price lists — not a public offer or your personal estimate. ' +
    'The final cost is individual. Contraindications exist; a specialist consultation is required.</i>',

  faq_title: 'FAQ — pick a question 👇',
  faq_q1: 'Is the quality of treatment really good?',
  faq_a1:
    'We work with multidisciplinary clinics and specialized centers in Armenia — modern equipment, experienced doctors, a track record with patients including from Russia. We are not a clinic and do not promise treatment outcomes — only a doctor decides that after an in-person consultation. Contraindications exist; a specialist consultation is required.',
  faq_q2: 'Who is responsible if questions arise during treatment?',
  faq_a2:
    'The clinic you sign a direct contract with is responsible for the medical part. MedBridge Tourism is responsible for the organization: matching, coordination, support and liaison with the clinic. Your coordinator helps you reach the doctor quickly.',
  faq_q3: "Isn't this a scam? Why should I trust you?",
  faq_a3:
    'We understand the concern — that is why everything is built on transparency. You pay the clinic directly under its contract; money does not pass through us. You see the turnkey estimate in advance, before the trip. The estimate and clinic matching are free and carry no obligation.',
  faq_q4: 'How much will I pay in the end? Any hidden fees?',
  faq_a4:
    'We show the turnkey estimate in advance: treatment, flight, accommodation, transfers. Site prices are reference ranges, not your personal estimate. We calculate the final cost for free before the trip so there are no surprises on site.',
  faq_q5: 'How safe is it to travel abroad for treatment?',
  faq_a5:
    'Armenia is an EAEU country: entry with a Russian internal passport, no visa. The flight from Moscow is 2.5–3 hours, clinics have Russian-speaking staff, and the coordinator is available 24/7. The whole trip usually takes 3 to 14 days.',
  faq_q6: 'IVF and reproduction — is it confidential?',
  faq_a6:
    'Yes, full privacy is our priority. We discreetly help with access to programs legal for Russian citizens, including surrogacy and donor programs. We communicate only through channels convenient for you. Medical questions are handled with the clinic specialists.',

  calc_choose_dir: 'What are you interested in? Pick a treatment 👇',
  calc_choose_proc: '<b>{dir}</b>: choose a procedure 👇',
  calc_qty: 'How many {unit}?',
  calc_show: 'Show the estimate →',
  calc_result:
    '<b>{label}</b>\n\n' +
    'Private Moscow: ~{mos}\n' +
    '<b>Yerevan, turnkey: {yer}</b>\n\n' +
    '✅ {save}',
  calc_custom:
    '<b>{label}</b>\n\n' +
    'We calculate this program individually for your case. Leave your contact — a coordinator will prepare a free turnkey estimate within 1 day, with no obligation.',
  calc_cta: '📩 Get an exact estimate for free',
  calc_again: '↻ Calculate again',
  calc_disclaimer:
    '<i>A market benchmark from public price lists — not an offer or a personal estimate. The final cost is individual. Contraindications exist; a specialist consultation is required.</i>',
  from: 'from',

  lead_intro:
    '📩 Request a quote — a coordinator will contact you, match a clinic for free and prepare a turnkey estimate within 1 day. No obligation.\n\nWhat are you interested in?',
  lead_other: '🤔 Not sure yet',
  lead_ask_name: 'How should we address you? Please type your name.',
  lead_ask_phone:
    'Thanks, {name}! Please leave a phone number — tap the button below to share it, or type it manually (e.g. +1 555 000-0000).',
  lead_share_phone: '📞 Share phone number',
  lead_ask_comment: 'Want to add anything? Describe your case or a convenient time to call. You can skip this.',
  lead_skip: 'Skip',
  lead_confirm:
    'Please check your request:\n\n' +
    '<b>Treatment:</b> {procedure}\n' +
    '<b>Name:</b> {name}\n' +
    '<b>Phone:</b> {phone}\n' +
    '<b>Comment:</b> {comment}\n\n' +
    'Is everything correct?',
  lead_submit: '✅ Send request',
  lead_edit: '✏️ Start over',
  lead_cancel: '✖️ Cancel',
  lead_submitted:
    '🎉 Thank you, {name}! Your request is received.\n\n' +
    'A MedBridge Tourism coordinator will contact you shortly.{contact}\n\n' +
    'Have a great day and good health! 💙',
  lead_submitted_contact: ' If you prefer, write directly: {contact}.',
  lead_error:
    '⚠️ We could not send the request automatically, but we saved your details.\nPlease write to the coordinator directly: {contact}',
  lead_error_nocontact:
    '⚠️ We could not send the request automatically, but we saved your details and will contact you soon.',
  lead_invalid_name: 'Please type your name as text (at least 2 letters).',
  lead_invalid_phone:
    "That doesn't look like a phone number. Type it as +1 555 000-0000 or tap “Share phone number”.",
  lead_cancelled: 'Request cancelled. If you change your mind — I am here 👇',
  no_comment: '—',

  contact_text: 'Your personal MedBridge Tourism coordinator is available 24/7:\n\n{links}\n\nWrite on any convenient channel — we will help.',
  contact_none: 'A coordinator will contact you shortly. Please leave a request from the menu 👇',
  contact_tg: '💬 Telegram: @{username}',
  contact_wa: '🟢 WhatsApp: {link}',
  contact_phone: '📞 Phone: {phone}',

  guide_text:
    '📕 <b>Free guide “Turnkey treatment in Armenia”</b> — how to choose a clinic, what the estimate includes, and how to save without losing quality.\n\n{link}\n\nWant a coordinator to review your case personally? Leave a request 👇',
  guide_none: 'The guide will be available soon. Meanwhile, leave a request — a coordinator will answer all your questions 👇',
  guide_open: '📥 Open the guide',
};

const hy = {
  choose_language: 'Выберите язык / Choose language / Ընտրեք լեզուն',
  lang_changed: 'Պատրաստ է, լեզուն փոխվեց։ 👇',

  welcome:
    '👋 Բարև Ձեզ! Սա <b>MedBridge Tourism</b>-ն է — Ձեր ուղեկիցը Հայաստանի կլինիկաներում «բանալին ձեռքին» բուժման հարցում։\n\n' +
    '• Խնայողության կողմնորոշիչ՝ <b>30–60%</b> մասնավոր Մոսկվայի համեմատ\n' +
    '• <b>Առանց վիզայի</b> — մուտք ՌԴ անձնագրով\n' +
    '• Թռիչք Մոսկվայից՝ <b>2,5–3 ժամ</b>\n' +
    '• Անձնական համակարգող <b>24/7</b> — իրական մարդ, ոչ բոտ\n\n' +
    'Կընտրենք կլինիկա Ձեր դեպքի համար և 1 օրում անվճար կհաշվարկենք նախահաշիվը։ Սա Ձեզ ոչնչի չի պարտավորեցնում։\n\n' +
    'Որտեղի՞ց սկսենք։ 👇',

  menu_prompt: 'Ինչո՞վ օգնենք։ Ընտրեք մենյուի կետը 👇',

  btn_calc: '🧮 Հաշվել նախահաշիվը',
  btn_directions: '🩺 Բուժման ուղղություններ',
  btn_savings: '💰 Որքա՞ն կխնայեմ',
  btn_lead: '📩 Թողնել հայտ',
  btn_guide: '📕 Անվճар ուղեցույց',
  btn_faq: '❓ Հաճախակի հարցեր',
  btn_contact: '👤 Կապ համակարգողի հետ',
  btn_lang: '🌐 Լեզու',
  btn_back: '← Հետ',
  btn_menu: '🏠 Մենյու',

  directions:
    '<b>Ուղղություններ, որ մենք կազմակերպում ենք․</b>\n\n' +
    '🦷 <b>Ստոմատոլոգիա</b> — իմպլանտներ, երեսպատումներ, All-on-4/6, պրոթեզավորում։\n' +
    '💉 <b>Պլաստիկ վիրաբուժություն</b> — ռինոպլաստիկա, աբդոմինոպլաստիկա և այլն։\n' +
    '🩺 <b>Չեկ-ափ և ախտորоշում</b> — ընդլայնված հետազոտություն 1–2 օրում։\n' +
    '🏥 <b>Պլանային և ընդհանուր վիրաբուժություն</b> — ներառյալ հոդերի էնդոպրоթեզավորում։\n' +
    '👶 <b>Վերարտադրողականություն և ԷՔՕ</b> — ՌԴ քաղաքացիների համար օրինական ծրագրեր, սուրոգատ մայրություն և դոնорություն, լիարժեք գաղտնիություն։\n\n' +
    'Բուժման համար վճարում եք ուղիղ կլինիկային — մեր համակարգումն արդեն ներառված է փաթեթում։',

  savings_title: '<b>Որքան կարելի է խնայել՝ գների կողմնորոշիչներ</b>\nՓոխարժեք՝ 1 USD ≈ 85 ₽։',
  savings_row: '{icon} <b>{proc}</b>\nՄոսկվա՝ {mos} → Երևան՝ {yer} ({save})',
  savings_disclaimer:
    '<i>Սրանք շուկայական կողմնորոշիչներ են բաց գնացուցակներից, ոչ թե հրապարակային օֆերտա կամ Ձեր անձնական նախահաշիվ։ ' +
    'Վերջնական արժեքը անհատական է։ Կան հակացուցումներ, անհրաժեշտ է մասնագետի խորհրդատվություն։</i>',

  faq_title: 'Հաճախակի հարցեր — ընտրեք Ձերը 👇',
  faq_q1: 'Բուժման որակն այնտեղ արժանապատի՞վ է։',
  faq_a1:
    'Մենք աշխատում ենք Հայաստանի բազմապրոֆիլ կլինիկաների և մասնագիտացված կենտրոնների հետ՝ ժամանակակից սարքավորում, փորձառու բժիշկներ, համբավ՝ ներառյալ ՌԴ-ից եկած հիվանդների շրջանում։ Մենք կլինիկա չենք և բուժման արդյունք չենք խостանում — դա որոշում է բժիշկը՝ առկա խորհրդատվությունից հետո։ Կան հակացուցումներ, անհրաժեշտ է մասնագետի խորհրդատվություն։',
  faq_q2: 'Ո՞վ է պատասխանատու, եթե բուժման ընթացքում հարցեր առաջանան։',
  faq_a2:
    'Բժշկական մասի համար պատասխանատու է կլինիկան, որի հետ Դուք ուղիղ պայմանագիր եք կնքում։ MedBridge Tourism-ը պատասխանատու է կազմակերպման համար՝ ընտրություն, համակարգում, ուղեկցում և կապ կլինիկայի հետ։ Համակարգողն օգնում է արագ կապ հաստատել բժշկի հետ։',
  faq_q3: 'Սա խաբեություն չէ՞։ Ինչո՞ւ Ձեզ վստահել։',
  faq_a3:
    'Հասկանում ենք մտահոգությունը — հենց դրա համար ամեն ինչ կառուցված է թափանցիկության վրա։ Բուժման համար վճարում եք ուղիղ կլինիկային՝ իր պայմանագրով, գումարը մեր միջով չի անցնում։ «Բանալին ձեռքին» նախահաշիվը տեսնում եք նախապես՝ ճամփորդությունից առաջ։ Հաշվարկն ու ընտրությունն անվճար են և ոչնչի չեն պարտավորեցնում։',
  faq_q4: 'Վերջում որքա՞ն կվճարեմ։ Թաքնված վճարներ կա՞ն։',
  faq_a4:
    'Մենք նախապես ցույց ենք տալիս «բանալին ձեռքին» նախահաշիվը՝ բուժում, թռիչք, բնակեցում, տրանսֆերներ։ Կայքի գները կողմնորоշիչ միջակայքեր են, ոչ թե Ձեր անձնական նախահաշիվը։ Վերջնական արժեքը անվճար հաշվարկում ենք ճամփորդությունից առաջ՝ որպեսզի տեղում անակնկալներ չլինեն։',
  faq_q5: 'Որքանո՞վ է անվտանգ բուժման համար այլ երկիր մեկնելը։',
  faq_a5:
    'Հայաստանը ԵԱՏՄ երկիր է՝ մուտք ՌԴ ներքին անձնագրով, առանց վիզայի։ Թռիչքը Մոսկվայից 2,5–3 ժամ է, կլինիկաներում կա ռուսախоս անձնակազմ, համակարգողը կապի մեջ է 24/7։ Ողջ ճամփորդությունը սովորաբար տևում է 3–14 օր։',
  faq_q6: 'ԷՔՕ-ն և վերարտադրողականությունը գաղտնի՞ են։',
  faq_a6:
    'Այո, լիարժեք գաղտնիությունը մեր առաջնահերթությունն է։ Նրբորեն օգնում ենք ՌԴ քաղաքացիների համար օրինական ծրագրերի հասանելիությանը, ներառյալ սուրոգատ մայրություն և դոնорություն։ Շփումը՝ միայն Ձեզ հարմար ուղիներով։ Բժշկական հարցերը լուծվում են կլինիկայի մասնագետների հետ։',

  calc_choose_dir: 'Ի՞նչն է Ձեզ հետաքրքրում։ Ընտրեք ուղղությունը 👇',
  calc_choose_proc: '<b>{dir}</b>՝ ընտրեք պրոցедուրան 👇',
  calc_qty: 'Քանի՞ {unit}։',
  calc_show: 'Ցույց տալ կողմնорошիչը →',
  calc_result:
    '<b>{label}</b>\n\n' +
    'Մասնավոր Մոսկվա՝ ~{mos}\n' +
    '<b>Երևան «բանալին ձեռքին»՝ {yer}</b>\n\n' +
    '✅ {save}',
  calc_custom:
    '<b>{label}</b>\n\n' +
    'Այս ծրագիրը հաշվում ենք անհատապես՝ Ձեր դեպքի համար։ Թողեք կոնտակտ — համակարգողը 1 օրում անվճար կհաշվի «բանալին ձեռքին» նախահաշիվը՝ առանց պարտավորության։',
  calc_cta: '📩 Ստանալ ճշգրիտ նախահաշիվ անվճար',
  calc_again: '↻ Հաշվել կրկին',
  calc_disclaimer:
    '<i>Շուկայական կողմնорошիչ բաց գնացուցակներից, ոչ թե օֆերտա կամ անձնական նախահաշիվ։ Վերջնական արժեքը անհատական է։ Կան հակացուցումներ, անհրաժեշտ է մասնագետի խորհրդատվություն։</i>',
  from: 'սկսած',

  lead_intro:
    '📩 Թողեք հայտ — համակարգողը կկապվի Ձեզ հետ, անվճար կընտրի կլինիկա և 1 օրում կհաշվի «բանալին ձեռքին» նախահաշիվը։ Սա ոչնչի չի պարտավորեցնում։\n\nԻ՞նչն է Ձեզ հետաքրքրում։',
  lead_other: '🤔 Դեռ չեմ որոշել',
  lead_ask_name: 'Ինչպե՞ս դիմել Ձեզ։ Գրեք Ձեր անունը։',
  lead_ask_phone:
    'Շնорհակալություն, {name}! Թողեք հեռախоսահամар — սեղմեք ստորև կոճակը՝ կիսվելու համար, կամ գրեք ձեռքով (օրինակ՝ +374 00 000-000)։',
  lead_share_phone: '📞 Կիսվել հեռախոսահամարով',
  lead_ask_comment: 'Ուզո՞ւմ եք ինչ-որ բան ավելացնել։ Նկարագրեք իրավիճակը կամ զանգի հարմար ժամը։ Կարող եք բաց թողնել։',
  lead_skip: 'Բաց թողնել',
  lead_confirm:
    'Ստուգեք հայտը՝\n\n' +
    '<b>Ուղղություն՝</b> {procedure}\n' +
    '<b>Անուն՝</b> {name}\n' +
    '<b>Հեռախоս՝</b> {phone}\n' +
    '<b>Մեկնաբանություն՝</b> {comment}\n\n' +
    'Ամեն ինչ ճի՞շտ է։',
  lead_submit: '✅ Ուղարկել հայտը',
  lead_edit: '✏️ Լրացնել նորից',
  lead_cancel: '✖️ Չեղարկել',
  lead_submitted:
    '🎉 Շնорհակալություն, {name}! Հայտը ընդունված է։\n\n' +
    'MedBridge Tourism-ի համակարգողը շուտով կկապվի Ձեզ հետ։{contact}\n\n' +
    'Բարի օր և ամուր առողջություն! 💙',
  lead_submitted_contact: ' Եթե հարմар է — գրեք ուղիղ՝ {contact}։',
  lead_error:
    '⚠️ Չհաջողվեց ավտоմատ ուղարկել հայտը, բայց Ձեր տվյալները պահպանեցինք։\nԽնդրում ենք գրել համակарգողին ուղիղ՝ {contact}',
  lead_error_nocontact:
    '⚠️ Չհաջողվեց ավտоմատ ուղарկել հայտը, բայց Ձեր տվյալները պահպանեցինք և շուտով կկապվենք։',
  lead_invalid_name: 'Խնդրում ենք գրել անունը տեքստով (նվազագույնը 2 տառ)։',
  lead_invalid_phone:
    'Սա հեռախоսահամарի նման չէ։ Գրեք +374 00 000-000 ձևաչափով կամ սեղմեք «Կիսվել հեռախоսահамаром»։',
  lead_cancelled: 'Հայտը չեղарկվեց։ Եթե մտափոխվեք — ես կապի մեջ եմ 👇',
  no_comment: '—',

  contact_text: 'MedBridge Tourism-ի անձնական համակարգողը կապի մեջ է 24/7՝\n\n{links}\n\nԳրեք Ձեզ հարմар ուղիով — կօգնենք։',
  contact_none: 'Համակарգողը շուտով կկապվի Ձեզ հետ։ Թողեք հայտ մենյուից 👇',
  contact_tg: '💬 Telegram՝ @{username}',
  contact_wa: '🟢 WhatsApp՝ {link}',
  contact_phone: '📞 Հեռախоս՝ {phone}',

  guide_text:
    '📕 <b>Անվճар ուղեցույց «Բուժում Հայաստանում բանալին ձեռքին»</b> — ինչպես ընտրել կլինիկա, ինչ է ներառում նախահаշիվը և ինչպես խնայել առանց որակ կորցնելու։\n\n{link}\n\nՈւզո՞ւմ եք, որ համակарգողը անձամբ ուսումնասիրի Ձեր դեպքը։ Թողեք հայտ 👇',
  guide_none: 'Ուղեցույցը շուտով հասանելի կլինի։ Իսկ առայժմ թողեք հայտ — համակарգողը կպատասխանի բոլոր հարցերին 👇',
  guide_open: '📥 Բացել ուղեցույցը',
};

const STR = { ru, en, hy };

/** Translate a key with optional {placeholder} interpolation. */
export function t(lang, key, vars = {}) {
  const dict = STR[lang] || STR.ru;
  let s = dict[key] ?? STR.ru[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{${k}}`).join(String(v));
  }
  return s;
}

/** Escape a user-supplied string for safe inclusion in HTML-parsed messages. */
export function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
