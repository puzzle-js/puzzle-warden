import {inject, injectable} from "inversify";
import {Configuration, IWardenInitialConfig, IWardenRouteConfiguration} from "./configuration";
import {IWardenRequest, RequestManager} from "./request-manager";

@injectable()
export class Warden {
  private readonly configuration: Configuration;
  private readonly requestManager: RequestManager;

  constructor(
    @inject(Configuration) configuration: Configuration,
    @inject(RequestManager) requestManager: RequestManager
  ) {

    this.configuration = configuration;
    this.requestManager = requestManager;
  }

  async init() {

  }

  config(wardenConfiguration: IWardenInitialConfig) {
    this.configuration.config(wardenConfiguration);
  }

  setRoute(name: string, routeConfiguration: IWardenRouteConfiguration) {
    this.configuration.route(name, routeConfiguration);
  }

  async request(requestConfiguration: IWardenRequest, cb: () => Promise<string | object>) {
    await this.requestManager.handle(requestConfiguration, cb);
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
