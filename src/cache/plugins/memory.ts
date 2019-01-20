import {CachePlugin} from "./cache-plugin";

class MemoryCache extends CachePlugin {
  cache: { [key: string]: string } = {};

  get(key: string): string | null {
    return this.cache[key];
  }

  set(key: string, value: string): void {
    this.cache[key] = value;
  }
}

export {
  MemoryCache
}
