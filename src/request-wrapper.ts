import request, {CoreOptions} from "request";

class RequestWrapper {
  request: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl> | request.DefaultUriUrlRequestApi<request.Request, request.CoreOptions, request.OptionalUriUrl>;

  constructor() {
    this.request = request;
  }

  config(options: CoreOptions) {
    this.request = request.defaults(options);
  }
}

export {
  RequestWrapper
};
