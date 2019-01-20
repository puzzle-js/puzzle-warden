import {CachePlugin, CouchbaseOptions} from "./cache-plugin";
import Couchbase from "couchbase";

class CouchbaseCache extends CachePlugin {

  public readonly options: CouchbaseOptions;
  private cluster: Couchbase.Cluster | null;
  private bucket: Couchbase.Bucket | null;

  constructor(options: CouchbaseOptions){
    super();
    this.bucket = null;
    this.cluster = null;
    this.options = options;
  }

  get(key: string): Promise<string> | null {
    return new Promise((resolve, reject) => {
      if(!this.bucket) return reject();
      this.bucket.get(key, (err, result) => {
        if(err) {
            return reject(err);
        }
        return resolve(result.value);
      });
    });
  }

  set(key: string, value: object | string): Promise<void> {
    return new Promise( (resolve, reject) => {
      if(!this.bucket) return reject();
      this.bucket.upsert(key, value, (err, result) => {
        if(err){
            return reject(err);
        }
        return resolve(result);
      });
    });
  }

  connect(): Promise<void>{
    return new Promise((resolve, reject) => {
      this.cluster = new Couchbase.Cluster(this.options.cluster);
      this.cluster.authenticate(this.options.username, this.options.password);
      this.bucket = this.cluster.openBucket(this.options.bucket, (err: Couchbase.CouchbaseError) => {
        if(err){
          return reject(err);
        }
        return resolve();
      });
    });
  }

  getCluster(): Couchbase.Cluster | null {
    return this.cluster;
  }
  getBucket(): Couchbase.Bucket | null {
    return this.bucket;
  }

}

export {
  CouchbaseCache,
};
