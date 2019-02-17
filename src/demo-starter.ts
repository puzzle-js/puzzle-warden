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
  identifier: '{query.foo1}',
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
let failedToPush = 0;
setInterval(() => {
  input++;

  const pRes = warden.request('test', {
    url: `https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=bar2`,
    headers: {},
    method: "get"
  }, (err, response, body) => {
    output++;
  });

  if(!pRes) failedToPush++;
}, 0);


setTimeout(() => {
  console.log(`${output}/${failedToPush}/${input}`);
  process.kill(0);
}, 6000);
