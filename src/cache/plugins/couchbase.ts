import {CachePlugin, CouchbaseOptions} from "./cache-plugin";
import Couchbase from "couchbase";

export class CouchbaseCache extends CachePlugin {

  private readonly options: CouchbaseOptions;
  private cluster: Couchbase.Cluster | null;
  private bucket: Couchbase.Bucket | null;

  constructor(options: CouchbaseOptions){
    super();
    this.bucket = null;
    this.cluster = null;
    this.options = options;
  }

  get(key: string): Promise<string> | null | string{
    return new Promise((resolve, reject) => {
      if(!this.bucket) return reject();
      this.bucket.get(key, function (err, result) {
        if(err) {
            return reject(err);
        }
        return resolve(result.value);
      });
    });
  }

  set(key: string, value: any): Promise<void> {
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

  connect(): void{
    this.cluster = new Couchbase.Cluster(this.options.cluster);
    this.cluster.authenticate(this.options.username, this.options.password);
    this.bucket = this.cluster.openBucket(this.options.bucket);
  }

  getOptions(): CouchbaseOptions {
    return this.options;
  }
  getCluster(): Couchbase.Cluster | null {
    return this.cluster;
  }
  getBucket(): Couchbase.Bucket | null {
    return this.bucket;
  }

}
