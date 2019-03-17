import {Warden} from "./warden";
import {CacheFactory} from "./cache-factory";
import {RequestManager} from "./request-manager";
import {Tokenizer} from "./tokenizer";
import {StreamFactory} from "./stream-factory";
import {RequestWrapper} from "./request-wrapper";

const request = require('request');

const cacheFactory = new CacheFactory();

const tokenizer = new Tokenizer();
const requestWrapper = new RequestWrapper();
const streamFactory = new StreamFactory(cacheFactory, requestWrapper);
const requestManager = new RequestManager(streamFactory, tokenizer);
const warden = new Warden(requestManager, requestWrapper);


warden.register('test', {
  identifier: '{query.foo1}_{cookie.osman}',
  cache: true,
  holder: true
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

  // const pRes = warden.request('test', {
  //   url: `https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=bar2`,
  //   headers: {
  //     cookie: `osman=${Math.random().toFixed(1)}`
  //   },
  //   method: "get",
  // }, (err, response, body) => {
  //   output++;
  // });

  request({
    name: 'test',
    url: `https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=bar2`,
    headers: {
      cookie: `osman=${Math.random().toFixed(1)}`
    },
    gzip: true,
    json: true,
    method: "get",
  }, (err: any, res: any, data: any) => {
    output++;
  });

  // request(`https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=bar2`, (err,response,done) => {
  //   output++;
  // });

  // if (!pRes) failedToPush++;
  if (!stop) setImmediate(newRequest, 0);
};




// newRequest();
