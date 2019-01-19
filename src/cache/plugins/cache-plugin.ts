export abstract class CachePlugin {
  abstract get(key: string): string | null | Promise<string>;
  abstract set(key: string, value: any): Promise<void>;
}

export interface CouchbaseOptions {
  cluster: string;
  username: string;
  password: string;
  bucket: string;
}
