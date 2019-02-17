import {TransformCallback} from "stream";
import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {RequestCallback} from "request";
import {RequestOptions} from "./request-manager";


class StreamHead extends WardenStream {
  constructor() {
    super('Head', true);
  }

  onResponseStream(chunk: ResponseChunk, callback: TransformCallback): void {
    chunk.cb(
      chunk.error,
      {
        ...chunk,
      } as any,
      chunk.data
    );

    callback(undefined, null);
  }

  onRequestStream(chunk: RequestChunk, callback: TransformCallback): void {
  }

  start(key: string, requestOptions: RequestOptions, cb: RequestCallback){
    return this.pushRequest({
      key,
      requestOptions,
      cb
    });
  }
}

export {
  StreamHead
};
