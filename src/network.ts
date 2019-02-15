import {RequestChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

class Network extends WardenStream {
  constructor() {
    super('Network');
  }

  onLeftStream(chunk: RequestChunk, encoding: string, callback: TransformCallback): void {
    callback();
  }

  onRightStream(chunk: RequestChunk, encoding: string, callback: TransformCallback): void {
    this.leftStream.push(chunk);
    callback();
  }
}

export {
  Network
};
