import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

class Network extends WardenStream {
  constructor() {
    super('Network');
  }

  onLeftStream(chunk: ResponseChunk, encoding: string, callback: TransformCallback): void {
    callback();
  }

  onRightStream(chunk: RequestChunk, encoding: string, callback: TransformCallback): void {
    setTimeout(() => {
      this.leftStream.push({
        ...chunk,
        data: Math.random()
      });
    }, 200);
    callback();
  }
}

export {
  Network
};
