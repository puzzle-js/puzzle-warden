import {inject, injectable} from "inversify";
import {Holder} from "./holder";
import {Configuration} from "./configuration";
import {Queue} from "./queue";
import {Network} from "./network";
import {CacheManager} from "./cache/cache-manager";

interface IWardenRequest {

}

@injectable()
class RequestManager {
  private configuration: Configuration;
  private holder: Holder;
  private network: Network;
  private queue: Queue;
  private cacheManager: CacheManager;

  constructor(
    @inject(Configuration) configuration: Configuration,
    @inject(Holder) holder: Holder,
    @inject(CacheManager) cacheManager: CacheManager,
    @inject(Queue) queue: Queue,
    @inject(Network) network: Network
  ) {
    this.configuration = configuration;
    this.holder = holder;
    this.cacheManager = cacheManager;
    this.queue = queue;
    this.network = network;
  }

  async handle(request: IWardenRequest, cb: () => Promise<string | object>) {

  }
}

export {
  IWardenRequest,
  RequestManager
}
