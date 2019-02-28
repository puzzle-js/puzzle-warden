import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {MemoryCache} from "../src/memory-cache";
import {CacheThenNetwork} from "../src/cache-then-network";


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
    const cache = new CacheThenNetwork(memory, defaultCacheDuration);

    // Assert
    expect(cache).to.be.instanceOf(CacheThenNetwork);
  });


});
