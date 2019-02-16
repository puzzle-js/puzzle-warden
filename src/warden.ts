import {CacheConfiguration} from "./cache-factory";
import {RequestManager, RequestOptions, RouteConfiguration} from "./request-manager";
import {RequestCallback} from "request";

class Warden {
  private requestManager: RequestManager;

  constructor(
    requestManager: RequestManager
  ) {
    this.requestManager = requestManager;
  }

  register(name: string, routeConfiguration: RouteConfiguration) {
    this.requestManager.register(name, routeConfiguration);
  }

  request(name: string, requestOptions: RequestOptions, cb: RequestCallback) {
    return this.requestManager.handle(name, requestOptions, cb);
  }
}

export {
  Warden
};
