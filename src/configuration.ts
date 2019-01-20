import {injectable} from "inversify";

interface StorageConfig {
  couchbase: {
    enabled: boolean,
  };
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
    memory?: boolean,
  };
}

interface WardenRouteConfig {
  cache: any;
  shadowing: any;
  holder: any;
  queue: any;
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

  route(name: string, config: WardenRouteConfig) {
    this.configuration.requests[name] = config;
  }
}

export {
  WardenConfig,
  WardenInitialConfig,
  WardenRouteConfig,
  Configuration,
};
