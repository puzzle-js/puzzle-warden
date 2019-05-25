import request, {RequestCallback} from "request";
import {RequestOptions} from "./request-manager";

interface RequestChunk {
  key: string;
  requestOptions: RequestOptions;
  cb: RequestCallback;
}

interface ResponseChunk extends RequestChunk {
  response?: request.Response;
  error?: {
    code: string
  };
}

type NextHandler = (chunk: ResponseChunk | RequestChunk) => void;

class Streamer {
  readonly name: string;
  private nextStream?: Streamer;
  private previousStream?: Streamer;

  constructor(name: string) {
    this.name = name;

    this._onRequest = this._onRequest.bind(this);
    this._onResponse = this._onResponse.bind(this);
    // this.respond = this.respond.bind(this);
    // this.request = this.request.bind(this);
  }

  connect(wardenStream: Streamer) {
    this.nextStream = wardenStream;
    wardenStream.previousStream = this;
    return wardenStream;
  }

  respond<T extends ResponseChunk>(chunk: T) {
    if (this.previousStream) {
      this.previousStream._onResponse(chunk);
    }
  }

  request<T extends RequestChunk>(chunk: T) {
    if (this.nextStream) {
      this.nextStream._onRequest(chunk);
    }
  }

  private _onRequest(chunk: RequestChunk) {
    console.debug('Request', {
      name: this.name,
      key: chunk.key
    });

    this.onRequest(chunk, this.nextStream ? this.nextStream._onRequest : undefined);
  }

  private _onResponse(chunk: ResponseChunk) {
    console.debug('Response', {
      name: this.name,
      key: chunk.key
    });

    this.onResponse(chunk, this.previousStream ? this.previousStream._onResponse : undefined);
  }

  protected onRequest(chunk: RequestChunk, next?: NextHandler) {
    if (next) next(chunk);
  }

  protected onResponse(chunk: ResponseChunk, next?: NextHandler) {
    if (next) next(chunk);
  }
}

export {
  NextHandler,
  Streamer,
  RequestChunk,
  ResponseChunk
};
