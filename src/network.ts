import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";
import * as request from "request";

class Network extends WardenStream {
  constructor() {
    super('Network');
  }

  onResponseStream(chunk: ResponseChunk, callback: TransformCallback): void {
    callback(undefined, chunk);
  }

  onRequestStream(chunk: RequestChunk, callback: TransformCallback): void {
    request[chunk.requestOptions.method](chunk.requestOptions.url, (error, response, data) => {
      this.pushResponse({
        key: chunk.key,
        cb: chunk.cb,
        data,
        error
      });
    });
    callback(undefined, null);
  }
}

export {
  Network
};
