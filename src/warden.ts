import {CacheConfiguration, CacheFactory} from "./cache-factory";
import {Network} from "./network";
import {StreamHead} from "./stream-head";

interface RouteConfiguration {
  identifier: string;
  cache: CacheConfiguration;
}

class Warden {
  private cacheFactory: CacheFactory;

  constructor(cacheFactory: CacheFactory) {
    this.cacheFactory = cacheFactory;
  }

  setRoute(name: string, routeConfiguration: RouteConfiguration) {
    const startStream = new StreamHead();
    const cache = this.cacheFactory.create(routeConfiguration.cache);
    const network = new Network();

    startStream
      .connect(cache)
      .connect(network);

    return startStream;
  }
}

export {
  Warden
};
