import {CachePlugin} from "./cache";

class MemoryCache implements CachePlugin {
  cache: { [key: string]: string } = {};

  get<T>(key: string): T | null {
    return this.cache[key] as unknown as T;
  }

  set(key: string, value: string): void {
    this.cache[key] = value;
  }
}

export {
  MemoryCache,
};
