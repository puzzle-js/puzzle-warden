export abstract class CachePlugin {
  abstract get(key: string): null | string;
  abstract set(set: string, value: string): void;
}
