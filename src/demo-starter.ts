import {Warden} from "./warden";
import {CacheFactory} from "./cache-factory";

const cacheFactory = new CacheFactory();
const warden = new Warden(cacheFactory);


const stream = warden.setRoute('test', {
  identifier: 'test_${cookies_test3}',
  cache: {
    duration: 200
  }
});
