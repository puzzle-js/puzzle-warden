import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {StreamFactory, StreamType} from "../src/stream-factory";
import {Cache, CacheFactory} from "../src/cache-factory";
import {CacheThenNetwork} from "../src/cache-then-network";

const sandbox = sinon.createSandbox();

const cacheFactory = new CacheFactory();

let cacheFactoryMock: SinonMock;
let streamFactory: StreamFactory;

describe("[stream-factory.ts]", () => {
  beforeEach(() => {
    cacheFactoryMock = sandbox.mock(cacheFactory);

    streamFactory = new StreamFactory(cacheFactory);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Stream Factory", () => {
    // Arrange
    const streamFactory = new StreamFactory(cacheFactory);

    // Assert
    expect(streamFactory).to.be.instanceOf(StreamFactory);
  });

  it("should return new cache instance", () => {
    // Act
    const cacheResponse = {};
    cacheFactoryMock.expects('create').returns(cacheResponse);
    const cache = streamFactory.create<Cache>(StreamType.CACHE);

    // Assert
    expect(cache).to.eq(cacheResponse);
  });
});
