import {PassThrough, Readable, Transform, TransformCallback} from "stream";
import ParallelTransform from "parallel-transform";
import {RequestCallback} from "request";
import {RequestOptions} from "./request-manager";

interface RequestChunk {
  key: string;
  requestOptions: RequestOptions;
  cb: RequestCallback;
}

interface ResponseChunk {
  cb: RequestCallback;
  key: string;
  data?: any;
  error?: any;
  cacheHit?: true;
}

abstract class WardenStream {
  private readonly requestStream: Transform | Readable;
  private readonly responseStream: Transform;
  private readonly streamLinks: { previous: string, next: string } = {
    previous: 'leftOutStream',
    next: 'rightOutStream'
  };
  private readonly name: string;
  private readonly head: boolean;
  private readonly debug: boolean;
  private readonly requestStreamPassThrough: PassThrough | undefined;
  private readonly responseStreamPassThrough: PassThrough | undefined;


  protected constructor(name: string, head = false, debug = process.env.WARDEN_LOGGER === 'true') {
    this.name = name;
    this.debug = debug;
    this.head = head;
    this.onRequestStream = this.onRequestStream.bind(this);
    this.onResponseStream = this.onResponseStream.bind(this);

    const [requestStream, responseStream, requestStreamPassThrough, responseStreamPassThrough] = this.createStreams();
    this.requestStream = requestStream;
    this.responseStream = responseStream;
    this.requestStreamPassThrough = requestStreamPassThrough;
    this.responseStreamPassThrough = responseStreamPassThrough;
  }

  private createStreams(): [Readable | Transform, Transform, PassThrough | undefined, PassThrough | undefined] {
    let requestStream: Readable | Transform;
    let responseStream: Transform;
    let requestStreamPassThrough: PassThrough | undefined;
    let responseStreamPassThrough: PassThrough | undefined;

    if (this.head) {
      requestStream = new Readable({
        objectMode: true,
        read: this.onRequestStream as () => void
      });
    } else {
      requestStream = new ParallelTransform(10, {ordered: false}, this.onRequestStream);
    }

    responseStream = new ParallelTransform(10, {ordered: false}, this.onResponseStream);

    if (this.debug) {
      requestStreamPassThrough = new PassThrough({objectMode: true});
      requestStreamPassThrough.on('data', (chunk: RequestChunk) => {
        console.log(`${this.name} --> ${this.streamLinks.next}`, chunk);
      });

      responseStreamPassThrough = new PassThrough({objectMode: true});
      responseStreamPassThrough.on('data', (chunk: RequestChunk) => {
        console.log(`${this.streamLinks.previous} <-- ${this.name}`, chunk);
      });
    }

    return [requestStream, responseStream, requestStreamPassThrough, responseStreamPassThrough];
  }

  connect(wardenStream: WardenStream) {
    let requestStream = this.requestStream;
    let responseStream = wardenStream.responseStream;

    if (this.debug) {
      requestStream = requestStream
        .pipe(this.requestStreamPassThrough!);
      responseStream = responseStream
        .pipe(wardenStream.responseStreamPassThrough!);
    }

    requestStream
      .pipe(wardenStream.requestStream as Transform);

    wardenStream.streamLinks.previous = this.name;
    this.streamLinks.next = wardenStream.name;

    responseStream
      .pipe(this.responseStream);

    return wardenStream;
  }

  pushResponse(chunk: ResponseChunk): boolean {
    return this.responseStream.push(chunk);
  }

  pushRequest(chunk: RequestChunk): boolean {
    return this.requestStream.push(chunk);
  }

  abstract onRequestStream(chunk: RequestChunk, callback: TransformCallback): void;

  abstract onResponseStream(chunk: ResponseChunk, callback: TransformCallback): void;
}

export {
  WardenStream,
  RequestChunk,
  ResponseChunk
};
