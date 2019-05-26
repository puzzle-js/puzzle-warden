import nock from "nock";
import request from "request";
import {warden} from "../src";
import {Benchmarker} from "./benchmarker";

const host = 'https://api.github.com';
const path = '/repos/puzzle-js/puzzle-warden/license';

nock(host)
  .persist(true)
  .get(path)
  .delay({
    head: 20,
    body: 60
  })
  .query(true)
  .reply(200, {
    key: "mit",
    name: "MIT License",
    spdx_id: "MIT",
    url: "https://api.github.com/licenses/mit",
    node_id: "MDc6TGljZW5zZTEz"
  });

const route = warden.register('raw', {
  holder: true,
  identifier: '{query.foo}'
});
const test = new Benchmarker();

const randomizer = () => {
  Math.random().toFixed(2); // => 1/100
};

test.register('Request Module', () => {
  return new Promise((resolve, reject) => {
    request({
      url: `${host + path}?foo=${randomizer()}`,
      json: true,
      gzip: true,
      method: 'get'
    }, (err, res, body) => {
      if (!err && res) {
        resolve();
      } else {
        reject();
      }
    });
  });
}, 1000);

test.register('Warden', () => {
  return new Promise((resolve, reject) => {
    route({
      url: `${host + path}?foo=${randomizer()}`,
      json: true,
      gzip: true,
      method: 'get'
    }, (err, res, body) => {
      if (!err && res) {
        resolve();
      } else {
        reject();
      }
    });
  });
}, 1000);


test.run(100000, 500);
