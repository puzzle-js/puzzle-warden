import {NextHandler, RequestChunk, ResponseChunk, Streamer} from "./streamer";
import {TransformCallback} from "stream";
import {StreamType} from "./stream-factory";
import {CachePlugin} from "./cache-factory";
import request from "request";

interface CacheDecoratedResponse extends ResponseChunk {
  cacheHit: boolean;
}

interface CacheDecoratedRequest extends RequestChunk {
  cacheHit: boolean;
}

class CacheThenNetwork extends Streamer {
  private readonly storage: CachePlugin;
  private readonly ms?: number;
  private readonly cacheWithCookie: boolean;

  constructor(plugin: CachePlugin, cacheWithCookie = false, ms?: number) {
    super(StreamType.CACHE);

    this.ms = ms; 
    this.cacheWithCookie = cacheWithCookie;
    this.storage = plugin;
  }

  async onResponse(chunk: CacheDecoratedResponse, next: NextHandler): Promise<void> {
    if (!chunk.cacheHit && !chunk.error && chunk.response) {
      if (chunk.response.headers["set-cookie"] && !this.cacheWithCookie) {
        console.warn('Detected dangerous response with set-cookie header, not caching', chunk.key);
      } else {
        await this.storage.set(chunk.key, {
          headers: chunk.response.headers,
          statusCode: chunk.response.statusCode,
          body: chunk.response.body
        }, this.ms);
      }
    }

    next(chunk);
  }

  async onRequest(chunk: CacheDecoratedRequest, next: NextHandler): Promise<void> {
    const cachedData = await this.storage.get(chunk.key) as request.Response;

    if (cachedData) {
      this.respond<CacheDecoratedResponse>({
        ...chunk,
        response: cachedData,
        cacheHit: true
      });
    } else {
      next(chunk);
    }
  }
}

export {
  CacheThenNetwork
};
