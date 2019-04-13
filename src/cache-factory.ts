import {MemoryCache} from "./memory-cache";
import ms from "ms";
import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {TransformCallback} from "stream";
import {CacheThenNetwork} from "./cache-then-network";

interface CachePlugin {
  get<T>(key: string): Promise<T | null>;

  set(key: string, value: unknown, ms?: number): Promise<void>;
}

const enum CACHE_PLUGIN {
  Couchbase = 'couchbase',
  Redis = 'redis',
  Memory = 'memory'
}

enum CACHING_STRATEGY {
  CacheThenNetwork="CacheThenNetwork",
  NetWorkThenCache="NetWorkThenCache"
}

interface CacheConfiguration {
  plugin?: CACHE_PLUGIN;
  strategy?: CACHING_STRATEGY;
  duration?: string | number;
}

export interface Cache extends WardenStream {
  onRequest(chunk: ResponseChunk, callback: TransformCallback): Promise<void>;

  onRequest(chunk: RequestChunk, callback: TransformCallback): Promise<void>;
}

const defaultCachingDuration = 60000;

const cachingStrategyImplementations = {
  [CACHING_STRATEGY.CacheThenNetwork]: CacheThenNetwork
} as { [key: string]: { new(plugin: CachePlugin, ms: number): Cache } };

class CacheFactory {
  create(configuration: CacheConfiguration | true) {
    if (configuration === true) configuration = {};
    const plugin = this.getPlugin(configuration.plugin);
    const cacheDuration = this.parseMs(configuration.duration);
    const strategy = this.getStrategy(configuration.strategy);

    return new cachingStrategyImplementations[strategy](plugin, cacheDuration);
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

  getStrategy(strategy?: CACHING_STRATEGY) {
    if (typeof strategy === 'undefined' || typeof CACHING_STRATEGY[strategy] === 'undefined') {
      return CACHING_STRATEGY.CacheThenNetwork;
    }

    return CACHING_STRATEGY[strategy];
  }
}

export {
  CachePlugin,
  CACHING_STRATEGY,
  CacheFactory,
  CacheConfiguration,
  CACHE_PLUGIN
};
