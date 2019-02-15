import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

class Holder extends WardenStream {
  private holdQueue: { [key: string]: RequestChunk[] | null } = {};

  constructor() {
    super('Holder');
  }

  onLeftStream(chunk: ResponseChunk, callback: TransformCallback): void {
    const holdQueue = this.holdQueue[chunk.key];
    if (holdQueue && Array.isArray(holdQueue)) {
      holdQueue.forEach(holdChunk => {
        this.leftStream.push({
          ...holdChunk,
          data: chunk.data
        });
      });
      this.holdQueue[chunk.key] = null;
      callback();
    }
  }

  onRightStream(chunk: RequestChunk, callback: TransformCallback): void {
    const holdQueue = this.holdQueue[chunk.key];
    if (holdQueue && Array.isArray(holdQueue)) {
      holdQueue.push(chunk);
      callback();
    } else {
      this.holdQueue[chunk.key] = [chunk];
      callback(undefined, chunk);
    }
  }
}

export {
  Holder
};
