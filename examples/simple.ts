import warden from "../src";

warden.debug = true;

// Returns optional request instance
const route = warden.register('holder', {
  holder: true,
  identifier: '{query.foo}',
});

// You can use the request handler
route({
  url: 'https://postman-echo.com/get?foo=1&bar=1',
  method: 'get',
  json: true
}, (err, res, body) => {
  console.log(body);
});

// // Or you can use warden.request with route name
// warden.request('holder', {
//   url: 'https://postman-echo.com/get?foo=1&bar=2',
//   gzip: true,
//   method: 'get',
//   json: true
// }, (err, res, body) => {
//   console.log(body);
// });
