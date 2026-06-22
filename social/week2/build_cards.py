# -*- coding: utf-8 -*-
"""MedBridge Tourism — сборка готовых карточек постов (неделя 2, спецвыпуск «Врачи»).
AI-фон + реальный портрет + текст брендовыми шрифтами + логотип. 1080x1350 (4:5)."""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ASSETS = os.path.join(ROOT, "assets")
W, H = 1080, 1350

# ---- бренд ----
TEAL  = (30, 95, 116)
NAVY  = (15, 46, 61)
AMBER = (244, 162, 76)
GOLD  = (232, 194, 122)
WARM  = (251, 248, 243)
GLOW  = (251, 234, 210)
WHITE = (255, 255, 255)

ONEST = os.path.join(HERE, ".fonts", "Onest.ttf")
GOLOS = os.path.join(HERE, ".fonts", "GolosText.ttf")
LOGO  = os.path.join(ASSETS, "medbridge-logo-mark.png")

def font(path, size, weight=400):
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f

def cover(img, w, h):
    iw, ih = img.size
    s = max(w / iw, h / ih)
    img = img.resize((int(iw * s) + 1, int(ih * s) + 1), Image.LANCZOS)
    iw, ih = img.size
    return img.crop(((iw - w) // 2, (ih - h) // 2, (iw - w) // 2 + w, (ih - h) // 2 + h))

def vgrad(w, h, top_rgba, bot_rgba):
    """Вертикальный градиент (RGBA) — для скрима под текст."""
    base = Image.new("RGBA", (w, h))
    px = base.load()
    for y in range(h):
        t = y / max(1, h - 1)
        r = int(top_rgba[0] + (bot_rgba[0] - top_rgba[0]) * t)
        g = int(top_rgba[1] + (bot_rgba[1] - top_rgba[1]) * t)
        b = int(top_rgba[2] + (bot_rgba[2] - top_rgba[2]) * t)
        a = int(top_rgba[3] + (bot_rgba[3] - top_rgba[3]) * t)
        for x in range(w):
            px[x, y] = (r, g, b, a)
    return base

def circle(path, size, ring=GOLD, ring_w=10, bias=0.5, xbias=0.5):
    img = Image.open(path).convert("RGB")
    w, h = img.size
    s = min(w, h)
    left = int((w - s) * xbias)
    top = int((h - s) * bias)
    img = img.crop((left, top, left + s, top + s)).resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    r = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(r).ellipse((ring_w // 2, ring_w // 2, size - ring_w // 2 - 1, size - ring_w // 2 - 1),
                              outline=ring + (255,), width=ring_w)
    return Image.alpha_composite(out, r)

def wrap(draw, text, fnt, maxw):
    out = []
    for para in text.split("\n"):
        words = para.split(" ")
        line = ""
        for wd in words:
            test = (line + " " + wd).strip()
            if draw.textlength(test, font=fnt) <= maxw or not line:
                line = test
            else:
                out.append(line); line = wd
        out.append(line)
    return out

def draw_text(draw, xy, lines, fnt, fill, lh=1.18, anchor="la", center_w=None):
    x, y = xy
    asc, desc = fnt.getmetrics()
    step = int((asc + desc) * lh)
    for ln in lines:
        if center_w is not None:
            tw = draw.textlength(ln, font=fnt)
            draw.text((x + (center_w - tw) / 2, y), ln, font=fnt, fill=fill)
        else:
            draw.text((x, y), ln, font=fnt, fill=fill, anchor=anchor)
        y += step
    return y

def logo_lockup(card, x, y, h=58, wordmark=True, color=WHITE):
    lg = Image.open(LOGO).convert("RGBA")
    s = h / lg.height
    lg = lg.resize((int(lg.width * s), h), Image.LANCZOS)
    card.alpha_composite(lg, (x, y))
    if wordmark:
        d = ImageDraw.Draw(card)
        f = font(ONEST, 30, 800)
        d.text((x + lg.width + 16, y + h // 2), "MedBridge Tourism", font=f, fill=color, anchor="lm")

def pill(draw, x, y, value, caption, fv, fc, pad=22, gap=6):
    vw = draw.textlength(value, font=fv)
    cw = draw.textlength(caption, font=fc)
    w = int(max(vw, cw)) + pad * 2
    va, vd = fv.getmetrics(); ca, cd = fc.getmetrics()
    h = va + vd + gap + ca + cd + pad
    draw.rounded_rectangle((x, y, x + w, y + h), radius=18, fill=(255, 255, 255, 28),
                           outline=GOLD + (160,), width=2)
    draw.text((x + w / 2, y + pad // 2 + va / 2), value, font=fv, fill=WARM, anchor="mm")
    draw.text((x + w / 2, y + pad // 2 + va + vd + gap + ca / 2), caption, font=fc, fill=GLOW, anchor="mm")
    return w, h

def base_card(bg_name):
    bg = cover(Image.open(os.path.join(HERE, bg_name)).convert("RGB"), W, H).convert("RGBA")
    return bg

def save(card, name):
    out = os.path.join(HERE, name)
    card.convert("RGB").save(out, quality=92)
    print("ok", name)

# ============================================================ CARD 1 — Ashot intro
def card1():
    c = base_card("01-ashot-bg.png")
    # лёгкое общее затемнение + сильный скрим снизу под текст
    c.alpha_composite(vgrad(W, H, (15, 46, 61, 30), (15, 46, 61, 60)))
    c.alpha_composite(vgrad(W, H, (15, 46, 61, 0), (15, 46, 61, 245)), (0, 0))
    p = circle(os.path.join(HERE, "01-ashot-portrait.jpg"), 430, bias=0.42, ring=GOLD, ring_w=10)
    c.alpha_composite(p, (W - 430 - 70, 120))
    d = ImageDraw.Draw(c)
    logo_lockup(c, 70, 70, 56)
    x = 70
    d.text((x, 690), "ВРАЧ-ПАРТНЁР MEDBRIDGE", font=font(GOLOS, 26, 600), fill=AMBER)
    y = draw_text(d, (x, 730), ["Dr. Ashot", "Harutyunyan"], font(ONEST, 88, 800), WHITE, lh=1.05)
    d.text((x, y + 8), "Пластический и челюстно-лицевой хирург", font=font(GOLOS, 32, 500), fill=WARM)
    d.text((x, y + 52), "Astghik Medical Center · Ереван", font=font(GOLOS, 28, 400), fill=GLOW)
    # пиллы
    py = 1120
    fx = font(ONEST, 40, 800); fc = font(GOLOS, 22, 500)
    px = x
    for val, cap in [("19+", "лет практики"), ("4000+", "операций"), ("RU·EN·HY", "языки")]:
        w, h = pill(d, px, py, val, cap, fx, fc); px += w + 18
    d.text((x, 1270), "Ринопластика · контур лица · эндоскопический лифтинг",
           font=font(GOLOS, 26, 500), fill=GLOW)
    save(c, "post-1-ashot.png")

# ============================================================ CARD 2 — Rhino results cover
def card2():
    c = base_card("02-rhino-results-bg.png")
    c.alpha_composite(vgrad(W, H, (15, 46, 61, 0), (15, 46, 61, 120)), (0, 0))
    d = ImageDraw.Draw(c)
    logo_lockup(c, 70, 70, 56)
    cx, cw = 70, W - 140
    d.text((W / 2, 470), "РЕАЛЬНЫЕ РАБОТЫ ВРАЧА-ПАРТНЁРА", font=font(GOLOS, 27, 600), fill=AMBER, anchor="mm")
    draw_text(d, (cx, 500), ["Ринопластика:", "до и после"], font(ONEST, 92, 800), WHITE, lh=1.05, center_w=cw)
    d.text((W / 2, 838), "Dr. Ashot Harutyunyan", font=font(ONEST, 40, 700), fill=GOLD, anchor="mm")
    d.text((W / 2, 893), "первичная · функциональная · реконструктивная", font=font(GOLOS, 28, 400), fill=GLOW, anchor="mm")
    # подсказка листать
    d.rounded_rectangle((W/2-150, 1140, W/2+150, 1140+64), radius=32, fill=AMBER+(255,))
    d.text((W/2, 1140+32), "Листайте  →", font=font(ONEST, 32, 700), fill=NAVY, anchor="mm")
    d.text((W / 2, 1285), "Результат индивидуален и не является гарантией.",
           font=font(GOLOS, 24, 400), fill=GLOW, anchor="mm")
    save(c, "post-2-rhino-cover.png")

# ============================================================ CARD 3 — Edgar intro
def card3():
    c = base_card("03-edgar-bg.png")
    p = circle(os.path.join(HERE, "03-edgar-portrait.jpg"), 470, bias=0.04, ring=GOLD, ring_w=10)
    c.alpha_composite(p, (W - 470 - 60, 110))
    # скрим снизу
    c.alpha_composite(vgrad(W, H, (15, 46, 61, 0), (15, 46, 61, 250)), (0, 0))
    d = ImageDraw.Draw(c)
    logo_lockup(c, 70, 70, 56, color=NAVY)  # фон вверху светлый
    x = 70
    d.text((x, 700), "ВРАЧ-ПАРТНЁР MEDBRIDGE", font=font(GOLOS, 26, 600), fill=AMBER)
    y = draw_text(d, (x, 740), ["Dr. Edgar", "Karapetyan"], font(ONEST, 88, 800), WHITE, lh=1.05)
    d.text((x, y + 8), "Челюстно-лицевой хирург · имплантология", font=font(GOLOS, 32, 500), fill=WARM)
    d.text((x, y + 52), "Slavmed Medical Center · Ереван", font=font(GOLOS, 28, 400), fill=GLOW)
    py = 1120
    fx = font(ONEST, 36, 800); fc = font(GOLOS, 22, 500)
    px = x
    for val, cap in [("25+", "лет практики"), ("Импланты", "All-on-4/6"), ("3D", "планирование")]:
        w, h = pill(d, px, py, val, cap, fx, fc); px += w + 18
    d.text((x, 1270), "Импланты · костная пластика · ортогнатика · ВНЧС",
           font=font(GOLOS, 26, 500), fill=GLOW)
    save(c, "post-3-edgar.png")

# ============================================================ CARD 4 — Implants All-on-4/6
def card4():
    c = base_card("04-implant-bg.png")
    c.alpha_composite(vgrad(W, H, (15, 46, 61, 90), (15, 46, 61, 60)))
    c.alpha_composite(vgrad(W, H, (15, 46, 61, 0), (15, 46, 61, 235)), (0, 0))
    d = ImageDraw.Draw(c)
    logo_lockup(c, 70, 70, 56)
    x = 70
    d.text((x, 700), "ИМПЛАНТАЦИЯ «ПОД КЛЮЧ»", font=font(GOLOS, 27, 600), fill=AMBER)
    draw_text(d, (x, 742), ["All-on-4 / 6:", "новые зубы", "за несколько дней"],
              font(ONEST, 76, 800), WHITE, lh=1.06)
    for i, t in enumerate(["3D-планирование и навигационные шаблоны",
                            "Несъёмный протез — иногда в день операции",
                            "Оперирует хирург с опытом 25+ лет"]):
        d.text((x + 36, 1058 + i * 46), t, font=font(GOLOS, 28, 500), fill=WARM)
        d.ellipse((x, 1066 + i * 46, x + 14, 1080 + i * 46), fill=AMBER + (255,))
    # бейдж Эдгара
    badge = circle(os.path.join(HERE, "04-edgar-portrait-alt.jpg"), 120, bias=0.2, ring=GOLD, ring_w=6)
    c.alpha_composite(badge, (W - 120 - 70, 1210))
    d.text((W - 70, 1340 - 4), "Dr. Edgar Karapetyan", font=font(GOLOS, 22, 500), fill=GLOW, anchor="rs")
    d.text((x, 1290), "Смету считаем бесплатно за 1 день", font=font(ONEST, 30, 700), fill=GOLD)
    save(c, "post-4-implants.png")

# ============================================================ CARD 5 — Why who operates
def card5():
    c = base_card("05-trust-care-bg.png")
    c.alpha_composite(vgrad(W, H, (15, 46, 61, 150), (15, 46, 61, 90)))
    c.alpha_composite(vgrad(W, H, (15, 46, 61, 0), (15, 46, 61, 220)), (0, 0))
    d = ImageDraw.Draw(c)
    logo_lockup(c, 70, 70, 56)
    cw = W - 140
    d.text((W / 2, 360), "ГЛАВНОЕ В МЕДТУРИЗМЕ", font=font(GOLOS, 27, 600), fill=AMBER, anchor="mm")
    draw_text(d, (70, 410), ["Оперирует", "не клиника —", "оперирует врач"],
              font(ONEST, 84, 800), WHITE, lh=1.06, center_w=cw)
    d.text((W / 2, 760), "Поэтому мы сначала отбираем врачей, а потом маршрут",
           font=font(GOLOS, 30, 500), fill=GLOW, anchor="mm")
    # два портрета
    pa = circle(os.path.join(HERE, "01-ashot-portrait.jpg"), 260, bias=0.42, ring=GOLD, ring_w=8)
    pe = circle(os.path.join(HERE, "03-edgar-portrait.jpg"), 260, bias=0.04, ring=GOLD, ring_w=8)
    c.alpha_composite(pa, (170, 880))
    c.alpha_composite(pe, (W - 260 - 170, 880))
    d.text((170 + 130, 1170), "Dr. Ashot", font=font(ONEST, 30, 700), fill=WHITE, anchor="mm")
    d.text((170 + 130, 1208), "пластика · ринопластика", font=font(GOLOS, 22, 400), fill=GLOW, anchor="mm")
    d.text((W - 170 - 130, 1170), "Dr. Edgar", font=font(ONEST, 30, 700), fill=WHITE, anchor="mm")
    d.text((W - 170 - 130, 1208), "импланты · ЧЛХ", font=font(GOLOS, 22, 400), fill=GLOW, anchor="mm")
    d.text((W / 2, 1290), "MedBridge Tourism — ваш проводник, а не клиника",
           font=font(GOLOS, 26, 500), fill=GLOW, anchor="mm")
    save(c, "post-5-trust.png")

if __name__ == "__main__":
    card1(); card2(); card3(); card4(); card5()
    print("DONE")
