import {RequestChunk, Streamer} from "./streamer";
import {StreamType} from "./stream-factory";
import supra from "supra-http";
import {RequestOptions} from "supra-http/dist/types";

class Network extends Streamer {
  private requestName: string;

  constructor(requestName: string) {
    super(StreamType.NETWORK);

    this.requestName = requestName;
  }

  onRequest(chunk: RequestChunk): void {
    supra
      .request(this.requestName, chunk.requestOptions.url, chunk.requestOptions as Omit<RequestOptions, 'method'>)
      .then(res => {
        this.respond({
          ...chunk,
          response: Object.assign({body: res.json || res.body}, res.response),
        });
      })
      .catch(error => {
        this.respond({
          ...chunk,
          error
        });
      });
  }
}

export {
  Network
};
