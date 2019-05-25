import {NextHandler, ResponseChunk, Streamer} from "./streamer";
import {RequestCallback} from "request";
import {RequestOptions} from "./request-manager";


class StreamHead extends Streamer {
  constructor() {
    super('Head');
  }

  onResponse(chunk: ResponseChunk, next: NextHandler): void {
    chunk.cb(
      chunk.error,
      chunk.response as any,
      chunk.response ? chunk.response.body : undefined
    );
  }

  start(key: string, requestOptions: RequestOptions, cb: RequestCallback) {
    return this.request({
      key,
      requestOptions,
      cb: cb as unknown as RequestCallback
    });
  }
}

export {
  StreamHead
};
