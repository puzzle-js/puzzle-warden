import "reflect-metadata";

import sinon, {SinonMock} from "sinon";
import {Warden, WardenUserRouteConfig} from "../src/warden";
import {expect} from "chai";
import {Configuration, WardenInitialConfig} from "../src/configuration";
import {WardenRequest} from "../src/request-manager";
import faker = require("faker");
import {Tokenizer} from "../src/tokenizer";
import {CacheManager} from "../src/cache/cache-manager";

const sandbox = sinon.createSandbox();
const tokenizer = new Tokenizer();
const configuration = new Configuration();
const cacheManager = new CacheManager(configuration);
const requestManager = {
  handle() {
    throw new Error('Mocked method call');
  }
} as any;

let requestManagerMock: SinonMock;
let configurationMock: SinonMock;
let cacheManagerMock: SinonMock;
let tokenizerMock: SinonMock;
let warden: Warden;

describe("[warden.ts]", () => {
  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  beforeEach(() => {
    requestManagerMock = sandbox.mock(requestManager);
    configurationMock = sandbox.mock(configuration);
    cacheManagerMock = sandbox.mock(cacheManager);
    tokenizerMock = sandbox.mock(tokenizer);
    warden = new Warden(configuration, requestManager, tokenizer, cacheManager);
  });

  it("should create new Warden instance", () => {
    // Arrange
    const warden = new Warden(configuration, requestManager, tokenizer, cacheManager);

    // Assert
    expect(warden).to.be.instanceOf(Warden);
  });

  it("should set route configuration", () => {
    // Arrange
    const routeConfig = {
      identifier: faker.random.word(),
      cache: {}
    };
    const name = faker.random.word();
    const keyMaker = {} as any;
    const parsedCacheConfig = {} as any;
    tokenizerMock.expects('tokenize').withExactArgs(name, routeConfig.identifier).returns(keyMaker);
    cacheManagerMock.expects('parseCacheConfig').withExactArgs(routeConfig.cache).returns(parsedCacheConfig);
    configurationMock.expects('route').withExactArgs(name, keyMaker, parsedCacheConfig);

    // Act
    warden.setRoute(name, routeConfig);
  });

  it("should set main configuration", () => {
    // Arrange
    const config = {} as WardenInitialConfig;
    configurationMock.expects('config').withExactArgs(config);

    // Act
    warden.config(config);
  });

  it("should provide custom request", async () => {
    // Arrange
    const request = {} as WardenRequest;
    const cb = sandbox.stub();
    requestManagerMock.expects('handle').withExactArgs(request, cb);

    // Act
    await warden.request(request, cb);
  });
});
