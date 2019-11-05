import {RequestManager, WardenRequestOptions, RouteConfiguration} from "./request-manager";
import {CacheFactory, CachePlugin} from "./cache-factory";
import {RequestCallback} from "./streamer";

class Warden {
  static debug = false;
  private requestManager: RequestManager;
  private cacheFactory: CacheFactory;

  constructor(
    requestManager: RequestManager,
    cacheFactory: CacheFactory
  ) {
    this.requestManager = requestManager;
    this.cacheFactory = cacheFactory;
  }

  get debug(): boolean {
    return Warden.debug;
  }

  set debug(enabled: boolean) {
    Warden.debug = enabled;
  }

  /**
   * Registers a new route to Warden
   * @param name
   * @param routeConfiguration
   */
  register(name: string, routeConfiguration: RouteConfiguration) {
    return this.requestManager.register(name, routeConfiguration);
  }

  /**
   * Sends a new HTTP Request using warden
   * @param name
   * @param requestOptions
   * @param cb
   */
  request(name: string, requestOptions: WardenRequestOptions, cb: RequestCallback) {
    return this.requestManager.handle(name, requestOptions, cb);
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
