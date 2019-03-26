import {Warden} from "../src/warden";
import {CacheFactory} from "../src/cache-factory";
import {RequestManager} from "../src/request-manager";
import {Tokenizer} from "../src/tokenizer";
import {StreamFactory} from "../src/stream-factory";
import {RequestWrapper} from "../src/request-wrapper";

const request = require('request');

const cacheFactory = new CacheFactory();

const tokenizer = new Tokenizer();
const requestWrapper = new RequestWrapper();
const streamFactory = new StreamFactory(cacheFactory, requestWrapper);
const requestManager = new RequestManager(streamFactory, tokenizer);
const warden = new Warden(requestManager, requestWrapper);


warden.register('test', {
  identifier: 'ty_{query.test}',
  cache: false,
  holder: true
});


let input = 0;
let output = 0;
let failedToPush = 0;
let stop = false;

// setTimeout(() => {
//   stop = true;
//   console.log(`${output}/${failedToPush}/${input}`);
//   console.log(`${(output / 100).toFixed(2)} rps`);
// }, 30000);
let errorCount = 0;
let responseCount = 0;


const newRequest = () => {
  //console.log(`Count: ${input}, Error: ${errorCount}, Success: ${responseCount}`);
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
    url: `https://postman-echo.com?test=${Math.random().toFixed(2)}`,
    gzip: true,
    json: true,
    strictSSL: false,
    // cookie: {},
    method: "get",
  }, (err: any, res: any, data: any) => {
    if (!err && data) {
      responseCount++;
    } else {
      errorCount++;
    }
    console.log(`Count: ${input}, Error: ${errorCount}, Success: ${responseCount}`);
    output++;
  });

  // request(`https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=bar2`, (err,response,done) => {
  //   output++;
  // });

  // if (!pRes) failedToPush++;
  if (input <= 30000) setImmediate(newRequest, 0);
};


newRequest();
