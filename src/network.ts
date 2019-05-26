import {RequestChunk, Streamer} from "./streamer";
import {StreamType} from "./stream-factory";
import {RequestWrapper} from "./request-wrapper";

class Network extends Streamer {
  private requestWrapper: RequestWrapper;

  constructor(
    requestWrapper: RequestWrapper
  ) {
    super(StreamType.NETWORK);

    this.requestWrapper = requestWrapper;
  }

  onRequest(chunk: RequestChunk): void {
    (this.requestWrapper.request as any)[chunk.requestOptions.method](chunk.requestOptions, (error: any, response: any) => {
      this.respond({
        ...chunk,
        response,
        error
      });
    });
  }
}

export {
  Network
};
