import "reflect-metadata";

import {expect} from "chai";
import sinon from "sinon";
import {CACHE_PLUGIN, CacheFactory} from "../src/cache-factory";
import {MemoryCache} from "../src/memory-cache";
import {Cache} from "../src/cache";

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

  it("should return plugin instance for cache plugin enum", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const plugin = cacheFactory.getPlugin(CACHE_PLUGIN.Memory);

    // Assert
    expect(plugin).to.be.instanceOf(MemoryCache);
  });

  it("should return default plugin as memory plugin", () => {
    // Arrange
    const cacheFactory = new CacheFactory();

    // Act
    const plugin = cacheFactory.getPlugin();

    // Assert
    expect(plugin).to.be.instanceOf(MemoryCache);
  });

  it("should create new cache instance based onn configuration", () => {
    // Arrange
    const cacheFactory = new CacheFactory();
    const cacheConfiguration = {};
    const pluginStub = sandbox.stub(cacheFactory, 'getPlugin');

    // Act
    const cache = cacheFactory.create(cacheConfiguration);

    // Assert
    expect(pluginStub.calledWithExactly(undefined)).to.eq(true);
    expect(cache).to.be.instanceOf(Cache);
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
    expect(cache).to.be.instanceOf(Cache);
  });
});
