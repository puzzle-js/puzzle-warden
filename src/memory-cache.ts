import {CachePlugin} from "./cache-factory";

type CacheEntry = {
  value: unknown;
  expire: number | null;
};

class MemoryCache implements CachePlugin {
  constructor() {
    this.invalidate = this.invalidate.bind(this);
    setInterval(this.invalidate, 60000);
  }

  cache: {
    [key: string]: CacheEntry
  } = {};

  async get<T>(key: string): Promise<T | null> {
    if (!this.cache[key]) return null;

    if (this.isExpired(this.cache[key])) {
      delete this.cache[key];
      return null;
    }

    return this.cache[key].value as T;
  }

  async set(key: string, value: unknown, ms?: number): Promise<void> {
    this.cache[key] = {
      value,
      expire: ms ? Date.now() + ms : null
    };
  }

  invalidate() {
    for (const key in this.cache) {
      if (this.isExpired(this.cache[key])) {
        delete this.cache[key];
      }
    }
  }

  private isExpired(cacheEntry: CacheEntry) {
    return cacheEntry.expire && cacheEntry.expire < Date.now();
  }
}

export {
  MemoryCache,
};
