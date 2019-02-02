import {Configuration} from "../configuration";
import {WardenStream} from "../warden-stream";
import {TransformCallback} from "stream";
import {CachePlugin} from "./plugins/cache-plugin";

enum CachingStrategy {
  CacheThenNetwork = 'cacheThenNetwork'
}

enum CachePluginType {
  Couchbase = 'couchbase',
  Redis = 'redis',
  Memory = 'memory'
}

type CacheConfig = {
  strategy: CachingStrategy;
  plugin: CachePluginType;
  duration: number;
};

class Cache extends WardenStream {
  private cacheConfig: CacheConfig;
  private configuration: Configuration;
  private cachePlugin: CachePlugin;

  constructor(
    configuration: Configuration,
    cacheConfig: CacheConfig,
    cachePlugin: CachePlugin
  ) {
    super();

    this.configuration = configuration;
    this.cacheConfig = cacheConfig;
    this.cachePlugin = cachePlugin;
  }


  onLeftStream(chunk: any, encoding: string, callback: TransformCallback): void {

  }

  onRightStream(chunk: any, encoding: string, callback: TransformCallback): void {

  }
}

export {
  CacheConfig,
  CachePluginType,
  CachingStrategy,
  Cache,
};
