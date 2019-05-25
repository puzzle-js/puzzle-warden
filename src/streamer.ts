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
  private nextStream!: Streamer;
  private previousStream!: Streamer;

  constructor(name: string) {
    this.name = name;

    this._onRequest = this._onRequest.bind(this);
    this._onResponse = this._onResponse.bind(this);
  }

  connect(wardenStream: Streamer) {
    this.nextStream = wardenStream;
    wardenStream.previousStream = this;
    return wardenStream;
  }

  respond<T extends ResponseChunk>(chunk: T) {
    this.previousStream._onResponse(chunk);
  }

  request<T extends RequestChunk>(chunk: T) {
    this.nextStream._onRequest(chunk);
  }

  private _onRequest(chunk: RequestChunk) {
    this.onRequest(chunk, this.nextStream._onRequest);
  }

  private _onResponse(chunk: ResponseChunk) {
    this.onRequest(chunk, this.previousStream._onResponse);
  }

  protected onRequest(chunk: RequestChunk, next: NextHandler) {
    next(chunk);
  }

  protected onResponse(chunk: ResponseChunk, next: NextHandler) {
    next(chunk);
  }
}

export {
  NextHandler,
  Streamer,
  RequestChunk,
  ResponseChunk
};
