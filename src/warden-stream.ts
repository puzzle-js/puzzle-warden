import {PassThrough, Transform, TransformCallback} from "stream";

type RequestChunk = {
  key: string;
  version: number;
};

type ResponseChunk = {
  key: string;
  data: string;
  startMs: number;
};

abstract class WardenStream {
  rightStream: Transform;
  leftStream: Transform;
  name: string;
  leftLogStream: PassThrough;
  sideStreamNames: {left: string, right: string} = {
    left: 'leftOutStream',
    right: 'rightOutStream'
  };
  private rightLogStream: PassThrough;

  protected constructor(name: string) {
    this.name = name;
    this.onRightStream = this.onRightStream.bind(this);
    this.onLeftStream = this.onLeftStream.bind(this);
    this.rightLogStream = new PassThrough({objectMode: true});
    this.leftLogStream = new PassThrough({objectMode: true});

    this.leftStream = new Transform({
      objectMode: true,
      transform: this.onLeftStream
    });

    this.rightStream = new Transform({
      objectMode: true,
      transform: this.onRightStream
    });

    // this.rightLogStream.on('data', (chunk: RequestChunk) => {
    //   console.log(`${this.name} --> ${this.sideStreamNames.right}`, chunk);
    // });
    //
    // this.leftLogStream.on('data', (chunk: RequestChunk) => {
    //   console.log(`${this.sideStreamNames.left} <-- ${this.name}`, chunk);
    // });
  }

  connect(wardenStream: WardenStream) {
    this.rightStream
      .pipe(this.rightLogStream)
      .pipe(wardenStream.rightStream);

    wardenStream.sideStreamNames.left = this.name;
    this.sideStreamNames.right = wardenStream.name;

    wardenStream.leftStream
      .pipe(wardenStream.leftLogStream)
      .pipe(this.leftStream);

    return wardenStream;
  }

  abstract onRightStream(chunk: RequestChunk, encoding: string, callback: TransformCallback): void;

  abstract onLeftStream(chunk: ResponseChunk, encoding: string, callback: TransformCallback): void;
}

export {
  WardenStream,
  RequestChunk,
  ResponseChunk
};
