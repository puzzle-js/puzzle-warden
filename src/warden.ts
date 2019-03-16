import {RequestManager, RequestOptions, RouteConfiguration} from "./request-manager";
import {RequestCallback, CoreOptions} from "request";
import {RequestWrapper} from "./request-wrapper";

class Warden {
  private requestManager: RequestManager;
  private requestWrapper: RequestWrapper;

  constructor(
    requestManager: RequestManager,
    requestWrapper: RequestWrapper
  ) {
    this.requestManager = requestManager;
    this.requestWrapper = requestWrapper;
  }

  register(name: string, routeConfiguration: RouteConfiguration) {
    this.requestManager.register(name, routeConfiguration);
  }

  request(name: string, requestOptions: RequestOptions, cb: RequestCallback) {
    return this.requestManager.handle(name, requestOptions, cb);
  }

  requestConfig(options: CoreOptions) {
    this.requestWrapper.config(options);
  }
}

export {
  Warden
};
