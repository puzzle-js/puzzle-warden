import request, {CoreOptions} from "request";
import {RequestManager} from "./request-manager";

const tRequest = (request as any).Request;

interface WardenRappedCoreOptions extends CoreOptions {
  name?: string;
  url: string;
  method: any;
  headers: { [key: string]: string; };
  callback: (err: Error, data: any) => void;
}

class WardenWrappedRequest {
  static requestManager: RequestManager;

  constructor(configuration: WardenRappedCoreOptions) {
    if (configuration.name && WardenWrappedRequest.requestManager.isRouteRegistered(configuration.name)) {
      const requestOptions = Object.assign({headers: {}}, configuration);
      delete requestOptions.callback;
      delete requestOptions.name;
      WardenWrappedRequest.requestManager.handle(
        configuration.name,
        requestOptions,
        configuration.callback
      );
    } else {
      // todo somehow sometimes we fail to stub this and so tests are hang
      return new tRequest(configuration);
    }
  }
}

class RequestWrapper {
  request: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl> | request.DefaultUriUrlRequestApi<request.Request, request.CoreOptions, request.OptionalUriUrl>;

  constructor() {
    this.request = request;
  }

  config(options: CoreOptions) {
    this.request = request.defaults(options);
  }

  wrap(requestManager: RequestManager) {
    WardenWrappedRequest.requestManager = requestManager;
    if (!(request as any).Request.requestManager) {
      (request as any).Request = WardenWrappedRequest;
    }
  }
}

export {
  RequestWrapper,
  WardenWrappedRequest
};
