import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {Warden} from "../src/warden";
import {CacheFactory} from "../src/cache-factory";
import {RequestManager, WardenRequestOptions, RouteConfiguration} from "../src/request-manager";
import {Tokenizer} from "../src/tokenizer";
import {StreamFactory} from "../src/stream-factory";
import faker from "faker";

const sandbox = sinon.createSandbox();

const tokenizer = new Tokenizer();
const cacheFactory = new CacheFactory();
const streamFactory = new StreamFactory(cacheFactory);
const requestManager = new RequestManager(streamFactory, tokenizer);


let requestManagerMock: SinonMock;
let cacheFactoryMock: SinonMock;

describe("[warden.ts]", () => {
  beforeEach(() => {
    requestManagerMock = sandbox.mock(requestManager);
    cacheFactoryMock = sandbox.mock(cacheFactory);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Warden instance", () => {
    // Arrange
    const warden = new Warden(requestManager, cacheFactory);

    // Assert
    expect(warden).to.be.instanceOf(Warden);
  });

  it("should call handle on new request", () => {
    // Arrange
    const routeName = faker.random.word();
    const requestOptions = {} as WardenRequestOptions;
    const callback = sandbox.stub();
    const warden = new Warden(requestManager, cacheFactory);
    requestManagerMock
      .expects('handle')
      .withExactArgs(routeName, requestOptions, callback);

    // Act
    warden.request(routeName, requestOptions, callback);
  });

  it("should register new route calling request manager", () => {
    // Arrange
    const routeName = faker.random.word();
    const routeOptions = {} as RouteConfiguration;
    const warden = new Warden(requestManager, cacheFactory);
    requestManagerMock
      .expects('register')
      .withExactArgs(routeName, routeOptions);

    // Act
    warden.register(routeName, routeOptions);
  });

  it("should return if route is registered", () => {
    // Arrange
    const name = faker.random.word();
    const warden = new Warden(requestManager, cacheFactory);
    requestManagerMock.expects('isRouteRegistered').withArgs(name).returns(false);

    // Act
    const status = warden.isRouteRegistered(name);

    // Assert
    expect(status).to.eq(false);
  });

  it("should unregister route", () => {
    // Arrange
    const name = faker.random.word();
    const warden = new Warden(requestManager, cacheFactory);
    requestManagerMock.expects('unregister').withArgs(name);

    // Act
    warden.unregisterRoute(name);
  });

  it("should register plugin", () => {
    // Arrange
    const name = faker.random.word();
    const plugin = {} as any;
    const warden = new Warden(requestManager, cacheFactory);
    cacheFactoryMock.expects('register').withArgs(name, plugin);

    // Act
    warden.registerCachePlugin(name, plugin);
  });

  it('should return warden debug from static value', () => {
    // Arrange
    const warden = new Warden(requestManager, cacheFactory);

    // Assert
    expect(warden.debug).to.eq(Warden.debug);
  });

  it('should set warden debug for static value', () => {
    // Arrange
    const warden = new Warden(requestManager, cacheFactory);

    // Act
    warden.debug = true;

    // Assert
    expect(warden.debug).to.eq(Warden.debug);
    expect(Warden.debug).to.eq(true);

    warden.debug = false;
  });
});
