import {injectable} from "inversify";

interface IWardenRequestConfiguration {
  cache: any;
  shadowing: any;
  holder: any;
  queue: any;
}

interface IStorageConfiguration {
  couchbase: {
    enabled: boolean
  }
}

interface IWardenConfig {
  requests: {
    [key: string]: IWardenRequestConfiguration;
  }
  storage: IStorageConfiguration;
}

export interface IWardenInitialConfig {
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

export interface IWardenRouteConfiguration {

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

  route(route: IWardenRouteConfiguration) {

  }
}

export {
  Configuration
}
