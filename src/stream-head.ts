import {TransformCallback} from "stream";
import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {RequestCallback} from "request";
import {RequestOptions} from "./request-manager";


class StreamHead extends WardenStream {
  constructor() {
    super('Head', true);
  }

  onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
    chunk.cb(
      chunk.error,
      {
        ...chunk,
      } as any,
      chunk.data
    );

    callback(undefined, null);
  }

  onRequest(chunk: RequestChunk, callback: TransformCallback): void {
    throw new Error('Stream head cant be piped');
  }

  start(key: string, requestOptions: RequestOptions, cb: RequestCallback){
    return this.request({
      key,
      requestOptions,
      cb
    });
  }
}

export {
  StreamHead
};
