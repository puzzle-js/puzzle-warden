import {NextHandler, RequestChunk, ResponseChunk, Streamer} from "./streamer";
import {StreamType} from "./stream-factory";
import fastJsonStringifier, {Schema} from "fast-json-stringify";

type SchemaStringifierConfiguration = Schema;

class SchemaStringifier extends Streamer {
  private readonly stringifier!: (doc: (object | any[] | string | number | boolean | null)) => string;

  constructor(configuration: SchemaStringifierConfiguration, stringifier = fastJsonStringifier) {
    super(StreamType.SCHEMA_STRINGIFIER);

    this.stringifier = stringifier(configuration);
  }

  onRequest(chunk: RequestChunk, next: NextHandler) {
    if (chunk.requestOptions.json && typeof chunk.requestOptions.body === "object") {
      chunk.requestOptions.json = false;
      chunk.requestOptions.headers = {
        'content-type': 'application/json',
        ...chunk.requestOptions.headers
      };
      chunk.requestOptions.body = this.stringifier(chunk.requestOptions.body);
    }

    next(chunk);
  }

  onResponse(chunk: ResponseChunk, next: NextHandler) {
    if (chunk.response && chunk.response.body && typeof chunk.response.body === "string") {
      try {
        chunk.response.body = JSON.parse(chunk.response.body);
      } catch (e) {
        chunk.response.body = null;
      }
    }

    next(chunk);
  }
}

export {
  SchemaStringifierConfiguration,
  SchemaStringifier
};

