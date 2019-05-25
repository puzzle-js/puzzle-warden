import {NextHandler, RequestChunk, Streamer} from "./streamer";
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

  onRequest(chunk: RequestChunk, next: NextHandler): void {
    this.requestWrapper.request[chunk.requestOptions.method](chunk.requestOptions, (error, response) => {
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
