import {inject, injectable} from "inversify";
import {Configuration, WardenUserRouteConfig} from "../configuration";
import ms from "ms";

enum CachingStrategy {
  CacheThenNetwork = 'cacheThenNetwork'
}

enum CachePlugin {
  Couchbase = 'couchbase',
  Redis = 'redis',
  Memory = 'memory'
}

interface RequestCacheConfig {
  strategy: CachingStrategy;
  plugin: CachePlugin;
  duration: number;
}

@injectable()
class CacheManager {
  private configuration: Configuration;

  constructor(
    @inject(Configuration) configuration: Configuration,
  ) {

    this.configuration = configuration;
  }

  parseCacheConfig(config: WardenUserRouteConfig): RequestCacheConfig | null {
    if (!config.cache) return null;

    if (typeof config.cache === 'string' || typeof config.cache === 'number') {
      const cacheTimeInMs = ms(config.cache.toString());
    }

    return null;
  }
}

export {
  RequestCacheConfig,
  CachePlugin,
  CachingStrategy,
  CacheManager,
};
