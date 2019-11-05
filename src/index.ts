import {CacheFactory} from "./cache-factory";
import {Tokenizer} from "./tokenizer";
import {StreamFactory} from "./stream-factory";
import {RequestManager} from "./request-manager";
import {Warden} from "./warden";



const cacheFactory = new CacheFactory();
const tokenizer = new Tokenizer();
const streamFactory = new StreamFactory(cacheFactory);
const requestManager = new RequestManager(streamFactory, tokenizer);
const warden = new Warden(requestManager, cacheFactory);


export = warden;
