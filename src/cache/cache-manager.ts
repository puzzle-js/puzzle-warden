import {inject, injectable} from "inversify";
import {Configuration} from "../configuration";
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

interface UserRouteCacheInput {
  strategy?: CachingStrategy;
  plugin?: CachePlugin;
  duration?: string;
}

@injectable()
class CacheManager {
  private configuration: Configuration;

  readonly defaultCacheConfig = {
    strategy: CachingStrategy.CacheThenNetwork,
    plugin: CachePlugin.Memory,
    duration: 1000 * 60 * 2
  };

  constructor(
    @inject(Configuration) configuration: Configuration,
  ) {

    this.configuration = configuration;
  }

  parseCacheConfig(config?: UserRouteCacheInput | string | number | null | boolean): RequestCacheConfig | false {
    if (typeof config === 'string' || typeof config === 'number') {
      const duration = ms(config.toString());
      return {
        ...this.defaultCacheConfig,
        duration
      };
    } else if (typeof config === 'boolean') {
      if (config) return this.defaultCacheConfig;

      return false;
    }
    else if (typeof config === 'object' && config !== null) {
      return {
        strategy: config.strategy || this.defaultCacheConfig.strategy,
        plugin: config.plugin || this.defaultCacheConfig.plugin,
        duration: config.duration ? ms(config.duration.toString()) : this.defaultCacheConfig.duration
      };
    }

    return false;
  }
}

export {
  UserRouteCacheInput,
  RequestCacheConfig,
  CachePlugin,
  CachingStrategy,
  CacheManager,
};
