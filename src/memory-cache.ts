import {CachePlugin} from "./cache-factory";


class MemoryCache implements CachePlugin {
  cache: {
    [key: string]: {
      value: unknown;
      expire: number | null;
    }
  } = {};

  async get<T>(key: string): Promise<T | null> {
    if (!this.cache[key]) return null;

    if (this.cache[key].expire && this.cache[key].expire! < Date.now()) {
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

  // todo Clear storage when expired with timer
}

export {
  MemoryCache,
};
