import {warden} from "../src";
import request from "request";

// Returns optional request instance
const route = warden.register('holder', {
  holder: false,
  identifier: '{query.foo}'
});

// You can use the request handler
route({
  url: 'https://postman-echo.com/get?foo=1&bar=1',
  gzip: true,
  method: 'get'
}, (err, res, body) => {
  console.log(body);
});

// Or you can use warden.request with route name
warden.request('holder', {
  url: 'https://postman-echo.com/get?foo=1&bar=2',
  gzip: true,
  method: 'get'
}, (err, res, body) => {
  console.log(body);
});

// Or you can use request module with name
request({
  name: 'holder',
  url: 'https://postman-echo.com/get?foo=1&bar=3',
  gzip: true,
  method: 'get'
} as any, (err: any, res: any, body: any) => {
  console.log(body);
});