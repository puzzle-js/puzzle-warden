import {Warden} from "./warden";
import {CacheFactory} from "./cache-factory";
import {performance} from "perf_hooks";

const cacheFactory = new CacheFactory();
const warden = new Warden(cacheFactory);


const stream = warden.setRoute('test', {
  identifier: 'test_${cookies_test3}',
  cache: {
    duration: 200
  }
});


setInterval(() => {
  stream.readStream.push({
    identifier: 'test',
    key: 123123,
    startMs: performance.now(),
  });
}, 20);



