import "reflect-metadata";

import {expect} from "chai";
import sinon from "sinon";
import {CacheFactory, CACHING_STRATEGY} from "../src/cache-factory";
import {MemoryCache} from "../src/memory-cache";
import {CacheThenNetwork} from "../src/cache-then-network";
import * as faker from "faker";

const sandbox = sinon.createSandbox();

describe("[cache-factory.ts]", () => {
  beforeEach(() => {

  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Cache Factory", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Assert
    expect(cacheFactory).to.be.instanceOf(CacheFactory);
  });

  it("should return plugin instance for memory", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const plugin = cacheFactory.getPlugin('memory');

    // Assert
    expect(plugin).to.be.instanceOf(MemoryCache);
  });

  it("should return memory plugin for unknown plugin", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const plugin = cacheFactory.getPlugin('foo');

    // Assert
    expect(plugin).to.be.instanceOf(MemoryCache);
  });

  it("should return custom plugin as new Instance", () => {
    // Arrange
    const pluginName = faker.random.word();
    class Plugin{}
    const cacheFactory = new CacheFactory();

    // Act
    cacheFactory.register(pluginName, Plugin as any);
    const plugin = cacheFactory.getPlugin(pluginName);

    // Assert
    expect(plugin).to.be.instanceOf(Plugin);
  });

  it("should return custom plugin as singleton", () => {
    // Arrange
    const pluginName = faker.random.word();
    const pluginInstance = {
      get: () => '',
      set: () => ''
    };
    const cacheFactory = new CacheFactory();

    // Act
    cacheFactory.register(pluginName, pluginInstance as any);
    const plugin = cacheFactory.getPlugin(pluginName);

    // Assert
    expect(plugin).to.eq(pluginInstance);
  });

  it("should return default plugin as memory plugin", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const plugin = cacheFactory.getPlugin();

    // Assert
    expect(plugin).to.be.instanceOf(MemoryCache);
  });

  it("should return a Couchbase plugin", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const plugin = cacheFactory.getPlugin();

    // Assert
    expect(plugin).to.be.instanceOf(MemoryCache);
  });


  it("should create new cache instance based on configuration with custom strategy", () => {
    // Arrange
    const cacheFactory = new CacheFactory();
    const cacheConfiguration = {
      strategy: CACHING_STRATEGY.CacheThenNetwork
    };
    const pluginStub = sandbox.stub(cacheFactory, 'getPlugin');

    // Act
    const cache = cacheFactory.create(cacheConfiguration);

    // Assert
    expect(pluginStub.calledWithExactly(undefined)).to.eq(true);
    expect(cache).to.be.instanceOf(CacheThenNetwork);
  });

  it("should create new cache instance based on configuration", () => {
    // Arrange
    const cacheFactory = new CacheFactory();
    const cacheConfiguration = {};
    const pluginStub = sandbox.stub(cacheFactory, 'getPlugin');

    // Act
    const cache = cacheFactory.create(cacheConfiguration);

    // Assert
    expect(pluginStub.calledWithExactly(undefined)).to.eq(true);
    expect(cache).to.be.instanceOf(CacheThenNetwork);
  });

  it("should parse duration in string with ms", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const ms = cacheFactory.parseMs('1m');

    // Assert
    expect(ms).to.eq(60000);
  });

  it("should return default caching duration if not provided", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const ms = cacheFactory.parseMs();

    // Assert
    expect(ms).to.eq(60000);
  });

  it("should return custom number if number input provided", () => {
    // Arrange
    const cacheFactory = new CacheFactory();
    const customMs = 123;

    // Act
    const ms = cacheFactory.parseMs(customMs);

    // Assert
    expect(ms).to.eq(customMs);
  });

  it("should throw error if provided ms is not string or number", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const test = () => cacheFactory.parseMs({} as string);

    // Assert
    expect(test).to.throw();
  });

  it("should create default cache when configuration provided as true", () => {
    // Arrange
    const cacheFactory = new CacheFactory();
    const cacheConfiguration = true;
    const pluginStub = sandbox.stub(cacheFactory, 'getPlugin');
    const msStub = sandbox.stub(cacheFactory, 'parseMs');

    // Act
    const cache = cacheFactory.create(cacheConfiguration);

    // Assert
    expect(pluginStub.calledWithExactly(undefined)).to.eq(true);
    expect(msStub.calledWithExactly(undefined)).to.eq(true);
    expect(cache).to.be.instanceOf(CacheThenNetwork);
  });
});
