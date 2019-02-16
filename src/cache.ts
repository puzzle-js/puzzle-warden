import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

interface CachePlugin {
  get<T>(key: string): T | null;

  set(key: string, value: string): Promise<void> | void;
}

interface CacheResponse extends ResponseChunk {
  cacheHit?: boolean;
}

const enum CACHING_STRATEGY {
  CacheThenNetwork = 'cacheThenNetwork'
}

class Cache extends WardenStream {
  private storage: CachePlugin;
  private ms: number;

  constructor(plugin: CachePlugin, ms: number) {
    super('Cache');

    this.ms = ms;
    this.storage = plugin;
  }

  async onLeftStream(chunk: CacheResponse, callback: TransformCallback): Promise<void> {
    if (!chunk.cacheHit) {
      await this.storage.set(chunk.key, chunk.data);
    }
    callback(undefined, chunk);
  }

  async onRightStream(chunk: RequestChunk, callback: TransformCallback): Promise<void> {
    const response = await this.storage.get(chunk.key);
    if (response) {
      this.leftStream.push({
        ...chunk,
        data: response,
        cacheHit: true
      });
      callback();
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
