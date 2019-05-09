import * as sinon from "sinon";
import * as faker from "faker";
import {expect} from "chai";
import {Cluster, Bucket} from "couchbase";
import {CouchbaseCache} from "../src/couchbase-cache";

const sandbox = sinon.createSandbox();
let couchbase: CouchbaseCache;

const createBucket = (connects = true) => ({
  on: sandbox.stub()
    .withArgs(connects ? 'connect' : 'error')
    .callsArg(1),
  authenticate: () => {
    throw new Error('Mocked method call');
  },
  get: (key: string, cb: any) => {
    throw new Error('Mocked method call');
  },
  insert: (key: string, value: any, options: any, cb: any) => {
    throw new Error('Mocked method call');
  },
  operationTimeout: 0
});

describe('[couchbase.ts]', () => {
  beforeEach(() => {
    couchbase = new CouchbaseCache({
      host: faker.random.word(),
      bucketName: faker.random.word()
    });
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should create new CouchbaseCache', () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const couchbase = new CouchbaseCache({host, bucketName});

    // Assert
    expect(couchbase).to.be.instanceOf(CouchbaseCache);
  });

  it('should connect couchbase bucket without authorization', async () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const couchbase = new CouchbaseCache({host, bucketName});
    const bucket = createBucket();
    const spy = sandbox.stub(Cluster.prototype, 'openBucket').returns(bucket as any);

    // Act
    await couchbase.connect();

    // Assert
    expect(spy.calledWithExactly(bucketName)).to.eq(true);
  });

  it('should connect couchbase bucket with authorization', async () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const username = faker.random.word();
    const password = faker.random.word();
    const couchbase = new CouchbaseCache({host, bucketName, username, password});
    const bucket = createBucket();
    const spy = sandbox.stub(Cluster.prototype, 'openBucket').returns(bucket as any);

    // Act
    await couchbase.connect();

    // Assert
    expect(spy.calledWithExactly(bucketName)).to.eq(true);
  });

  it('should return cached content if it is valid', async () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const username = faker.random.word();
    const password = faker.random.word();
    const key = faker.random.word();
    const couchbase = new CouchbaseCache({host, bucketName, username, password});
    const bucket = createBucket();
    const data = faker.random.word();
    sandbox.stub(Cluster.prototype, 'openBucket').returns(bucket as any);
    const getSpy = sandbox.stub(bucket, 'get')
      .callsArgWith(1, null, data);

    // Act
    await couchbase.connect();
    const item = await couchbase.get(key);

    // Assert
    expect(getSpy.calledWith(key, sinon.match.func)).to.eq(true);
    expect(item).to.eq(data);
  });

  it('should return null content if it is not valid', async () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const username = faker.random.word();
    const password = faker.random.word();
    const key = faker.random.word();
    const couchbase = new CouchbaseCache({host, bucketName, username, password});
    const bucket = createBucket();
    sandbox.stub(Cluster.prototype, 'openBucket').returns(bucket as any);
    const getSpy = sandbox.stub(bucket, 'get')
      .callsArgWith(1, null, null);

    // Act
    await couchbase.connect();
    const item = await couchbase.get(key);

    // Assert
    expect(getSpy.calledWith(key, sinon.match.func)).to.eq(true);
    expect(item).to.eq(null);
  });

  it('should return null content on error', async () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const username = faker.random.word();
    const password = faker.random.word();
    const key = faker.random.word();
    const couchbase = new CouchbaseCache({host, bucketName, username, password});
    const bucket = createBucket();
    sandbox.stub(Cluster.prototype, 'openBucket').returns(bucket as any);
    const getSpy = sandbox.stub(bucket, 'get')
      .callsArgWith(1, 'error');

    // Act
    await couchbase.connect();
    const item = await couchbase.get(key);

    // Assert
    expect(getSpy.calledWith(key, sinon.match.func)).to.eq(true);
    expect(item).to.eq(null);
  });

  it('should set content', async () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const username = faker.random.word();
    const password = faker.random.word();
    const key = faker.random.word();
    const couchbase = new CouchbaseCache({host, bucketName, username, password});
    const bucket = createBucket();
    const data = faker.random.word();
    sandbox.stub(Cluster.prototype, 'openBucket').returns(bucket as any);
    const getSpy = sandbox.stub(bucket, 'insert')
      .callsArg(3);

    // Act
    await couchbase.connect();
    await couchbase.set(key, data);

    // Assert
    expect(getSpy.calledWith(key, data, {
      expiry: undefined
    }, sinon.match.func)).to.eq(true);
  });

  it('should set content with ttl', async () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const username = faker.random.word();
    const password = faker.random.word();
    const key = faker.random.word();
    const couchbase = new CouchbaseCache({host, bucketName, username, password});
    const bucket = createBucket();
    const data = faker.random.word();
    const ttl = faker.random.number();
    sandbox.stub(Cluster.prototype, 'openBucket').returns(bucket as any);
    const getSpy = sandbox.stub(bucket, 'insert')
      .callsArg(3);

    // Act
    await couchbase.connect();
    await couchbase.set(key, data, ttl);

    // Assert
    expect(getSpy.calledWith(key, data, {
      expiry: Math.floor(ttl / 1000)
    }, sinon.match.func)).to.eq(true);
  });

  it('should set operation timeout', async () => {
    // Arrange
    const host = faker.random.word();
    const bucketName = faker.random.word();
    const username = faker.random.word();
    const password = faker.random.word();
    const timeout = faker.random.number();
    const bucket = createBucket();
    sandbox.stub(Cluster.prototype, 'openBucket').returns(bucket as any);

    // Act
    const couchbase = new CouchbaseCache({host, bucketName, username, password, timeout});
    await couchbase.connect();

    // Assert
    expect(bucket.operationTimeout).to.eq(timeout);
  });
});