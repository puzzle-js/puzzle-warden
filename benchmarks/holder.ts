import Benchmark from "benchmark";
import nock from "nock";
import request from "request";
import {warden} from "../src";

const suite = new Benchmark.Suite();
const host = 'https://api.github.com';
const path = '/repos/puzzle-js/puzzle-warden/license';

const scope = nock(host)
  .persist(true)
  .get(path)
  .delay(80)
  .reply(200, {
    key: "mit",
    name: "MIT License",
    spdx_id: "MIT",
    url: "https://api.github.com/licenses/mit",
    node_id: "MDc6TGljZW5zZTEz"
  });

const route = warden.register('raw', {
  holder: true
});

suite.add('Request Module', (deferred: any) => {
  request({
    url: host + path,
    json: true,
    gzip: true,
    method: 'get'
  }, (err, res, body) => {
    if (!err && res) {
      deferred.resolve();
    } else {
      console.log(err);
    }
  });
}, {defer: true});


suite.add('Warden', (deferred: any) => {
  route({
    url: host + path,
    json: true,
    gzip: true,
    method: 'get'
  }, (err, res, body) => {
    if (!err && res) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  });
}, {defer: true});

suite.run({
  async: true
});

suite.on('complete', function print(this: any) {
  for (let i = 0; i < this.length; i++) {
    console.log(this[i].toString());
  }

  console.log('Fastest is', this.filter('fastest').map('name')[0]);
});
