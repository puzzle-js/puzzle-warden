import "reflect-metadata";
import {MemoryCache} from "../src/cache/plugins/memory";
import faker = require("faker");
import {expect} from "chai";

describe("[memory.ts]", () => {
  it("should set a value", () => {
    // Arrange
    const key = faker.random.word();
    const value = faker.random.word();
    const memoryCache = new MemoryCache();

    // Act
    memoryCache.set(key, value);

    // Assert
    expect(memoryCache.cache[key]).to.eq(value);
  });

  it("should get a value", () => {
    // Arrange
    const key = faker.random.word();
    const value = faker.random.word();
    const memoryCache = new MemoryCache();
    memoryCache.cache[key] = value;

    // Act
    const valueFromCache = memoryCache.get(key);

    // Assert
    expect(valueFromCache).to.eq(value);
  });
});
