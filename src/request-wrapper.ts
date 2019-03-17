import request, {CoreOptions} from "request";
import {RequestManager} from "./request-manager";

const tRequest = (request as any).Request;

interface WardenRappedCoreOptions extends CoreOptions {
  name?: string;
  url?: string;
}

class WardenWrappedRequest {
  static requestManager: RequestManager;

  constructor(configuration: WardenRappedCoreOptions) {
    if (configuration.name) {
      const requestOptions = {...configuration, name: null};
      (WardenWrappedRequest.requestManager.handle as any)(configuration.name, requestOptions, configuration.callback);
    } else {
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
    if (!(request as any).Request.warden) {
      (request as any).Request = WardenWrappedRequest;
    }
  }
}

export {
  RequestWrapper,
  WardenWrappedRequest
};
