import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {Cache} from "../src/cache";
import {MemoryCache} from "../src/memory-cache";
import {Transform} from "stream";

const sandbox = sinon.createSandbox();

const memory = new MemoryCache();
const defaultCacheDuration = 2000;

let memoryMock: SinonMock;

describe("[cache.ts]", () => {
  beforeEach(() => {
    memoryMock = sandbox.mock(memory);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Warden Stream", () => {
    // Arrange
    const cache = new Cache(memory, defaultCacheDuration);

    // Assert
    expect(cache).to.be.instanceOf(Cache);
  });
});
