import {WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";

class Holder extends WardenStream {
  static getInstance() {

  }

  onLeftStream(chunk: any, encoding: string, callback: TransformCallback): void {

  }

  onRightStream(chunk: any, encoding: string, callback: TransformCallback): void {

  }
}

export {
  Holder
};
