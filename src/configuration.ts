import {injectable} from "inversify";

interface IStorageConfiguration {
  couchbase: {
    enabled: boolean
  }
}

interface IWardenConfig {
  requests: {
    [key: string]: IWardenRouteConfiguration;
  }
  storage: IStorageConfiguration;
}

interface IWardenInitialConfig {
  storage: {
    couchbase?: {
      host: string;
      bucket: string;
      username?: string;
      password?: string;
    }
    memory?: boolean
  }
}

interface IWardenRouteConfiguration {
  cache: any;
  shadowing: any;
  holder: any;
  queue: any;
}

@injectable()
class Configuration {
  configuration: IWardenConfig = {
    requests: {},
    storage: {
      couchbase: {
        enabled: false
      }
    }
  };

  config(configuration: IWardenInitialConfig) {

  }

  route(name: string, config: IWardenRouteConfiguration) {
    this.configuration.requests[name] = config;
  }
}

export {
  IWardenConfig,
  IWardenInitialConfig,
  IWardenRouteConfiguration,
  Configuration
}
