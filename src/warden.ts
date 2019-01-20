import {inject, injectable} from "inversify";
import {Configuration, WardenInitialConfig} from "./configuration";
import {WardenRequest, RequestManager} from "./request-manager";
import {Tokenizer} from "./tokenizer";
import {CacheManager, UserRouteCacheInput} from "./cache/cache-manager";

interface WardenUserRouteConfig {
  identifier: string;
  cache?: UserRouteCacheInput | null | string | undefined | number | boolean;
  shadowing?: any;
  holder?: any;
  queue?: any;
}

@injectable()
class Warden {
  private readonly configuration: Configuration;
  private readonly requestManager: RequestManager;
  private readonly tokenizer: Tokenizer;
  private readonly cacheManager: CacheManager;

  constructor(
    @inject(Configuration) configuration: Configuration,
    @inject(RequestManager) requestManager: RequestManager,
    @inject(Tokenizer) tokenizer: Tokenizer,
    @inject(CacheManager) cacheManager: CacheManager
  ) {

    this.configuration = configuration;
    this.requestManager = requestManager;
    this.tokenizer = tokenizer;
    this.cacheManager = cacheManager;
  }

  async init() {

  }

  config(wardenConfiguration: WardenInitialConfig) {
    this.configuration.config(wardenConfiguration);
  }

  setRoute(name: string, routeConfiguration: WardenUserRouteConfig) {
    this.configuration.route(
      name,
      this.tokenizer.tokenize(name, routeConfiguration.identifier),
      this.cacheManager.parseCacheConfig(routeConfiguration.cache
      ));
  }

  async request(requestConfiguration: WardenRequest, cb: () => Promise<string | object>) {
    await this.requestManager.handle(requestConfiguration, cb);
  }
}

export {
  WardenUserRouteConfig,
  Warden
};

/*

 warden.request('request_name','http://blabla.com/blabla', headers, () => {

});

 warden.config({
	'request_name': {
  	//...configuration
  }
});

 request({
	warden: 'request_name'
});

 */
