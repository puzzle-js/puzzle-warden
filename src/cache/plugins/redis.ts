import {CachePlugin, RedisOptions} from "./cache-plugin";
import Redis, {RedisClient} from "redis";
import {injectable} from "inversify";

@injectable()
class RedisCache extends CachePlugin {
  private readonly options: RedisOptions;
  private client: null | RedisClient;

  constructor(options: RedisOptions) {
    super();
    this.options = options;
    this.client = null;
  }

  get(key: string): Promise<string> | null {
    return new Promise((resolve, reject) => {
      if (!this.client) return reject(null);
      this.client.get(key, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  set(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) return reject(null);
      this.client.set(key, value);
    });
  }

  connect(): Promise<void> | void {
    return new Promise((resolve, reject) => {
      this.client = Redis.createClient(this.options.port, this.options.host);

      this.client.on('connect', () => {
        return resolve();
      });

      this.client.on('error', () => {
        return reject();
      });

    });

  }

  getOptions(): RedisOptions {
    return this.options;
  }

}

export {
  RedisCache,
};
