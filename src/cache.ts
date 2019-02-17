import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";
import {StreamType} from "./stream-factory";

interface CachePlugin {
  get<T>(key: string): any;

  set(key: string, value: string): Promise<void> | void;
}

const enum CACHING_STRATEGY {
  CacheThenNetwork = 'cacheThenNetwork'
}

class Cache extends WardenStream {
  private storage: CachePlugin;
  private ms: number;

  constructor(plugin: CachePlugin, ms: number) {
    super(StreamType.CACHE);

    this.ms = ms;
    this.storage = plugin;
  }

  async onResponse(chunk: ResponseChunk, callback: TransformCallback): Promise<void> {
    if (!chunk.cacheHit) {
      await this.storage.set(chunk.key, chunk.data);
    }
    callback(undefined, chunk);
  }

  async onRequest(chunk: RequestChunk, callback: TransformCallback): Promise<void> {
    const response = await this.storage.get(chunk.key);
    if (response) {
      this.respond({
        ...chunk,
        data: response,
        cacheHit: true
      });
      callback(undefined, null);
    } else {
      callback(undefined, chunk);
    }
  }
}

export {
  CACHING_STRATEGY,
  Cache,
  CachePlugin
};
