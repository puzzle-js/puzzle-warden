import "reflect-metadata";

import {Container} from "inversify";
import {Warden} from "./warden";
import {bootstrap} from "./ioc";
import {Tokenizer} from "./tokenizer";
import {Cache} from "./cache/cache";
import {Configuration} from "./configuration";

const container = new Container();

bootstrap([
  Configuration,
  Warden,
  Tokenizer,
  Cache
], container);


export {
  Warden,
  container
}
