export abstract class CachePlugin {
  abstract get(key: string): string | null | Promise<string>;
  abstract set(key: string, value: string | object): void | Promise<void>;
}

export interface CouchbaseOptions {
  cluster: string;
  username: string;
  password: string;
  bucket: string;
}

export interface RedisOptions {
  port: number;
  host: string;
}
