import {CacheConfig, CachePluginType, CachingStrategy} from "./cache";
import {Cache} from "./cache";
import ms from "ms";
import {container} from "../index";
import {Configuration} from "../configuration";
import {injectable} from "inversify";

type UserRouteCacheInput = {
  strategy?: CachingStrategy;
  plugin?: CachePluginType;
  duration?: string;
} | string | number | null | boolean;

@injectable()
class CacheFactory {
  readonly defaultCacheConfig = {
    strategy: CachingStrategy.CacheThenNetwork,
    plugin: CachePluginType.Memory,
    duration: 1000 * 60 * 2
  };

  create(config?: UserRouteCacheInput): Cache {
    const parsedConfig = this.parseCacheConfig(config);

    return new Cache(
      container.get(Configuration),
      parsedConfig,
      container.get(parsedConfig.plugin)
    );
  }

  parseCacheConfig(config?: UserRouteCacheInput): CacheConfig {
    if (typeof config === 'string' || typeof config === 'number') {
      const duration = ms(config.toString());
      return {
        ...this.defaultCacheConfig,
        duration
      };
    } else if (typeof config === 'boolean') {
      return this.defaultCacheConfig;
    } else if (typeof config === 'object' && config !== null) {
      return {
        strategy: config.strategy || this.defaultCacheConfig.strategy,
        plugin: config.plugin || this.defaultCacheConfig.plugin,
        duration: config.duration ? ms(config.duration.toString()) : this.defaultCacheConfig.duration
      };
    }

    return this.defaultCacheConfig;
  }
}

export {
  CacheFactory,
  UserRouteCacheInput
};
