import "reflect-metadata";
import sinon from "sinon";
import {expect} from "chai";
import faker from "faker";
import Couchbase from "couchbase";
import {CouchbaseOptions} from "../../../src/cache/plugins/cache-plugin";
import {CouchbaseCache} from "../../../src/cache/plugins/couchbase";
const sandbox = sinon.createSandbox();

const optionsFactory = (): CouchbaseOptions => {
  return {
    cluster: faker.random.word(),
    username: faker.random.word(),
    password: faker.random.word(),
    bucket: faker.random.word()
  };
};

class MockClusterClass{
  authenticate(username: string, password: string){}
  openBucket(bucket: string): string{
    return bucket;
  }
}

describe("[couchbase.ts]", () => {
  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create correct couchbaseCache with given options", () => {
    // Arrange
    const options : CouchbaseOptions = optionsFactory();
    // Act
    const couchbaseCache = new CouchbaseCache(options);
    // Assert
    expect(couchbaseCache.options).to.deep.eq(options);
    expect(couchbaseCache.getBucket()).to.eq(null);
    expect(couchbaseCache.getCluster()).to.eq(null);
  });

  it("should connect to couchbase server", () => {
    // Arrange
    const options : CouchbaseOptions = optionsFactory();
    const couchbaseCache = new CouchbaseCache(options);
    const mockClusterClass = new MockClusterClass();
    // Act

    sinon.stub(Couchbase, "Cluster").returns(mockClusterClass);

    couchbaseCache.connect().then( () => {
      // Assert
      expect(couchbaseCache.getCluster()).to.eq(mockClusterClass);
      expect(couchbaseCache.options.bucket).to.eq(options.bucket);
    });

  });
});
