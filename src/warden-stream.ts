import {Transform, TransformCallback} from "stream";

abstract class WardenStream {
  rightStream: Transform;
  leftStream: Transform;

  protected constructor() {
    this.onRightStream = this.onRightStream.bind(this);
    this.onLeftStream = this.onLeftStream.bind(this);

    this.leftStream = new Transform({
      objectMode: true,
      transform: this.onLeftStream
    });

    this.rightStream = new Transform({
      objectMode: true,
      transform: this.onRightStream
    });
  }

  connect(wardenStream: WardenStream) {
    this.rightStream.pipe(wardenStream.rightStream);
    wardenStream.leftStream.pipe(this.leftStream);
    return wardenStream;
  }

  abstract onRightStream(chunk: any, encoding: string, callback: TransformCallback): void;

  abstract onLeftStream(chunk: any, encoding: string, callback: TransformCallback): void;
}

export {
  WardenStream
};
