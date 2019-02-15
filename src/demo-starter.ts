import {Warden} from "./warden";
import {CacheFactory} from "./cache-factory";

const cacheFactory = new CacheFactory();
const warden = new Warden(cacheFactory);

const stream: any = warden.setRoute('test', {
  identifier: 'test_${cookies_test3}',
  cache: {
    duration: 200
  }
});


//
//
// let input = 0;
// let response = 0;
//
// setInterval(() => {
//   stream.rightStream.push({
//     identifier: 'test',
//     key: Math.random().toFixed(1)
//   });
//   input++;
// }, 0);
//
// stream.leftStream.on('data', () => {
//   response++;
// });
//
//
// setTimeout(() => {
//   console.log(`${response}/${input}`);
//   process.kill(0);
// }, 3000);
