import request from "request";
import * as https from "https";

class RequestWrapper {
  request: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl> | request.DefaultUriUrlRequestApi<request.Request, request.CoreOptions, request.OptionalUriUrl>;

  constructor(
    options?: request.CoreOptions
  ) {
    if (options) {
      this.request = request.defaults(options);
    }

    this.request = request;
  }

  private() {

  }
}

export {
  RequestWrapper
};
