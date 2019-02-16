import {TransformCallback} from "stream";
import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {RequestCallback} from "request";
import {RequestOptions} from "./request-manager";


class StreamHead extends WardenStream {
  constructor() {
    super('Head', true);
  }

  onLeftStream(chunk: ResponseChunk, callback: TransformCallback): void {
    callback(undefined, chunk);
    chunk.cb(
      chunk.error,
      {
        ...chunk,
      } as any,
      chunk.data
    );
  }

  onRightStream(chunk: RequestChunk, callback: TransformCallback): void {
  }

  start(key: string, requestOptions: RequestOptions, cb: RequestCallback){
    this.rightStream.push({
      key,
      requestOptions,
      cb
    });
  }
}

export {
  StreamHead
};
