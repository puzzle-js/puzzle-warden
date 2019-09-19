import {CachePlugin} from "./cache-factory";

type CacheEntry = {
  value: unknown;
  expire: number | null;
  timeout?: NodeJS.Timeout;
};

class MemoryCache implements CachePlugin {
  cache: {
    [key: string]: CacheEntry
  } = {};

  async get<T>(key: string): Promise<T | null> {
    if (!this.cache[key]) return null;
    return this.cache[key].value as T;
  }

  async set(key: string, value: unknown, ms?: number): Promise<void> {
    if (this.cache[key] && this.cache[key].timeout) {
      global.clearTimeout(this.cache[key].timeout as NodeJS.Timeout);
    }

    this.cache[key] = {
      value,
      expire: ms ? Date.now() + ms : null
    };

    if (ms) {
      this.cache[key].timeout = global.setTimeout(() => {
        delete this.cache[key];
      }, ms).unref();
    }
  }
}

export {
  MemoryCache,
};
