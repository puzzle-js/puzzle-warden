import {Network} from "./network";
import {CacheConfiguration, CacheFactory} from "./cache-factory";
import {StreamHead} from "./stream-head";
import {Holder} from "./holder";
import {Retry, RetryInputConfiguration} from "./retry";
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

  constructor(
    cacheFactory: CacheFactory,
  ) {
    this.cacheFactory = cacheFactory;
  }

  create<U, T = {}>(streamType: string, configuration: T) {
    switch (streamType) {
      case StreamType.CACHE:
        return this.cacheFactory.create(configuration as CacheConfiguration) as unknown as U;
      case StreamType.HOLDER:
        return new Holder() as unknown as U;
      case StreamType.RETRY:
        return Retry.create(configuration as RetryInputConfiguration);
      case StreamType.SCHEMA_STRINGIFIER:
        return new SchemaStringifier(configuration as unknown as SchemaStringifierConfiguration) as unknown as U;
      default:
        throw new Error('Unknown stream type');
    }
  }

  createNetwork(name: string) {
    return new Network(name);
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
