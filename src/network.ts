import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";
import * as request from "request";

class Network extends WardenStream {
  constructor() {
    super('Network');
  }

  onLeftStream(chunk: ResponseChunk, callback: TransformCallback): void {
    callback(undefined, chunk);
  }

  onRightStream(chunk: RequestChunk, callback: TransformCallback): void {
    request[chunk.requestOptions.method](chunk.requestOptions.url, (err, response, body) => {
      this.leftStream.push({
        ...chunk,
        data: body
      });
    });
    callback(undefined, null);
  }
}

export {
  Network
};
