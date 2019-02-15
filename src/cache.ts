import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

interface CachePlugin {
  get(key: string): any;

  set(key: string, value: string): any;
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

  onLeftStream(chunk: CacheResponse, encoding: string, callback: TransformCallback): void {
    if (!chunk.cacheHit) {
      this.storage.set(chunk.key, chunk.data);
    }
    callback(undefined, chunk);
  }

  onRightStream(chunk: RequestChunk, encoding: string, callback: TransformCallback): void {
    const response = this.storage.get(chunk.key);
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
