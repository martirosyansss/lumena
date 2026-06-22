# Деплой бота (24/7)

Бот работает на long polling — нужен один постоянно запущенный воркер. Домен/порт
не требуются. Ниже — путь через **Railway** (проще всего), плюс альтернативы.

> ⚠️ Запускайте **только один** экземпляр на один `BOT_TOKEN`. Два поллера на один
> токен → ошибка `409 Conflict`. Перед деплоем убедитесь, что локальный
> `node src/bot.js` остановлен.

---

## Вариант A — Railway из GitHub (рекомендуется)

1. Зайдите на **https://railway.app** → войдите через GitHub.
2. **New Project → Deploy from GitHub repo** → выберите репозиторий `lumena`.
3. Откройте сервис → **Settings**:
   - **Root Directory:** `telegram-bot`
   - Билд пойдёт по `Dockerfile` (он уже в папке). Start command подхватится из `railway.json`.
4. Вкладка **Variables** → добавьте переменные окружения (значения — из вашего
   локального `.env`, в репозиторий они НЕ попадают):

   | Переменная | Обязательна |
   |---|---|
   | `BOT_TOKEN` | ✅ |
   | `MANAGER_CHAT_ID` | ✅ |
   | `SHEETS_WEBAPP_URL` | ✅ |
   | `SHEETS_SECRET` | ✅ |
   | `COORDINATOR_WHATSAPP` | — |
   | `COORDINATOR_PHONE` | — |
   | `COORDINATOR_USERNAME` | — |
   | `GUIDE_URL` | — |
   | `SITE_URL` | — |
   | `DEFAULT_LANG` | — |

5. **Deploy**. В логах должно появиться `@MedBridgeTourism_bot is up (long polling)`.
6. (Опц.) **Settings → Volumes**: примонтируйте том на `/app/data`, если хотите,
   чтобы локальный бэкап `data/leads.jsonl` и сессии переживали редеплой. Без тома
   эти файлы сбрасываются при каждом деплое — на доставку заявок это не влияет
   (они идут в Telegram и Google-таблицу), теряется лишь незавершённый диалог.

---

## Вариант B — Render

1. **https://render.com** → New → **Background Worker** → подключите репозиторий.
2. **Root Directory:** `telegram-bot`, Runtime: Docker (использует `Dockerfile`).
3. Добавьте те же переменные окружения, **Create**.

---

## Вариант C — VPS + pm2

```bash
git clone https://github.com/martirosyansss/lumena.git
cd lumena/telegram-bot
npm ci --omit=dev
cp .env.example .env   # и заполнить значениями
npm install -g pm2
pm2 start src/bot.js --name medbridge-bot
pm2 save && pm2 startup
```

---

## После деплоя

- Остановите локальный бот, чтобы не было `409 Conflict`.
- Проверьте: `/start` боту → пройти заявку → она должна прийти в группу и в таблицу.
- При обновлении кода (`git push`) Railway/Render передеплоят автоматически.
