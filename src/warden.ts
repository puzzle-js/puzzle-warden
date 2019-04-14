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

    this.requestWrapper.wrap(requestManager);
  }

  /**
   * Registers a new route to Warden
   * @param name
   * @param routeConfiguration
   */
  register(name: string, routeConfiguration: RouteConfiguration) {
    this.requestManager.register(name, routeConfiguration);
  }

  /**
   * Sends a new HTTP Request using warden
   * @param name
   * @param requestOptions
   * @param cb
   */
  request(name: string, requestOptions: RequestOptions, cb: RequestCallback) {
    return this.requestManager.handle(name, requestOptions, cb);
  }

  /**
   * Sets default request configuration
   * @param options
   */
  requestConfig(options: CoreOptions) {
    this.requestWrapper.config(options);
  }

  /**
   * Checks whether route is registered
   * @param name
   */
  isRouteRegistered(name: string) {
    return this.requestManager.isRouteRegistered(name);
  }

  /**
   * Unregisters Route
   * @param name
   */
  unregisterRoute(name: string) {
    this.requestManager.unregister(name);
  }
}

export {
  Warden
};
