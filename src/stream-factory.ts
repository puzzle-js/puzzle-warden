import {Network} from "./network";
import {CacheConfiguration, CacheFactory} from "./cache-factory";
import {StreamHead} from "./stream-head";
import {Holder, HolderConfiguration} from "./holder";


class StreamFactory {
  private cacheFactory: CacheFactory;

  constructor(cacheFactory: CacheFactory) {
    this.cacheFactory = cacheFactory;
  }

  createCache(configuration: CacheConfiguration | true) {
    return this.cacheFactory.create(configuration);
  }

  createHolder(configuration: HolderConfiguration | true) {
    return new Holder();
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
