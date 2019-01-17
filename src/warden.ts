import {inject, injectable} from "inversify";
import {Cache} from "./cache/cache";

@injectable()
export class Warden {
  private cache: Cache;

  constructor(
    @inject(Cache) cache: Cache
  ){

    this.cache = cache;
  }
}

