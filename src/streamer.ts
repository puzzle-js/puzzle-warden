import request, {RequestCallback} from "request";
import {RequestOptions} from "./request-manager";
import {StreamLogger} from "./stream-logger";
import {Warden} from "./warden";

interface RequestChunk {
  id: number;
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
  nextStream?: Streamer;
  previousStream?: Streamer;

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

  start(key: string, id: number, requestOptions: RequestOptions, cb: RequestCallback) {
    const chunk = {
      id,
      key,
      requestOptions,
      cb: cb as unknown as RequestCallback
    };
    this._onRequest(chunk);
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

  protected onRequest(chunk: RequestChunk, next?: NextHandler) {
    if (next) next(chunk);
  }

  protected onResponse(chunk: ResponseChunk, next?: NextHandler) {
    if (next) next(chunk);
  }

  private _onRequest(chunk: RequestChunk) {
    if (Warden.debug) StreamLogger.onRequest(chunk, this, this.previousStream, this.nextStream);
    this.onRequest(chunk, this.nextStream ? this.nextStream._onRequest : undefined);
  }

  private _onResponse(chunk: ResponseChunk) {
    if (Warden.debug) StreamLogger.onResponse(chunk, this, this.previousStream, this.nextStream);
    this.onResponse(chunk, this.previousStream ? this.previousStream._onResponse : undefined);
  }
}

export {
  NextHandler,
  Streamer,
  RequestChunk,
  ResponseChunk
};
