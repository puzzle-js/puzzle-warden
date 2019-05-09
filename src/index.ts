import {CacheFactory} from "./cache-factory";
import {Tokenizer} from "./tokenizer";
import {RequestWrapper} from "./request-wrapper";
import {StreamFactory} from "./stream-factory";
import {RequestManager} from "./request-manager";
import {Warden} from "./warden";

export {CouchbaseCache} from "./couchbase-cache";

const cacheFactory = new CacheFactory();
const tokenizer = new Tokenizer();
const requestWrapper = new RequestWrapper();
const streamFactory = new StreamFactory(cacheFactory, requestWrapper);
const requestManager = new RequestManager(streamFactory, tokenizer);
const warden = new Warden(requestManager, requestWrapper, cacheFactory);

export {
  warden
};
