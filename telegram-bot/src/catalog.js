// Treatment catalog and price benchmarks.
// Ported 1:1 from the website calculator (index.html) so the bot and the site
// always quote identical figures. All amounts are RUB market benchmarks
// (1 USD ≈ 85 ₽). Money words stay in Russian on purpose — these are
// Russian-market reference prices regardless of the UI language.

/** Pick a localized field: accepts a string or {ru,en,hy}. */
export function L(field, lang) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.ru || '';
}

/** Format a RUB amount like the site: "34 тыс ₽" / "1,2 млн ₽". */
export function fmt(n) {
  if (n >= 1000000) {
    const m = n / 1000000;
    return (m % 1 ? m.toFixed(1) : m.toFixed(0)).replace('.', ',') + ' млн ₽';
  }
  return Math.round(n / 1000) + ' тыс ₽';
}

/**
 * Build a price range. Returns { text, isFrom } so callers can localize the
 * "from"/"от" prefix. Mirrors the site `range()` function.
 */
export function priceRange(a, b, from) {
  if (from || a === b) return { text: fmt(a), isFrom: true };
  if (a < 1000000 && b < 1000000) {
    return { text: Math.round(a / 1000) + '–' + Math.round(b / 1000) + ' тыс ₽', isFrom: false };
  }
  return { text: fmt(a) + '–' + fmt(b), isFrom: false };
}

// Treatment directions and procedures (calculator data).
export const DATA = {
  dental: {
    key: 'dental',
    label: { ru: 'Стоматология', en: 'Dentistry', hy: 'Ստոմատոլոգիա' },
    procs: [
      {
        id: 'implant',
        label: { ru: 'Имплант + коронка', en: 'Implant + crown', hy: 'Իմպլանտ + պսակ' },
        unit: { ru: 'единиц', en: 'units', hy: 'միավոր' },
        qty: true, mos: [60000, 110000], yer: [34000, 60000],
        save: { ru: 'экономия 35–55%', en: 'save 35–55%', hy: 'խնայողություն 35–55%' },
      },
      {
        id: 'veneer',
        label: { ru: 'Винир E-max', en: 'E-max veneer', hy: 'E-max երեսպատում' },
        unit: { ru: 'единиц', en: 'units', hy: 'միավոր' },
        qty: true, mos: [28000, 85000], yer: [21000, 30000],
        save: { ru: 'экономия до 50%', en: 'save up to 50%', hy: 'խնայողություն մինչև 50%' },
      },
      {
        id: 'allon',
        label: { ru: 'All-on-4 / All-on-6', en: 'All-on-4 / All-on-6', hy: 'All-on-4 / All-on-6' },
        custom: true,
      },
    ],
  },

  plastic: {
    key: 'plastic',
    label: { ru: 'Пластическая хирургия', en: 'Plastic surgery', hy: 'Պլաստիկ վիրաբուժություն' },
    procs: [
      {
        id: 'rhino',
        label: { ru: 'Ринопластика', en: 'Rhinoplasty', hy: 'Ռինոպլաստիկա' },
        from: true, mos: [480000, 480000], yer: [170000, 170000],
        save: { ru: 'экономия до 60%', en: 'save up to 60%', hy: 'խնայողություն մինչև 60%' },
      },
      {
        id: 'abdomino',
        label: { ru: 'Абдоминопластика', en: 'Abdominoplasty', hy: 'Աբդոմինոպլաստիկա' },
        from: true, mos: [650000, 650000], yer: [300000, 300000],
        save: { ru: 'экономия 50–55%', en: 'save 50–55%', hy: 'խնайողություն 50–55%' },
      },
      {
        id: 'plother',
        label: { ru: 'Другая операция', en: 'Other procedure', hy: 'Այլ վիրահատություն' },
        custom: true,
      },
    ],
  },

  checkup: {
    key: 'checkup',
    label: { ru: 'Чек-ап и диагностика', en: 'Check-up & diagnostics', hy: 'Չեկ-ափ և ախտորոշում' },
    procs: [
      {
        id: 'ext',
        label: { ru: 'Расширенный чек-ап', en: 'Extended check-up', hy: 'Ընդլայնված չեկ-ափ' },
        mos: [45000, 100000], yer: [13000, 33000],
        save: { ru: 'экономия 50–70%', en: 'save 50–70%', hy: 'խնайողություն 50–70%' },
      },
    ],
  },

  surgery: {
    key: 'surgery',
    label: { ru: 'Хирургия', en: 'Surgery', hy: 'Վիրաբուժություն' },
    procs: [
      {
        id: 'joint',
        label: { ru: 'Эндопротезирование сустава', en: 'Joint replacement', hy: 'Հոդի էնդոպրոթեզավորում' },
        mos: [350000, 600000], yer: [380000, 470000],
        save: {
          ru: 'итог зависит от бренда протеза',
          en: 'final price depends on the prosthesis brand',
          hy: 'վերջնական գինը կախված է պրոթեզի բրենդից',
        },
      },
      {
        id: 'surgother',
        label: { ru: 'Другая операция', en: 'Other procedure', hy: 'Այլ վիրահատություն' },
        custom: true,
      },
    ],
  },

  repro: {
    key: 'repro',
    label: { ru: 'Репродукция / ЭКО', en: 'Reproduction / IVF', hy: 'Վերարտադրողականություն / ԷՔՕ' },
    procs: [
      {
        id: 'reprocustom',
        label: {
          ru: 'ЭКО · суррогатное материнство · донорство',
          en: 'IVF · surrogacy · donor programs',
          hy: 'ԷՔՕ · սուրոգատ մայրություն · դոնорություն',
        },
        custom: true,
      },
    ],
  },
};

