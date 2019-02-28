import {CachePlugin} from "./cache-factory";


class MemoryCache implements CachePlugin {
  cache: { [key: string]: any } = {};

  get(key: string): any {
    return this.cache[key];
  }

  set(key: string, value: any ): void {
    this.cache[key] = value;
  }
}

export {
  MemoryCache,
};
