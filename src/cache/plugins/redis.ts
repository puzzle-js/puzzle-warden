import {CachePlugin, RedisOptions} from "./cache-plugin";
import Redis, {RedisClient} from "redis";

export class RedisCache extends CachePlugin {

  private readonly options: RedisOptions;
  private client: null | RedisClient;

  constructor(options: RedisOptions){
    super();
    this.options = options;
    this.client = null;
  }

  get(key: string): Promise<string> | null {
    return new Promise((resolve, reject) => {
      if(!this.client) return reject(null);
      this.client.get(key, (err, result) => {
        if(err){
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  set(key: string, value: any): Promise<void> {
    return new Promise( (resolve, reject) => {
      if(!this.client) return reject(null);
      this.client.set(key, value);
    });
  }

  connect(): void {
    this.client = Redis.createClient(this.options.port, this.options.host);
    this.client.on('connect', () => {
      console.log('Redis client on');
    });
    this.client.on('error', () => {
      console.log('Redis Error');
    })
  }

  getOptions(): RedisOptions {
    return this.options;
  }

}
