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
  identifier: 'ty_{query.foo2}_{cookie.osman}',
  cache: true,
  holder: true
});

import https from "https";
const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50
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
const startTime = Date.now();
const requestCount = 6000;
const newRequest = () => {
  input++;
  //
  // warden.request('test', {
  //   url: `https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=${Math.random().toFixed(2)}`,
  //   headers: {
  //     cookie: `osman=${Math.random().toFixed(1)}`
  //   },
  //   gzip: true,
  //   json: true,
  //   method: "get",
  //   agent,
  //   strictSSL: false,
  //   timeout: 1000
  // }, (err, response, data) => {
  //   if (!err && data) {
  //     responseCount++;
  //   } else {
  //     errorCount++;
  //   }
  //   output++;
  //
  //   if(output >= requestCount){
  //     console.log(Date.now() - startTime);
  //   }
  // });
  //
  request({
    url: `https://postman-echo.com/get?foo1=${Math.random().toFixed(2)}&foo2=${Math.random().toFixed(2)}`,
    gzip: true,
    json: true,
    timeout: 1000,
    headers: {
      cookie: `osman=${Math.random().toFixed(1)}`
    },
    agent,
    strictSSL: false,
    method: "get",
  }, (err: any, res: any, data: any) => {
    if (!err && data) {
      responseCount++;
    } else {
      errorCount++;
    }
    output++;

    if(output >= requestCount){
      console.log(Date.now() - startTime);
    }
  });
  if (input <= requestCount) newRequest();
};

newRequest();
setTimeout(() => {}, 100000);
