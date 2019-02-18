import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import faker from "faker";
import {Holder} from "../src/holder";
import {RequestChunk, ResponseChunk} from "../src/warden-stream";

const sandbox = sinon.createSandbox();
let holder: Holder;

describe("[holder.ts]", () => {
  beforeEach(() => {
    holder = new Holder();
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new HOlder", () => {
    // Arrange
    const holder = new Holder();

    // Assert
    expect(holder).to.be.instanceOf(Holder);
  });

  it("should create new queue and push item when it is new and pass it to next handler", () => {
    // Arrange
    const chunk = {
      key: 'key'
    } as RequestChunk;
    const spy = sandbox.stub();

    // Act
    holder.onRequest(chunk, spy);

    // Assert
    expect(spy.calledWithExactly(undefined, chunk)).to.eq(true);
  });

  it("should not pass same key for the second time", () => {
    // Arrange
    const chunk = {
      key: faker.random.word()
    } as RequestChunk;
    const spy = sandbox.stub();

    // Act
    holder.onRequest(chunk, spy);
    holder.onRequest(chunk, spy);

    // Assert
    expect(spy.firstCall.calledWithExactly(undefined, chunk)).to.eq(true);
    expect(spy.secondCall.calledWithExactly(undefined, null)).to.eq(true);
    expect(spy.calledTwice).to.eq(true);
  });


  it("should return incoming reponse when there is no cache items included", () => {
    // Arrange
    const chunk = {
      key: faker.random.word()
    } as ResponseChunk;
    const spy = sandbox.stub();

    // Act
    holder.onResponse(chunk, spy);

    // Assert
    expect(spy.calledOnce).to.eq(true);
    expect(spy.calledWithExactly(undefined, chunk)).to.eq(true);
  });

  it("should return all the holding requests when response received", () => {
    // Arrange
    const key = faker.random.word();
    const responseChunk = {
      key,
      data: faker.random.word()
    } as ResponseChunk;
    const requestChunk = {
      key
    } as RequestChunk;
    const spy = sandbox.stub();
    const requestSpy = sandbox.stub();
    const respondSpy = sandbox.stub(holder, 'respond');

    // Act
    holder.onRequest(requestChunk, requestSpy);
    holder.onRequest(requestChunk, requestSpy);
    holder.onResponse(responseChunk, spy);

    // Assert
    expect(respondSpy.calledWith(responseChunk)).to.eq(true);
    expect(spy.calledOnce).to.eq(true);
    expect(spy.calledWithExactly(undefined, null)).to.eq(true);
  });
});
