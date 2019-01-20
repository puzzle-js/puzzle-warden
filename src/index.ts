import "reflect-metadata";

import {Container} from "inversify";
import {CacheManager} from "./cache/cache-manager";
import {Configuration} from "./configuration";
import {Holder} from "./holder";
import {bootstrap} from "./ioc";
import {Network} from "./network";
import {Queue} from "./queue";
import {RequestManager} from "./request-manager";
import {Tokenizer} from "./tokenizer";
import {Warden} from "./warden";

const container = new Container();

bootstrap([
  Configuration,
  Warden,
  Tokenizer,
  CacheManager,
  RequestManager,
  Holder,
  Queue,
  Network,
], container);

export {
  Warden,
  container,
};
