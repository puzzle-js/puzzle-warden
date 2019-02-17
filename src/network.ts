import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";
import * as request from "request";
import {StreamType} from "./stream-factory";

class Network extends WardenStream {
  constructor() {
    super(StreamType.NETWORK);
  }

  onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
    callback(undefined, chunk);
  }

  onRequest(chunk: RequestChunk, callback: TransformCallback): void {
    request[chunk.requestOptions.method](chunk.requestOptions.url, (error, response, data) => {
      this.respond({
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
