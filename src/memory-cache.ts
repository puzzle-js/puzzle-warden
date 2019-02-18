import {CachePlugin} from "./cache-factory";


class MemoryCache implements CachePlugin {
  cache: { [key: string]: object } = {};

  get(key: string): object {
    return this.cache[key];
  }

  set(key: string, value: object): void {
    this.cache[key] = value;
  }
}

export {
  MemoryCache,
};
