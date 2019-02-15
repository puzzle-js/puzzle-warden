import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

class Network extends WardenStream {
  constructor() {
    super('Network');
  }

  onLeftStream(chunk: ResponseChunk, callback: TransformCallback): void {
    callback();
  }

  onRightStream(chunk: RequestChunk, callback: TransformCallback): void {
    setTimeout(() => {
      this.leftStream.push({
        ...chunk,
        data: 'data'
      });
    }, 80);
    callback();
  }
}

export {
  Network
};
