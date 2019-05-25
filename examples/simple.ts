import {warden} from "../src";

const request = warden.register('echo_with_holder', {
  holder: true
});

request({
  url: 'https://postman-echo.com/get?foo1=bar1&foo2=bar2',
  gzip: true,
  headers: {
    'wow': 'yeah'
  },
  json:true,
  method: 'get',
}, (err, res, body) => {
  console.log(body);
});
