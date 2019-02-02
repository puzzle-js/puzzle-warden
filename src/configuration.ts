import {injectable} from "inversify";
import {CacheConfig} from "./cache/cache";
import {KeyMaker} from "./tokenizer";

interface StorageConfig {
  couchbase: {
    enabled: boolean;
  };
}

interface WardenRouteConfig {
  keyMaker: KeyMaker;
  cache: CacheConfig | false;
}

interface WardenConfig {
  requests: {
    [key: string]: WardenRouteConfig;
  };
  storage: StorageConfig;
}

interface WardenInitialConfig {
  storage: {
    couchbase?: {
      host: string;
      bucket: string;
      username?: string;
      password?: string;
    }
    memory?: boolean;
  };
}

@injectable()
class Configuration {
  configuration: WardenConfig = {
    requests: {},
    storage: {
      couchbase: {
        enabled: false,
      },
    },
  };

  config(configuration: WardenInitialConfig) {

  }

  route(name: string, keyMaker: KeyMaker, cache: CacheConfig | false) {
    this.configuration.requests[name] = {
      cache,
      keyMaker
    };
  }


}

export {
  WardenConfig,
  WardenInitialConfig,
  Configuration,
};
