import {CachePlugin} from "./cache";

class MemoryCache implements CachePlugin {
  cache: { [key: string]: string } = {};

  get(key: string): any {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.cache[key]);
      }, 15);
    });
  }

  set(key: string, value: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.cache[key] = value;
        resolve();
      }, 3);
    });
  }
}

export {
  MemoryCache,
};
