import {TransformCallback} from "stream";
import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";


class StreamHead extends WardenStream {
  constructor() {
    super('Head', true);
  }

  onLeftStream(chunk: ResponseChunk, callback: TransformCallback): void {
    callback(undefined, chunk);
  }

  onRightStream(chunk: RequestChunk, callback: TransformCallback): void {
  }
}

export {
  StreamHead
};
