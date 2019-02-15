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

  it("should implement right stream", () => {
    // Arrange
    const cache = new Cache(memory, defaultCacheDuration);

    // Assert
    expect(cache.leftStream).to.be.instanceOf(Transform);
  });

  it("should implement left stream", () => {
    // Arrange
    const cache = new Cache(memory, defaultCacheDuration);

    // Assert
    expect(cache.leftStream).to.be.instanceOf(Transform);
  });

  it("should connect stream to next handler", () => {
    // Arrange
    const wardenStream = new Cache(memory, defaultCacheDuration);
    const warden2Stream = new Cache(memory, defaultCacheDuration);
    const rightSpy = sandbox.stub(wardenStream.rightStream, 'pipe');
    const leftSpy = sandbox.stub(warden2Stream.leftStream, 'pipe');

    // Act
    const nexyHandler = wardenStream
      .connect(warden2Stream);

    // Assert
    expect(rightSpy.calledWithExactly(warden2Stream.rightStream)).to.eq(true);
    expect(leftSpy.calledWithExactly(wardenStream.leftStream)).to.eq(true);
    expect(nexyHandler).to.eq(warden2Stream);
  });
});
