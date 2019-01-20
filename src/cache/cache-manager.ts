import {inject, injectable} from "inversify";
import {Configuration} from "../configuration";

@injectable()
class CacheManager {
  private configuration: Configuration;

  constructor(
    @inject(Configuration) configuration: Configuration
  ) {

    this.configuration = configuration;
  }
}

export {
  CacheManager
}
