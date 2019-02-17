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

interface WardenStreamer {
  onRequest(chunk: RequestChunk, callback: TransformCallback): void;
  onResponse(chunk: ResponseChunk, callback: TransformCallback): void;
  respond(chunk: ResponseChunk): boolean;
  request(chunk: RequestChunk): boolean;
}

abstract class WardenStream implements WardenStreamer {
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
    this.onRequest = this.onRequest.bind(this);
    this.onResponse = this.onResponse.bind(this);

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
        read: this.onRequest as () => void
      });
    } else {
      requestStream = new ParallelTransform(10, {ordered: false}, this.onRequest);
    }

    responseStream = new ParallelTransform(10, {ordered: false}, this.onResponse);

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

  respond(chunk: ResponseChunk): boolean {
    return this.responseStream.push(chunk);
  }

  request(chunk: RequestChunk): boolean {
    return this.requestStream.push(chunk);
  }

  abstract onRequest(chunk: RequestChunk, callback: TransformCallback): void;

  abstract onResponse(chunk: ResponseChunk, callback: TransformCallback): void;
}

export {
  WardenStream,
  RequestChunk,
  ResponseChunk
};
