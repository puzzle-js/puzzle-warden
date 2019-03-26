import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";
import {StreamType} from "./stream-factory";
import {CachePlugin} from "./cache-factory";
import request from "request";


class CacheThenNetwork extends WardenStream {
  private readonly storage: CachePlugin;
  private readonly ms?: number;

  constructor(plugin: CachePlugin, ms?: number) {
    super(StreamType.CACHE);

    this.ms = ms;
    this.storage = plugin;
  }

  async onResponse(chunk: ResponseChunk, callback: TransformCallback): Promise<void> {
    if (!chunk.cacheHit && !chunk.error && chunk.response) {
      await this.storage.set(chunk.key, chunk.response, this.ms);
    }

    callback(undefined, chunk);
  }

  async onRequest(chunk: RequestChunk, callback: TransformCallback): Promise<void> {
    const cachedData = await this.storage.get(chunk.key) as request.Response;

    if (cachedData) {
      this.respond({
        key: chunk.key,
        cb: chunk.cb,
        response: cachedData,
        cacheHit: true
      });
      callback(undefined, null);
    } else {
      callback(undefined, chunk);
    }
  }
}

export {
  CacheThenNetwork
};
