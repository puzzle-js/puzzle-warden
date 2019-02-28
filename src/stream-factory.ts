import {Network} from "./network";
import {CacheFactory} from "./cache-factory";
import {StreamHead} from "./stream-head";
import {Holder} from "./holder";

const enum StreamType {
  HOLDER = 'holder',
  CACHE = 'cache',
  NETWORK = 'network',
  QUEUE = 'queue',
  CIRCUIT = 'circuit',
  HEAD = 'head'
}

enum ConfigurableStream {
  HOLDER = StreamType.HOLDER,
  CACHE = StreamType.CACHE
}


class StreamFactory {
  private cacheFactory: CacheFactory;

  constructor(cacheFactory: CacheFactory) {
    this.cacheFactory = cacheFactory;
  }

  create<U, T = {}>(streamType: string, configuration?: T) {
    switch (streamType) {
      case StreamType.CACHE:
        return this.cacheFactory.create(configuration as T);
      case StreamType.HOLDER:
        return new Holder() as unknown as U;
      case StreamType.CIRCUIT:
        throw new Error('Not implemented');
      case StreamType.NETWORK:
        return new Network() as unknown as U;
      case StreamType.HEAD:
        return new StreamHead() as unknown as U;
      default:
        throw new Error('Unknown stream type');
    }
  }
}

export {
  ConfigurableStream,
  StreamType,
  StreamFactory
};