export const ORDER = ['dental', 'plastic', 'checkup', 'surgery', 'repro'];

/** Flat list of top-level directions for menus and lead capture. */
export const DIRECTIONS = ORDER.map((key) => ({ key, label: DATA[key].label }));

/** Look up a direction + procedure pair, returns nulls if not found. */
export function findProc(dirKey, procId) {
  const dir = DATA[dirKey];
  if (!dir) return { dir: null, proc: null };
  const proc = dir.procs.find((p) => p.id === procId) || null;
  return { dir, proc };
}

// Savings benchmark table (shown as text in chat — Telegram has no real tables).
export const SAVINGS = [
  {
    icon: '🦷',
    proc: { ru: 'Имплант + коронка (1 ед.)', en: 'Implant + crown (1 unit)', hy: 'Իմպլանտ + պսակ (1 միավոր)' },
    mos: '60–110 тыс ₽', yer: 'от ~34–60 тыс ₽', save: '−35–55%',
  },
  {
    icon: '😁',
    proc: { ru: 'Винир E-max (1 ед.)', en: 'E-max veneer (1 unit)', hy: 'E-max երեսպատում (1 միավոր)' },
    mos: '28–85 тыс ₽', yer: 'от ~21–30 тыс ₽', save: '−до 50%',
  },
  {
    icon: '👃',
    proc: { ru: 'Ринопластика', en: 'Rhinoplasty', hy: 'Ռինոպլաստիկա' },
    mos: 'от ~480 тыс ₽', yer: 'от ~170 тыс ₽', save: '−до 60%',
  },
  {
    icon: '🩹',
    proc: { ru: 'Абдоминопластика', en: 'Abdominoplasty', hy: 'Աբդոմինոպլаստիկա' },
    mos: 'от ~650 тыс ₽', yer: 'от ~300 тыс ₽', save: '−50–55%',
  },
  {
    icon: '🩺',
    proc: { ru: 'Расширенный чек-ап', en: 'Extended check-up', hy: 'Ընդլайնված չեկ-ափ' },
    mos: '45–100 тыс ₽', yer: 'от ~13–33 тыс ₽', save: '−50–70%',
  },
  {
    icon: '🦵',
    proc: { ru: 'Эндопротезирование сустава', en: 'Joint replacement', hy: 'Հոդի էնդոպրоթեզավորում' },
    mos: 'от ~350–600 тыс ₽', yer: 'от ~380–470 тыс ₽', save: '«под ключ»',
  },
];
