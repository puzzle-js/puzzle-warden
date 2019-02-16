import {PassThrough, Readable, Transform, TransformCallback} from "stream";
import ParallelTransform from "parallel-transform";
import {RequestCallback} from "request";
import {RequestOptions} from "./request-manager";

interface RequestChunk {
  key: string;
  requestOptions: RequestOptions;
  cb: RequestCallback;
}

interface ResponseChunk extends RequestChunk {
  key: string;
  data: string;
  error: any;
}

abstract class WardenStream {
  protected readonly rightStream: Transform | Readable;
  protected readonly leftStream: Transform;
  private readonly sideStreamNames: { left: string, right: string } = {
    left: 'leftOutStream',
    right: 'rightOutStream'
  };
  private readonly name: string;
  private readonly head: boolean;
  private readonly end: boolean;
  private readonly leftLogStream: PassThrough = new PassThrough({objectMode: true});
  private readonly rightLogStream: PassThrough = new PassThrough({objectMode: true});


  protected constructor(name: string, head = false, end = false) {
    this.name = name;
    this.end = end;
    this.head = head;
    this.onRightStream = this.onRightStream.bind(this);
    this.onLeftStream = this.onLeftStream.bind(this);

    if (head) {
      this.rightStream = new Readable({
        objectMode: true,
        read: this.onRightStream as () => void
      });
    } else {
      this.rightStream = new ParallelTransform(5000, {ordered: false} ,this.onRightStream);
    }

    this.leftStream = new ParallelTransform(5000,{ordered: false}, this.onLeftStream);

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
      .pipe(wardenStream.rightStream as Transform);

    wardenStream.sideStreamNames.left = this.name;
    this.sideStreamNames.right = wardenStream.name;

    wardenStream.leftStream
      .pipe(wardenStream.leftLogStream)
      .pipe(this.leftStream);

    return wardenStream;
  }

  abstract onRightStream(chunk: RequestChunk, callback: TransformCallback): void;

  abstract onLeftStream(chunk: ResponseChunk, callback: TransformCallback): void;
}

export {
  WardenStream,
  RequestChunk,
  ResponseChunk
};
