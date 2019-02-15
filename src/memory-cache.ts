import {CachePlugin} from "./cache";

class MemoryCache implements CachePlugin {
  cache: { [key: string]: string } = {};

  get(key: string): any  {
    return this.cache[key];
  }

  set(key: string, value: string): void {
    this.cache[key] = value;
  }
}

export {
  MemoryCache,
};
