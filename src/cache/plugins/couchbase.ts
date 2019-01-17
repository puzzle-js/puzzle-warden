import {CachePlugin} from "./cache-plugin";

export class CouchbaseCache extends CachePlugin {
  get(key: string): string | null {
    return '';
  }

  set(set: string): void {

  }
}
