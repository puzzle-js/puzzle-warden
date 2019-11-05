import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {StreamFactory, StreamType} from "../src/stream-factory";
import {CacheFactory} from "../src/cache-factory";
import {Holder} from "../src/holder";
import faker from "faker";
import {StreamHead} from "../src/stream-head";
import {Network} from "../src/network";
import {Retry} from "../src/retry";
import {SchemaStringifier, SchemaStringifierConfiguration} from "../src/schema-stringifier";

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
    const configuration = {};
    const cacheResponse = {};
    cacheFactoryMock.expects('create').returns(cacheResponse);
    const cache = streamFactory.create<Cache>(StreamType.CACHE, configuration);

    // Assert
    expect(cache).to.eq(cacheResponse);
  });

  it("should return new Holder instance", () => {
    // Act
    const configuration = {};
    const holder = streamFactory.create<Holder>(StreamType.HOLDER, configuration);

    // Assert
    expect(holder).to.be.instanceOf(Holder);
  });

  it("should return new Retry instance", () => {
    // Act
    const configuration = {};
    const retry = streamFactory.create<Retry>(StreamType.RETRY, configuration);

    // Assert
    expect(retry).to.be.instanceOf(Retry);
  });

  it("should return new Head instance", () => {
    // Act
    const head = streamFactory.createHead();

    // Assert
    expect(head).to.be.instanceOf(StreamHead);
  });

  it("should return new Network instance", () => {
    // Act
    const network = streamFactory.createNetwork();

    // Assert
    expect(network).to.be.instanceOf(Network);
  });

  it("should return new SchemaStringifier instance", () => {
    // Act
    const schemaOptions = {
      type: 'object',
      properties: {
        test: {
          type: 'number'
        }
      }
    } as SchemaStringifierConfiguration;
    const schemaStringifier = streamFactory.create<SchemaStringifier>(StreamType.SCHEMA_STRINGIFIER, schemaOptions);

    // Assert
    expect(schemaStringifier).to.be.instanceOf(SchemaStringifier);
  });


  it("should throw error when request stream type is unknown", () => {
    // Arrange
    const configuration = {};
    const test = () => {
      streamFactory.create(faker.random.word(), configuration);
    };

    // Assert
    expect(test).to.throw();
  });
});
