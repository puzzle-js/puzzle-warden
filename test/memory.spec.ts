import "reflect-metadata";
import {MemoryCache} from "../src/memory-cache";
import {expect} from "chai";
import {stub, useFakeTimers} from "sinon";
import faker = require("faker");

describe("[memory.ts]", () => {
  const clock = useFakeTimers();

  afterAll(() => {
    clock.restore();
  });

  it("should set a value without expire", async () => {
    // Arrange
    const key = faker.random.word();
    const value = faker.random.word();
    const memoryCache = new MemoryCache();

    // Act
    await memoryCache.set(key, value);

    const cachedValue = await memoryCache.get(key);

    // Assert
    expect(cachedValue).to.eq(value);
  });

  it("should set a value with expire", async () => {
    // Arrange
    const key = faker.random.word();
    const value = faker.random.word();
    const memoryCache = new MemoryCache();
    const expire = Date.now();

    // Act
    await memoryCache.set(key, value, expire);

    const cachedValue = await memoryCache.get(key);

    // Assert
    expect(cachedValue).to.eq(value);
  });

  it("should return null when expired", async () => {
    // Arrange
    const key = faker.random.word();
    const value = faker.random.word();
    const memoryCache = new MemoryCache();

    // Act
    await memoryCache.set(key, value, 100);
    clock.tick(250);

    const cachedValue = await memoryCache.get(key);

    // Assert
    expect(cachedValue).to.eq(null);
  });

  it('should clear timeout of existing value if set triggered', async () => {
    // Arrange
    const key = faker.random.word();
    const value = faker.random.word();
    const value2 = faker.random.word();
    const memoryCache = new MemoryCache();

    // Act
    await memoryCache.set(key, value, 100);
    await memoryCache.set(key, value2, 2000);

    clock.tick(1000);

    const cachedValue = await memoryCache.get(key);

    // Assert
    expect(cachedValue).to.eq(value2);
  });

  it("should return null when not found", async () => {
    // Arrange
    const key = faker.random.word();
    const memoryCache = new MemoryCache();

    const cachedValue = await memoryCache.get(key);

    // Assert
    expect(cachedValue).to.eq(null);
  });

  it("should invalidate without removing valid entries", async () => {
    // Arrange
    const key = faker.random.word();
    const value = faker.random.word();
    const memoryCache = new MemoryCache();
    const expire = Date.now();

    // Act
    await memoryCache.set(key, value, expire);


    // Assert
    expect(Object.keys(memoryCache.cache).length).to.eq(1);
  });
});
