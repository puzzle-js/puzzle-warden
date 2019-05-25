import {MemoryCache} from "./memory-cache";
import ms from "ms";
import {Streamer} from "./streamer";
import {CacheThenNetwork} from "./cache-then-network";

interface CachePlugin {
  get<T>(key: string): Promise<T | null>;

  set(key: string, value: unknown, ms?: number): Promise<void>;
}

enum CACHING_STRATEGY {
  CacheThenNetwork = "CacheThenNetwork",
  NetWorkThenCache = "NetWorkThenCache"
}

interface CacheConfiguration {
  plugin?: string;
  strategy?: CACHING_STRATEGY;
  duration?: string | number;
  cacheWithCookie?: boolean;
}


const defaultCachingDuration = 60000;

type CacheStreamers = {
  [key: string]: {
    new(plugin: CachePlugin, cacheDangerous: boolean, ms: number): Streamer
  };
};

const cachingStrategyImplementations: CacheStreamers = {
  [CACHING_STRATEGY.CacheThenNetwork]: CacheThenNetwork
};

class CacheFactory {
  private plugins: { [key: string]: (new () => CachePlugin) | CachePlugin } = {};

  constructor() {
    this.plugins['memory'] = MemoryCache;
  }

  create(configuration: CacheConfiguration | true) {
    if (configuration === true) configuration = {};
    const plugin = this.getPlugin(configuration.plugin);
    const cacheDuration = this.parseMs(configuration.duration);
    const strategy = this.getStrategy(configuration.strategy);
    const cacheWithCookie = configuration.cacheWithCookie || false;

    return new cachingStrategyImplementations[strategy](plugin, cacheWithCookie, cacheDuration);
  }

  getPlugin(plugin = 'memory'): CachePlugin {
    const cachePlugin = (this.plugins[plugin] || this.plugins['memory']) as ((new () => CachePlugin) | CachePlugin);
    if ('get' in cachePlugin && 'set' in cachePlugin) {
      return cachePlugin;
    } else {
      return new cachePlugin();
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

  register(name: string, plugin: CachePlugin | (new() => CachePlugin)) {
    this.plugins[name] = plugin;
  }
}

export {
  CachePlugin,
  CACHING_STRATEGY,
  CacheFactory,
  CacheConfiguration
};
