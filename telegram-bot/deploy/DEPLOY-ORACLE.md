# Деплой бота на Oracle Cloud (бесплатно навсегда)

Бот работает на long polling — входящие порты не нужны, поэтому Oracle Free VM
подходит идеально. Ниже — полный путь.

## Фаза 1 — аккаунт и виртуальная машина

1. Регистрация: **https://www.oracle.com/cloud/free/** → *Start for free*.
   Нужна почта и карта для верификации личности (деньги **не списываются**,
   это Always Free). Выберите регион поближе (например, *Germany Central (Frankfurt)*).
2. В консоли: **☰ Menu → Compute → Instances → Create Instance**.
3. Настройки инстанса:
   - **Image:** Canonical **Ubuntu 22.04**.
   - **Shape:** *Change shape* → **Ample/Specialty? нет** → выберите **VM.Standard.E2.1.Micro**
     (помечен «Always Free-eligible»). Если хотите мощнее и есть доступность —
     **VM.Standard.A1.Flex** (ARM, тоже Always Free), 1 OCPU / 6 GB достаточно.
   - **SSH keys:** *Generate a key pair for me* → **скачайте private key** (`.key`)
     и сохраните — без него не зайти. (Или загрузите свой публичный ключ.)
   - Остальное по умолчанию → **Create**.
4. Дождитесь статуса **Running** и скопируйте **Public IP address**.

## Фаза 2 — подключение по SSH (с Windows)

В PowerShell (замените путь к ключу и IP):
```powershell
icacls "C:\путь\к\ssh-key.key" /inheritance:r /grant:r "$($env:USERNAME):(R)"
ssh -i "C:\путь\к\ssh-key.key" ubuntu@ВАШ_PUBLIC_IP
```
При первом подключении ответьте `yes`. Вы окажетесь в консоли сервера.

## Фаза 3 — установка бота

На сервере выполните установочный скрипт:
```bash
curl -fsSL https://raw.githubusercontent.com/martirosyansss/lumena/main/telegram-bot/deploy/oracle-setup.sh | bash
```
Он поставит Node 20, pm2, склонирует репозиторий и установит зависимости.

## Фаза 4 — секреты и запуск

1. Создайте `.env` (значения даст ассистент):
   ```bash
   nano ~/lumena/telegram-bot/.env
   ```
   Вставьте блок переменных, затем `Ctrl+O`, `Enter`, `Ctrl+X`.
2. Запустите бота под pm2 (автостарт после перезагрузки):
   ```bash
   cd ~/lumena/telegram-bot
   pm2 start src/bot.js --name medbridge-bot
   pm2 save
   pm2 startup systemd -u $USER --hp $HOME   # выполните sudo-строку, которую он напечатает
   ```
3. Проверка:
   ```bash
   pm2 logs medbridge-bot --lines 20      # ждём: @MedBridgeTourism_bot is up
   pm2 status
   ```

## Обновление кода в будущем
```bash
cd ~/lumena && git pull
cd telegram-bot && npm ci --omit=dev && pm2 restart medbridge-bot
```

## Важно
- Запускайте **только один** экземпляр на токен (иначе `409 Conflict`).
  Перед запуском на сервере остановите локальную копию.
- `.env` на сервере — единственное место с секретами; в git он не попадает.
