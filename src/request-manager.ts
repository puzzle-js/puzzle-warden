import {StreamHead} from "./stream-head";
import {KeyMaker, Tokenizer} from "./tokenizer";
import {RequestCallback} from "request";
import Url from "fast-url-parser";
import {ConfigurableStream, StreamFactory, StreamType} from "./stream-factory";
import {CacheConfiguration} from "./cache-factory";
import {WardenStream} from "./warden-stream";
import Cookie from "cookie";
import {Network} from "./network";
import {Holder} from "./holder";
import {Cache} from "./cache";
import {MemoryCache} from "./memory-cache";

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
    const stream = this.streamFactory.create<StreamHead>(StreamType.HEAD);
    let streamLink: WardenStream = stream;
    const network = this.streamFactory.create<Network>(StreamType.NETWORK);
    const keyMaker = this.tokenizer.tokenize(name, routeConfiguration.identifier);

    // Object.values(ConfigurableStream).forEach((streamType: string) => {
    //   const configuration = routeConfiguration[streamType];
    //   if (configuration) {
    //     console.log()
    //     const stream = this.streamFactory.create<WardenStream>(streamType, configuration);
    //     streamLink = streamLink
    //       .connect(stream);
    //   }
    // });


    stream
      .connect(new Holder())
      .connect(new Cache(new MemoryCache(), 2000))
      .connect(network);


    this.streams[name] = {
      keyMaker,
      stream
    };
  }

  handle(name: string, requestOptions: RequestOptions, cb: RequestCallback) {
    const request = Url.parse(requestOptions.url, true);
    const cookies = Cookie.parse(requestOptions.headers.Cookie || requestOptions.headers.cookie || '');
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
  StreamType,
  RequestOptions,
  RouteConfiguration,
  RequestManager
};
