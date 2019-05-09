import {RequestManager, RequestOptions, RouteConfiguration} from "./request-manager";
import {CoreOptions, RequestCallback} from "request";
import {RequestWrapper} from "./request-wrapper";
import {CacheFactory, CachePlugin} from "./cache-factory";

class Warden {
  private requestManager: RequestManager;
  private requestWrapper: RequestWrapper;
  private cacheFactory: CacheFactory;

  constructor(
    requestManager: RequestManager,
    requestWrapper: RequestWrapper,
    cacheFactory: CacheFactory
  ) {
    this.requestManager = requestManager;
    this.requestWrapper = requestWrapper;
    this.cacheFactory = cacheFactory;

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

  /**
   * @param name
   * @param plugin
   */
  registerCachePlugin(name: string, plugin: CachePlugin | (new() => CachePlugin)) {
    this.cacheFactory.register(name, plugin);
  }
}

export {
  Warden
};
