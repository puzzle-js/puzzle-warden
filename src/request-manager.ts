import {StreamHead} from "./stream-head";
import {KeyMaker, Tokenizer} from "./tokenizer";
import {RequestCallback} from "request";
import Url from "fast-url-parser";
import {StreamFactory} from "./stream-factory";
import {CacheConfiguration} from "./cache-factory";

interface StreamMap {
  [routeName: string]: {
    keyMaker: KeyMaker;
    stream: StreamHead;
  };
}

interface RequestOptions {
  url: string;
  method: 'get' | 'post';
  headers: {
    [key: string]: string,
  };
  body?: object;
}

interface RouteConfiguration {
  identifier: string;
  cache: CacheConfiguration;
}

class RequestManager {
  streams: StreamMap = {};
  private streamFactory: StreamFactory;
  private tokenizer: Tokenizer;

  constructor(
    streamFactory: StreamFactory,
    tokenizer: Tokenizer,
  ){
    this.tokenizer = tokenizer;
    this.streamFactory = streamFactory;
  }

  register(name: string, routeConfiguration: RouteConfiguration) {
    const stream = this.streamFactory.createHead();
    const network = this.streamFactory.createNetwork();
    const keyMaker = this.tokenizer.tokenize(name, routeConfiguration.identifier);
    const cache = this.streamFactory.createCache({});

    stream
      .connect(cache)
      .connect(network);

    this.streams[name] = {
      keyMaker,
      stream
    };
  }

  handle(name: string, requestOptions: RequestOptions, cb: RequestCallback) {
    const request = Url.parse(requestOptions.url, true);
    const key = this.streams[name].keyMaker(
      request.path,
      {},
      requestOptions.headers,
      request.query,
      requestOptions.method
    );

    this.streams[name].stream.start(key, requestOptions, cb);
  }
}

export {
  RequestOptions,
  RouteConfiguration,
  RequestManager
};
