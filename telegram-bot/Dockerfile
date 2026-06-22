FROM node:20-alpine

WORKDIR /app

# Install production deps first for better layer caching.
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

# Long-polling worker — no exposed port needed.
CMD ["node", "src/bot.js"]
