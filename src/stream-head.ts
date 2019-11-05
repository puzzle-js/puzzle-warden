import {NextHandler, ResponseChunk, Streamer} from "./streamer";


class StreamHead extends Streamer {
  constructor() {
    super('head');
  }

  onResponse(chunk: ResponseChunk, next: NextHandler): void {
    chunk.cb(
      chunk.error,
      chunk.response,
      chunk.response ? chunk.response.body : undefined
    );
  }
}

export {
  StreamHead
};
