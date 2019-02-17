import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

interface HolderConfiguration {

}

class Holder extends WardenStream {
  private holdQueue: { [key: string]: ResponseChunk[] | null } = {};

  constructor() {
    super('Holder');
  }

  onResponseStream(chunk: ResponseChunk, callback: TransformCallback): void {
    const holdQueue = this.holdQueue[chunk.key];
    if (holdQueue && Array.isArray(holdQueue)) {
      holdQueue.forEach(holdChunk => {
        this.pushResponse({
          ...holdChunk,
          data: chunk.data
        });
      });
      this.holdQueue[chunk.key] = null;
      callback(undefined, null);
    }
  }

  onRequestStream(chunk: RequestChunk, callback: TransformCallback): void {
    const holdQueue = this.holdQueue[chunk.key];
    const holdChunk = {
      key: chunk.key,
      cb: chunk.cb,
    };

    if (holdQueue && Array.isArray(holdQueue)) {
      holdQueue.push(holdChunk);
      callback(undefined, null);
    } else {
      this.holdQueue[chunk.key] = [holdChunk];
      callback(undefined, chunk);
    }
  }
}

export {
  HolderConfiguration,
  Holder
};
