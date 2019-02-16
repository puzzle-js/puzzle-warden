import {Warden} from "./warden";
import {CacheFactory} from "./cache-factory";
import {RequestManager} from "./request-manager";
import {Tokenizer} from "./tokenizer";
import {StreamFactory} from "./stream-factory";

const cacheFactory = new CacheFactory();

const tokenizer = new Tokenizer();
const streamFactory = new StreamFactory(cacheFactory);
const requestManager = new RequestManager(streamFactory, tokenizer);
const warden = new Warden(requestManager);

const stream: any = warden.register('test', {
  identifier: '{query.pid}',
  cache: {
    duration: 200
  }
});


// stream.rightStream.push({
//   identifier: 'test',
//   key: 'test'
// });
//
//
// stream.rightStream.push({
//   identifier: 'test',
//   key:'test'
// });

let input = 0;
let output = 0;
setInterval(() => {
  input++;
  warden.request('test', {
    url: 'https://www.trendyol.com?pid='+Math.random().toFixed(2),
    headers: {},
    method: "get"
  }, (err, response, body) => {
    output++;
  });
}, 0);


setTimeout(() => {
  console.log(`${output}/${input}`);
  process.kill(0)
}, 2000);
