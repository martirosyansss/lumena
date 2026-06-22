import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Minimal file-backed session store for Telegraf (no external services).
 * Keeps sessions in memory and persists the whole map to a JSON file with a
 * short debounce. Good for a low-volume lead bot; swap for Redis at scale.
 */
export function createFileSessionStore(file) {
  const filePath = path.resolve(process.cwd(), file);
  const map = new Map();
  let loaded = false;
  let timer = null;

  async function load() {
    if (loaded) return;
    loaded = true;
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      for (const [k, v] of Object.entries(JSON.parse(raw))) map.set(k, v);
    } catch {
      /* no session file yet */
    }
  }

  async function persist() {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(Object.fromEntries(map)), 'utf8');
    } catch (err) {
      console.error('[session] save failed:', err.message);
    }
  }

  function scheduleSave() {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      persist();
    }, 1000);
  }

  /** Cancel the pending debounce and write immediately (call on shutdown). */
  async function flush() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    await persist();
  }

  return {
    async get(name) {
      await load();
      return map.get(name);
    },
    async set(name, value) {
      await load();
      map.set(name, value);
      scheduleSave();
    },
    async delete(name) {
      await load();
      map.delete(name);
      scheduleSave();
    },
    flush,
  };
}
