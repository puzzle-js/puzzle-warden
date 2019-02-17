import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";
import {StreamType} from "./stream-factory";

interface HolderConfiguration {

}

class Holder extends WardenStream {
  private holdQueue: { [key: string]: ResponseChunk[] | null } = {};

  constructor() {
    super(StreamType.HOLDER);
  }

  onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
    const holdQueue = this.holdQueue[chunk.key];
    if (holdQueue && Array.isArray(holdQueue)) {
      holdQueue.forEach(holdChunk => {
        this.respond({
          ...holdChunk,
          data: chunk.data
        });
      });
      this.holdQueue[chunk.key] = null;
      callback(undefined, null);
    }
  }

  onRequest(chunk: RequestChunk, callback: TransformCallback): void {
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
