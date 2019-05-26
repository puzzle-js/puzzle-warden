import {Network} from "./network";
import {CacheFactory} from "./cache-factory";
import {StreamHead} from "./stream-head";
import {Holder} from "./holder";
import {RequestWrapper} from "./request-wrapper";
import {Retry} from "./retry";
import {SchemaStringifier, SchemaStringifierConfiguration} from "./schema-stringifier";

const enum StreamType {
  HOLDER = 'holder',
  CACHE = 'cache',
  NETWORK = 'network',
  QUEUE = 'queue',
  CIRCUIT = 'circuit',
  HEAD = 'head',
  RETRY = 'retry',
  SCHEMA_STRINGIFIER = 'schema'
}

enum ConfigurableStream {
  HOLDER = StreamType.HOLDER,
  CACHE = StreamType.CACHE,
  SCHEMA_STRINGIFIER = StreamType.SCHEMA_STRINGIFIER,
  RETRY = StreamType.RETRY,
}


class StreamFactory {
  private readonly cacheFactory: CacheFactory;
  private readonly requestWrapper: RequestWrapper;

  constructor(
    cacheFactory: CacheFactory,
    requestWrapper: RequestWrapper
  ) {
    this.cacheFactory = cacheFactory;
    this.requestWrapper = requestWrapper;
  }

  create<U, T = {}>(streamType: string, configuration: T) {
    switch (streamType) {
      case StreamType.CACHE:
        return this.cacheFactory.create(configuration) as unknown as U;
      case StreamType.HOLDER:
        return new Holder() as unknown as U;
      case StreamType.RETRY:
        return Retry.create(configuration) as unknown as U;
      case StreamType.SCHEMA_STRINGIFIER:
        return new SchemaStringifier(configuration as unknown as SchemaStringifierConfiguration) as unknown as U;
      default:
        throw new Error('Unknown stream type');
    }
  }

  createNetwork() {
    return new Network(this.requestWrapper);
  }

  createHead() {
    return new StreamHead();
  }
}

export {
  ConfigurableStream,
  StreamType,
  StreamFactory
};
