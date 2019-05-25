import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {MemoryCache} from "../src/memory-cache";
import {CacheThenNetwork} from "../src/cache-then-network";
import faker from "faker";


const sandbox = sinon.createSandbox();

const memory = new MemoryCache();

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
    const cache = new CacheThenNetwork(memory);

    // Assert
    expect(cache).to.be.instanceOf(CacheThenNetwork);
  });

  it("should pass the request to the next chain if cache is invalid", async () => {
    // Arrange
    const ms = undefined;
    const cache = new CacheThenNetwork(memory, ms);
    const chunk: any = {
      key: faker.random.word()
    };
    memoryMock.expects('get').withExactArgs(chunk.key).returns(null);
    const spy = sandbox.stub();
    const responseStub = sandbox.stub(cache, 'respond');

    // Act
    await cache.onRequest(chunk, spy);

    // Assert
    expect(spy.calledWithExactly(chunk)).to.eq(true);
    expect(responseStub.notCalled).to.eq(true);
  });

  it("should respond from cache if cache is valid", async () => {
    // Arrange
    const ms = undefined;
    const cache = new CacheThenNetwork(memory, ms);
    const spy = sandbox.stub();
    const chunk: any = {
      key: faker.random.word(),
      cb: spy
    };
    const response = {
      body: faker.random.word()
    };
    memoryMock.expects('get').withExactArgs(chunk.key).returns(response);
    const responseStub = sandbox.stub(cache, 'respond');

    // Act
    await cache.onRequest(chunk, spy);

    // Assert
    expect(spy.notCalled).to.eq(true);
    expect(responseStub.calledWith({
      key: chunk.key,
      cb: chunk.cb,
      response: response as any,
      cacheHit: true
    } as any)).to.eq(true);
  });

  it("should return incoming response without caching if cache hit flag true", async () => {
    // Arrange
    const ms = undefined;
    const cache = new CacheThenNetwork(memory, ms);
    const chunk: any = {
      key: faker.random.word(),
      response: {
        body: faker.random.word()
      },
      cacheHit: true
    };
    memoryMock.expects('set').never();
    const spy = sandbox.stub();

    // Act
    await cache.onResponse(chunk, spy);

    // Assert
    expect(spy.calledWithExactly(chunk)).to.eq(true);
  });

  it("should handle incoming response with caching", async () => {
    // Arrange
    const ms = faker.random.number();
    const cache = new CacheThenNetwork(memory, ms);
    const chunk: any = {
      key: faker.random.word(),
      response: {
        body: faker.random.word(),
        headers: {}
      },
      cacheHit: false
    };
    memoryMock.expects('set').withExactArgs(chunk.key, chunk.response, ms).resolves();
    const spy = sandbox.stub();

    // Act
    await cache.onResponse(chunk, spy);

    // Assert
    expect(spy.calledWithExactly(chunk)).to.eq(true);
  });

  it("should handle incoming response without caching because of set-cookie", async () => {
    // Arrange
    const ms = faker.random.number();
    const cache = new CacheThenNetwork(memory, ms);
    const chunk: any = {
      key: faker.random.word(),
      response: {
        body: faker.random.word(),
        headers: {
          'set-cookie': 'foo=bar'
        }
      },
      cacheHit: false
    };
    const spy = sandbox.stub();

    // Act
    await cache.onResponse(chunk, spy);

    // Assert
    expect(spy.calledWithExactly(chunk)).to.eq(true);
  });
});
