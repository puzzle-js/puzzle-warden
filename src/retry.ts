import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

interface RetryDecoratedResponse extends ResponseChunk {
    retryCount: number;
}

interface RetryDecoratedRequest extends RequestChunk {
    retryCount: number;
}

class Retry extends WardenStream {
    retryLimit: number;

    constructor(retryLimit: number) {
        super('Retry');

        this.retryLimit = retryLimit;
    }

    async onResponse(chunk: RetryDecoratedResponse, callback: TransformCallback): Promise<void> {
        if (chunk.error && chunk.retryCount <= this.retryLimit) {
            this.request<RetryDecoratedRequest>({
                ...chunk,
                retryCount: chunk.retryCount + 1
            });
            callback(undefined, null);
        } else {
            callback(undefined, chunk);
        }
    }

    async onRequest(chunk: RetryDecoratedRequest, callback: TransformCallback): Promise<void> {
        callback(null, {
            ...chunk,
            retryCount: 0
        } as RequestChunk);
    }
}

export {
    Retry
};