import "reflect-metadata";

import {expect} from "chai";
import {CacheManager, CachingStrategy} from "../../src/cache/cache-manager";
import sinon, {SinonMock} from "sinon";
import {Configuration} from "../../src/configuration";
import faker from "faker";

const sandbox = sinon.createSandbox();

const configuration = new Configuration();

let configurationMock: SinonMock;
let cacheManager: CacheManager;

describe("[cache-manager.ts]", () => {
  beforeEach(() => {
    configurationMock = sandbox.mock(configuration);
    cacheManager = new CacheManager(configuration);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Cache Manager", () => {
    // Arrange
    const cacheManager = new CacheManager(configuration);

    // Assert
    expect(cacheManager).to.be.instanceOf(CacheManager);
  });

  it("should parse cache config boolean: true", () => {
    // Arrange
    const config = true;

    // Act
    const configuration = cacheManager.parseCacheConfig(config);

    // Assert
    expect(configuration).to.eq(cacheManager.defaultCacheConfig);
  });

  it("should parse cache config boolean: false", () => {
    // Arrange
    const config = false;

    // Act
    const configuration = cacheManager.parseCacheConfig(config);

    // Assert
    expect(configuration).to.eq(false);
  });

  it("should parse cache config as null", () => {
    // Arrange
    const config = null;

    // Act
    const configuration = cacheManager.parseCacheConfig(config);

    // Assert
    expect(configuration).to.eq(false);
  });

  it("should parse cache config as undefined", () => {
    // Act
    const configuration = cacheManager.parseCacheConfig();

    // Assert
    expect(configuration).to.eq(false);
  });

  it("should parse cache config as time string", () => {
    // Arrange
    const config = '1m';

    // Act
    const configuration = cacheManager.parseCacheConfig(config);

    // Assert
    expect(configuration).to.deep.eq({
      ...cacheManager.defaultCacheConfig,
      duration: 60 * 1000
    });
  });

  it("should parse cache config as ms number", () => {
    // Arrange
    const config = faker.random.number();

    // Act
    const configuration = cacheManager.parseCacheConfig(config);

    // Assert
    expect(configuration).to.deep.eq({
      ...cacheManager.defaultCacheConfig,
      duration: config
    });
  });

  it("should parse cache config as object empty", () => {
    // Arrange
    const config = {

    };

    // Act
    const configuration = cacheManager.parseCacheConfig(config);

    // Assert
    expect(configuration).to.deep.eq(cacheManager.defaultCacheConfig);
  });

  it("should parse cache config as object (durationOnly)", () => {
    // Arrange
    const config = {
      duration: '1m'
    };

    // Act
    const configuration = cacheManager.parseCacheConfig(config);

    // Assert
    expect(configuration).to.deep.eq({
      ...cacheManager.defaultCacheConfig,
      duration: 1000 * 60
    });
  });

  it("should parse cache config as object (full)", () => {
    // Arrange
    const config = {
      duration: faker.random.number(),
      strategy: faker.random.word(),
      plugin: faker.random.word()
    } as any;

    // Act
    const configuration = cacheManager.parseCacheConfig(config);

    // Assert
    expect(configuration).to.deep.eq(config);
  });
});
