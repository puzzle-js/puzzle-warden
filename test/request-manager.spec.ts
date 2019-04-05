import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {RequestManager, RequestOptions, RouteConfiguration} from "../src/request-manager";
import {CacheFactory} from "../src/cache-factory";
import {StreamFactory, StreamType} from "../src/stream-factory";
import {Tokenizer} from "../src/tokenizer";
import faker from "faker";
import {RequestWrapper} from "../src/request-wrapper";

const sandbox = sinon.createSandbox();

const cacheFactory = new CacheFactory();
const requestWrapper = new RequestWrapper();
const streamFactory = new StreamFactory(cacheFactory, requestWrapper);
const tokenizer = new Tokenizer();


let streamFactoryMock: SinonMock;
let requestWrapperMock: SinonMock;
let tokenizerMock: SinonMock;
let requestManager: RequestManager;

describe("[request-manager]", () => {
  beforeEach(() => {
    streamFactoryMock = sandbox.mock(streamFactory);
    tokenizerMock = sandbox.mock(tokenizer);
    requestWrapperMock = sandbox.mock(requestWrapper);

    requestManager = new RequestManager(streamFactory, tokenizer);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Request Manager", () => {
    // Arrange
    const requestManager = new RequestManager(streamFactory, tokenizer);

    // Assert
    expect(requestManager).to.be.instanceOf(RequestManager);
  });

  it("should register new route without any plugin", () => {
    // Arrange
    const name = faker.random.word();
    const routeConfiguration = {
      identifier: faker.random.word()
    } as RouteConfiguration;
    const headStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const networkStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const keyMaker = sandbox.stub();
    streamFactoryMock.expects('create').withExactArgs(StreamType.HEAD).returns(headStream);
    streamFactoryMock.expects('create').withExactArgs(StreamType.NETWORK).returns(networkStream);
    tokenizerMock.expects('tokenize').withExactArgs(name, routeConfiguration.identifier).returns(keyMaker);

    // Act
    requestManager.register(name, routeConfiguration);

    // Assert
    expect(headStream.connect.calledWithExactly(networkStream)).to.eq(true);
  });

  it("should register new route without any plugin with boolean false", () => {
    // Arrange
    const name = faker.random.word();
    const routeConfiguration = {
      identifier: faker.random.word(),
      cache: false,
      holder: false
    } as RouteConfiguration;
    const headStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const networkStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const keyMaker = sandbox.stub();
    streamFactoryMock.expects('create').withExactArgs(StreamType.HEAD).returns(headStream);
    streamFactoryMock.expects('create').withExactArgs(StreamType.NETWORK).returns(networkStream);
    tokenizerMock.expects('tokenize').withExactArgs(name, routeConfiguration.identifier).returns(keyMaker);

    // Act
    requestManager.register(name, routeConfiguration);

    // Assert
    expect(headStream.connect.calledWithExactly(networkStream)).to.eq(true);
  });

  it("should register new route with a plugin", () => {
    // Arrange
    const name = faker.random.word();
    const routeConfiguration = {
      identifier: faker.random.word(),
      cache: true
    } as RouteConfiguration;
    const headStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const networkStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const cacheStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const keyMaker = sandbox.stub();
    streamFactoryMock.expects('create').withExactArgs(StreamType.HEAD).returns(headStream);
    streamFactoryMock.expects('create').withExactArgs(StreamType.NETWORK).returns(networkStream);
    streamFactoryMock.expects('create').withExactArgs(StreamType.CACHE, routeConfiguration.cache).returns(cacheStream);
    tokenizerMock.expects('tokenize').withExactArgs(name, routeConfiguration.identifier).returns(keyMaker);

    // Act
    requestManager.register(name, routeConfiguration);

    // Assert
    expect(headStream.connect.calledWithExactly(cacheStream)).to.eq(true);
    expect(cacheStream.connect.calledWithExactly(networkStream)).to.eq(true);
  });

  it("should handle new requests", () => {
    // Arrange
    const name = faker.random.word();
    const requestOptions: RequestOptions = {
      url: faker.internet.url(),
      headers: {},
      method: 'get'
    };
    const routeConfiguration = {
      identifier: faker.random.word()
    } as RouteConfiguration;
    const headStream = {
      connect: sandbox.stub().returnsArg(0),
      start: sandbox.stub()
    };
    const networkStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const key = faker.random.word();
    const keyMaker = sandbox.stub().returns(key);
    streamFactoryMock.expects('create').withExactArgs(StreamType.HEAD).returns(headStream);
    streamFactoryMock.expects('create').withExactArgs(StreamType.NETWORK).returns(networkStream);
    tokenizerMock.expects('tokenize').withExactArgs(name, routeConfiguration.identifier).returns(keyMaker);
    const stub = sandbox.stub();

    // Act
    requestManager.register(name, routeConfiguration);
    requestManager.handle(name, requestOptions, stub);

    // Assert
    expect(headStream.start.calledWithExactly(key, requestOptions, stub)).to.eq(true);
  });


  it("should handle request without custom headers", () => {
// Arrange
    const name = faker.random.word();
    const requestOptions: RequestOptions = {
      url: faker.internet.url(),
      method: 'get'
    };
    const routeConfiguration = {
      identifier: faker.random.word()
    } as RouteConfiguration;
    const headStream = {
      connect: sandbox.stub().returnsArg(0),
      start: sandbox.stub()
    };
    const networkStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const key = faker.random.word();
    const keyMaker = sandbox.stub().returns(key);
    streamFactoryMock.expects('create').withExactArgs(StreamType.HEAD).returns(headStream);
    streamFactoryMock.expects('create').withExactArgs(StreamType.NETWORK).returns(networkStream);
    tokenizerMock.expects('tokenize').withExactArgs(name, routeConfiguration.identifier).returns(keyMaker);
    const stub = sandbox.stub();

    // Act
    requestManager.register(name, routeConfiguration);
    requestManager.handle(name, requestOptions, stub);

    // Assert
    expect(headStream.start.calledWith(key, requestOptions, stub)).to.eq(true);
  });

  it("should throw error if not registered route tries to handle", () => {
    // Act
    const test = () => {
      requestManager.handle(faker.random.word(), {} as any, sandbox.stub());
    };

    // Assert
    expect(test).to.throw();
  });

  it("should return if route already registered", () => {
    // Arrange
    const name = faker.random.word();
    const routeConfiguration = {
      identifier: faker.random.word()
    } as RouteConfiguration;
    const headStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const networkStream = {
      connect: sandbox.stub().returnsArg(0)
    };
    const keyMaker = sandbox.stub();
    streamFactoryMock.expects('create').withExactArgs(StreamType.HEAD).returns(headStream);
    streamFactoryMock.expects('create').withExactArgs(StreamType.NETWORK).returns(networkStream);
    tokenizerMock.expects('tokenize').withExactArgs(name, routeConfiguration.identifier).returns(keyMaker);

    // Act
    requestManager.register(name, routeConfiguration);
    const isRegistered = requestManager.isRouteRegistered(name);

    // Assert
    expect(headStream.connect.calledWithExactly(networkStream)).to.eq(true);
    expect(isRegistered).to.eq(true);
  });
});
