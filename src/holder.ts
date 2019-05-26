import {NextHandler, RequestChunk, ResponseChunk, Streamer} from "./streamer";
import {StreamType} from "./stream-factory";


class Holder extends Streamer {
  private holdQueue: { [key: string]: RequestChunk[] | null } = {};

  constructor() {
    super(StreamType.HOLDER);
  }

  onResponse(chunk: ResponseChunk, next: NextHandler) {
    const holdQueue = this.holdQueue[chunk.key];

    if (holdQueue) {
      holdQueue.forEach(holdChunk => {
        this.respond({
          ...chunk,
          id: holdChunk.id,
          cb: holdChunk.cb,
        });
      });

      delete this.holdQueue[chunk.key];
    } else {
      next(chunk);
    }
  }

  onRequest(chunk: RequestChunk, next: NextHandler) {
    const holdQueue = this.holdQueue[chunk.key];

    if (holdQueue) {
      holdQueue.push(chunk);
    } else {
      this.holdQueue[chunk.key] = [chunk];
      next(chunk);
    }
  }
}

export {
  Holder
};
