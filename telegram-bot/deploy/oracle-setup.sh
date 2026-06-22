#!/usr/bin/env bash
# MedBridge Tourism bot — installer for an Oracle Cloud (Ubuntu) Always-Free VM.
# Installs Node 20, git, pm2; clones the repo; installs bot deps.
# Run it on the VM:  bash oracle-setup.sh
# Then create telegram-bot/.env and start with pm2 (see DEPLOY-ORACLE.md).
set -euo pipefail

REPO_URL="https://github.com/martirosyansss/lumena.git"
APP_DIR="$HOME/lumena"
BOT_DIR="$APP_DIR/telegram-bot"

echo "==> apt update + base packages..."
sudo apt-get update -y
sudo apt-get install -y curl git ca-certificates

echo "==> Node.js 20..."
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/v//;s/\..*//')" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "    node $(node -v), npm $(npm -v)"

echo "==> pm2..."
sudo npm install -g pm2 >/dev/null 2>&1

echo "==> repo..."
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull --ff-only
else
  git clone --depth 1 "$REPO_URL" "$APP_DIR"
fi

echo "==> bot dependencies..."
cd "$BOT_DIR"
npm ci --omit=dev 2>/dev/null || npm install --omit=dev

echo ""
echo "============================================================"
echo " Base install done."
echo " 1) Create the env file:   nano $BOT_DIR/.env"
echo "    (paste the block the assistant gave you, Ctrl+O, Enter, Ctrl+X)"
echo " 2) Start the bot:"
echo "      cd $BOT_DIR"
echo "      pm2 start src/bot.js --name medbridge-bot"
echo "      pm2 save"
echo "      pm2 startup systemd -u \$USER --hp \$HOME   # run the sudo line it prints"
echo " 3) Logs:  pm2 logs medbridge-bot"
echo "============================================================"
