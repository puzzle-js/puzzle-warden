import "reflect-metadata";

import {Container} from "inversify";
import {Configuration} from "./configuration";
import {bootstrap, register} from "./ioc";
import {Network} from "./network";
import {Queue} from "./queue";
import {RequestManager} from "./request-manager";
import {Tokenizer} from "./tokenizer";
import {Warden} from "./warden";
import {CachePluginType} from "./cache/cache";
import {MemoryCache} from "./cache/plugins/memory";
import {CouchbaseCache} from "./cache/plugins/couchbase";
import {CacheFactory} from "./cache/cache-factory";

const container = new Container();

register(CachePluginType.Memory, MemoryCache, container);
register(CachePluginType.Couchbase, CouchbaseCache, container);

bootstrap([
  Configuration,
  Warden,
  Tokenizer,
  RequestManager,
  Queue,
  CacheFactory,
  Network,
], container);

export {
  Warden,
  container,
};
