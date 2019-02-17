import {CachePlugin, CACHING_STRATEGY} from "./cache";
import {MemoryCache} from "./memory-cache";
import {Cache} from "./cache";
import ms from "ms";

const enum CACHE_PLUGIN {
  Couchbase = 'couchbase',
  Redis = 'redis',
  Memory = 'memory'
}

interface CacheConfiguration {
  plugin?: CACHE_PLUGIN;
  strategy?: CACHING_STRATEGY;
  duration?: string | number;
}

const defaultCachingDuration = 60000;

class CacheFactory {
  create(configuration: CacheConfiguration | true) {
    if(configuration === true) configuration = {};
    const plugin = this.getPlugin(configuration.plugin);
    const cacheDuration = this.parseMs(configuration.duration);

    return new Cache(plugin, cacheDuration);
  }

  getPlugin(plugin?: CACHE_PLUGIN): CachePlugin {
    switch (plugin) {
      case CACHE_PLUGIN.Memory:
        return new MemoryCache();
      default:
        return new MemoryCache();
    }
  }

  parseMs(duration?: string | number): number {
    if (!duration) return defaultCachingDuration;

    switch (typeof duration) {
      case 'string':
        return ms(duration);
      case 'number':
        return duration;
      default:
        throw new Error('Unknown type provided for cache duration');
    }
  }
}

export {
  CacheFactory,
  CacheConfiguration,
  CACHE_PLUGIN
};
