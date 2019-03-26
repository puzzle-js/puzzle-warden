import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";
import {StreamType} from "./stream-factory";
import {RequestWrapper} from "./request-wrapper";

class Network extends WardenStream {
  private requestWrapper: RequestWrapper;

  constructor(
    requestWrapper: RequestWrapper
  ) {
    super(StreamType.NETWORK);

    this.requestWrapper = requestWrapper;
  }

  onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
    callback(undefined, chunk);
  }

  onRequest(chunk: RequestChunk, callback: TransformCallback): void {
    this.requestWrapper.request[chunk.requestOptions.method](chunk.requestOptions, (error, response) => {
      this.respond({
        key: chunk.key,
        cb: chunk.cb,
        response,
        error
      });
    });
    callback(undefined, null);
  }
}

export {
  Network
};
