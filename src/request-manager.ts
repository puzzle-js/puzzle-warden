import {StreamHead} from "./stream-head";
import {KeyMaker, Tokenizer} from "./tokenizer";
import * as request from "request";
import {RequestCallback} from "request";
import Url from "fast-url-parser";
import {ConfigurableStream, StreamFactory} from "./stream-factory";
import {CacheConfiguration} from "./cache-factory";
import {Streamer} from "./streamer";
import Cookie from "cookie";
import {RetryInputConfiguration} from "./retry";

type KeyStreamPair = {
  keyMaker: KeyMaker;
  stream: StreamHead;
};

interface StreamMap {
  [routeName: string]: KeyStreamPair[];
}

const DEFAULT_IDENTIFIER = `u_{Date.now()}`;

interface RequestOptions extends request.CoreOptions {
  url: string;
  method: 'get' | 'post';
  headers?: {
    [key: string]: string,
  };
  body?: object;
}

interface RouteConfiguration {
  [key: string]: any;

  identifier?: string;
  cache?: CacheConfiguration | boolean;
  holder?: boolean;
  retry?: RetryInputConfiguration | boolean | number;
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
    const stream = this.streamFactory.createHead();
    let streamLink: Streamer = stream;
    const network = this.streamFactory.createNetwork();
    const keyMaker = this.tokenizer.tokenize(name, routeConfiguration.identifier);

    Object.values(ConfigurableStream).forEach((streamType: string) => {
      const configuration = routeConfiguration[streamType];
      if (configuration) {
        const stream = this.streamFactory.create<Streamer>(streamType, configuration);
        streamLink = streamLink.connect(stream);
      }
    });

    streamLink.connect(network);

    this.addStream(name, {
      keyMaker,
      stream
    });
  }

  unregister(name: string) {
    delete this.streams[name];
  }

  handle(name: string, requestOptions: RequestOptions, cb: RequestCallback) {
    if (!this.streams[name]) throw new Error(`Route configuration not provided for ${name}`);
    const request = Url.parse(requestOptions.url, true);
    const headers = requestOptions.headers || {};
    const cookies = Cookie.parse(headers.cookie || headers.Cookie || '');
    const key = this.streams[name][0].keyMaker(
      request.pathname,
      cookies,
      headers,
      request.query,
      requestOptions.method
    );

    return this.streams[name][0].stream.start(key, requestOptions, cb);
  }

  isRouteRegistered(name: string): boolean {
    return !!this.streams[name];
  }

  private addStream(name: string, keyStreamPair: KeyStreamPair) {
    (this.streams[name] = this.streams[name] || []).unshift(keyStreamPair);
  }
}

export {
  DEFAULT_IDENTIFIER,
  RequestOptions,
  RouteConfiguration,
  RequestManager
};
