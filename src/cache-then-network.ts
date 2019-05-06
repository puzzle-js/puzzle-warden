import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
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

class CacheThenNetwork extends WardenStream {
    private readonly storage: CachePlugin;
    private readonly ms?: number;

    constructor(plugin: CachePlugin, ms?: number) {
        super(StreamType.CACHE);

        this.ms = ms;
        this.storage = plugin;
    }

    async onResponse(chunk: CacheDecoratedResponse, callback: TransformCallback): Promise<void> {
        if (!chunk.cacheHit && !chunk.error && chunk.response) {
            if (chunk.response.headers["set-cookie"]) {
                console.warn('Detected dangerous response with set-cookie header, not caching', chunk.key);
            } else {
                await this.storage.set(chunk.key, chunk.response, this.ms);
            }
        }

        callback(undefined, chunk);
    }

    async onRequest(chunk: CacheDecoratedRequest, callback: TransformCallback): Promise<void> {
        const cachedData = await this.storage.get(chunk.key) as request.Response;

        if (cachedData) {
            this.respond<CacheDecoratedResponse>({
                ...chunk,
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
