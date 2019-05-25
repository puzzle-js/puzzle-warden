import {NextHandler, ResponseChunk, Streamer} from "./streamer";
import * as request from "request";


class StreamHead extends Streamer {
  constructor() {
    super('Head');
  }

  onResponse(chunk: ResponseChunk, next: NextHandler): void {
    chunk.cb(
      chunk.error,
      chunk.response as request.Response,
      chunk.response ? chunk.response.body : undefined
    );
  }
}

export {
  StreamHead
};
