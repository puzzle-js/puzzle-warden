import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {StreamFactory, StreamType} from "../src/stream-factory";
import {Cache, CacheFactory} from "../src/cache-factory";
import {RequestWrapper} from "../src/request-wrapper";
import {Holder} from "../src/holder";
import {StreamHead} from "../src/stream-head";
import {Network} from "../src/network";
import faker from "faker";

const sandbox = sinon.createSandbox();

const requestWrapper = new RequestWrapper();
const cacheFactory = new CacheFactory();

let cacheFactoryMock: SinonMock;
let requestWrapperMock: SinonMock;


let streamFactory: StreamFactory;

describe("[stream-factory.ts]", () => {
  beforeEach(() => {
    cacheFactoryMock = sandbox.mock(cacheFactory);
    requestWrapperMock = sandbox.mock(requestWrapper);

    streamFactory = new StreamFactory(cacheFactory, requestWrapper);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Stream Factory", () => {
    // Arrange
    const streamFactory = new StreamFactory(cacheFactory, requestWrapper);

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

  it("should return new Holder instance", () => {
    // Act
    const holder = streamFactory.create<Holder>(StreamType.HOLDER);

    // Assert
    expect(holder).to.be.instanceOf(Holder);
  });

  it("should return new StreamHead type", () => {
    // Act
    const head = streamFactory.create<StreamHead>(StreamType.HEAD);

    // Assert
    expect(head).to.be.instanceOf(StreamHead);
  });

  it("should return new Network", () => {
    // Act
    const network = streamFactory.create<Network>(StreamType.NETWORK);

    // Assert
    expect(network).to.be.instanceOf(Network);
  });


  it("should throw error when request stream type is unkonwn", () => {
    // Arrange
    const test = () => {
      streamFactory.create(faker.random.word());
    };

    // Assert
    expect(test).to.throw();
  });
});
