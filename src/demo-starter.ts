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

warden.register('test', {
  identifier: '{query.foo1}_{cookie.osman}',
  cache: false,
  holder: false
});

let input = 0;
let output = 0;
let failedToPush = 0;
let stop = false;

setTimeout(() => {
  stop = true;
  console.log(`${output}/${failedToPush}/${input}`);
  console.log(`${(output / 100).toFixed(2)} rps`);
}, 30000);


const newRequest = () => {
  input++;

  const pRes = warden.request('test', {
    url: `https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=bar2`,
    headers: {
      cookie: `osman=${Math.random().toFixed(1)}`
    },
    method: "get",
  }, (err, response, body) => {
    output++;
  });

  // request(`https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=bar2`, (err,response,done) => {
  //   output++;
  // });

  if (!pRes) failedToPush++;
  if (!stop) setImmediate(newRequest, 0);

};


newRequest();
