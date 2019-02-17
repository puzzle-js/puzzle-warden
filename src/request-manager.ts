import {StreamHead} from "./stream-head";
import {KeyMaker, Tokenizer} from "./tokenizer";
import {RequestCallback} from "request";
import Url from "fast-url-parser";
import {StreamFactory} from "./stream-factory";
import {CacheConfiguration} from "./cache-factory";
import {WardenStream} from "./warden-stream";

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
  cache: CacheConfiguration | boolean;
  holder: boolean;
}

class RequestManager {
  streams: StreamMap = {};
  private streamFactory: StreamFactory;
  private tokenizer: Tokenizer;

  constructor(
    streamFactory: StreamFactory,
    tokenizer: Tokenizer,
  ) {
    this.tokenizer = tokenizer;
    this.streamFactory = streamFactory;
  }

  register(name: string, routeConfiguration: RouteConfiguration) {
    const stream = this.streamFactory.createHead();
    let streamLink: WardenStream = stream;
    const network = this.streamFactory.createNetwork();
    const keyMaker = this.tokenizer.tokenize(name, routeConfiguration.identifier);

    if (routeConfiguration.cache) {
      const cache = this.streamFactory.createCache(routeConfiguration.cache);
      streamLink = streamLink
        .connect(cache);
    }

    if (routeConfiguration.holder) {
      const holder = this.streamFactory.createHolder(routeConfiguration.holder);
      streamLink = streamLink
        .connect(holder);
    }

    streamLink
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

    return this.streams[name].stream.start(key, requestOptions, cb);
  }
}

export {
  RequestOptions,
  RouteConfiguration,
  RequestManager
};
