import {inject, injectable} from "inversify";
import {Cache} from "./cache/cache";
import {Configuration, IWardenInitialConfig, IWardenRouteConfiguration} from "./configuration";

interface IWardenRequest {

}

@injectable()
export class Warden {
  private readonly cache: Cache;
  private readonly configuration: Configuration;

  constructor(
    @inject(Cache) cache?: Cache,
    @inject(Configuration) configuration?: Configuration
  ) {

    this.configuration = configuration || new Configuration();
    this.cache = cache || new Cache(this.configuration);
  }

  async init() {

  }

  config(wardenConfiguration: IWardenInitialConfig) {
    this.configuration.config(wardenConfiguration);
  }

  setRoute(routeConfiguration: IWardenRouteConfiguration) {

  }

  async request(requestName: IWardenRequest, cb: () => Promise<string | object>) {
    const response = await cb();
  }
}


/**

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
