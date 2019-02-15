import {RequestChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

interface CachePlugin {
  get(key: string): any;

  set(key: string, value: string): any;
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

  onLeftStream(chunk: RequestChunk, encoding: string, callback: TransformCallback): void {
    callback(undefined, chunk);
  }

  onRightStream(chunk: RequestChunk, encoding: string, callback: TransformCallback): void {
    callback(undefined, chunk);
  }
}

export {
  CACHING_STRATEGY,
  Cache,
  CachePlugin
};
