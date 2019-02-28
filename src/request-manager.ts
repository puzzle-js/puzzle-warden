import {StreamHead} from "./stream-head";
import {KeyMaker, Tokenizer} from "./tokenizer";
import {RequestCallback} from "request";
import Url from "fast-url-parser";
import {ConfigurableStream, StreamFactory, StreamType} from "./stream-factory";
import {CacheConfiguration} from "./cache-factory";
import {WardenStream} from "./warden-stream";
import Cookie from "cookie";
import {Network} from "./network";

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
  [key: string]: any;

  identifier: string;
  cache?: CacheConfiguration | boolean;
  holder?: boolean;
}

class RequestManager {
  private streams: StreamMap = {};
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
    const stream = this.streamFactory.create<StreamHead>(StreamType.HEAD);
    let streamLink: WardenStream = stream;
    const network = this.streamFactory.create<Network>(StreamType.NETWORK);
    const keyMaker = this.tokenizer.tokenize(name, routeConfiguration.identifier);

    Object.values(ConfigurableStream).forEach((streamType: string) => {
      const configuration = routeConfiguration[streamType];
      if (configuration) {
        const stream = this.streamFactory.create<WardenStream>(streamType, configuration);
        streamLink = streamLink.connect(stream);
      }
    });

    streamLink.connect(network);

    this.streams[name] = {
      keyMaker,
      stream
    };
  }

  handle(name: string, requestOptions: RequestOptions, cb: RequestCallback) {
    if(!this.streams[name]) throw new Error(`Route configuration not provided for ${name}`);
    const request = Url.parse(requestOptions.url, true);
    const cookies = Cookie.parse(requestOptions.headers.cookie || requestOptions.headers.Cookie || '');
    const key = this.streams[name].keyMaker(
      request.path,
      cookies,
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
