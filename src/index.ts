import "reflect-metadata";

import {Container} from "inversify";
import {Warden} from "./warden";
import {bootstrap} from "./ioc";
import {Tokenizer} from "./tokenizer";
import {CacheManager} from "./cache/cache-manager";
import {Configuration} from "./configuration";
import {RequestManager} from "./request-manager";
import {Holder} from "./holder";
import {Queue} from "./queue";
import {Network} from "./network";

const container = new Container();

bootstrap([
  Configuration,
  Warden,
  Tokenizer,
  CacheManager,
  RequestManager,
  Holder,
  Queue,
  Network
], container);


export {
  Warden,
  container
}
