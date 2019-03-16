import "reflect-metadata";
import {MemoryCache} from "../src/memory-cache";
import faker = require("faker");
import {expect} from "chai";
import {stub} from "sinon";

describe("[memory.ts]", () => {
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
    const spy = stub(Date, 'now').returns(100);

    // Act
    await memoryCache.set(key, value, Date.now());

    spy.returns(300);

    const cachedValue = await memoryCache.get(key);
    spy.restore();

    // Assert
    expect(cachedValue).to.eq(null);
  });

  it("should return null when not found", async () => {
    // Arrange
    const key = faker.random.word();
    const memoryCache = new MemoryCache();

    const cachedValue = await memoryCache.get(key);

    // Assert
    expect(cachedValue).to.eq(null);
  });
});
