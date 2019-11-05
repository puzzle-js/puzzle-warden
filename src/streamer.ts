import {WardenRequestOptions} from "./request-manager";
import {StreamLogger} from "./stream-logger";
import {Warden} from "./warden";
import * as http from "http";


interface HttpResponse extends http.IncomingMessage {
  body?: string | object | null | undefined;
}

type RequestCallback = (error: any, response: HttpResponse | undefined, body: string | object | null | undefined) => void;


interface RequestChunk {
  id: number;
  key: string;
  requestOptions: WardenRequestOptions;
  cb: RequestCallback;
}

interface ResponseChunk extends RequestChunk {
  response?: HttpResponse | undefined;
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

  start(key: string, id: number, requestOptions: WardenRequestOptions, cb: RequestCallback) {
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
  HttpResponse,
  RequestCallback,
  NextHandler,
  Streamer,
  RequestChunk,
  ResponseChunk
};
