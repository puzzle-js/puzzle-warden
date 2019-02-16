import {Network} from "./network";
import {CacheConfiguration, CacheFactory} from "./cache-factory";
import {StreamHead} from "./stream-head";


class StreamFactory {
  private cacheFactory: CacheFactory;

  constructor(cacheFactory: CacheFactory) {
    this.cacheFactory = cacheFactory;
  }

  createCache(configuration: CacheConfiguration) {
    return this.cacheFactory.create(configuration);
  }

  createHead() {
    return new StreamHead();
  }

  createNetwork() {
    return new Network();
  }
}

export {
  StreamFactory
};
