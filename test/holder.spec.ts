import "reflect-metadata";

import {expect} from "chai";
import sinon from "sinon";
import faker from "faker";
import {Holder} from "../src/holder";
import {RequestChunk, ResponseChunk} from "../src/streamer";

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
    expect(spy.calledWithExactly(chunk)).to.eq(true);
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
    expect(spy.firstCall.calledWithExactly(chunk)).to.eq(true);
    expect(spy.calledOnce).to.eq(true);
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
    expect(spy.calledWithExactly(chunk)).to.eq(true);
  });

  it("should return all the holding requests when response received", () => {
    // Arrange
    const key = faker.random.word();
    const spy = sandbox.stub();
    const responseChunk = {
      key,
      response: {},
      requestOptions: {},
      error: undefined
    } as any;
    const requestChunk = {
      key,
      cb: sandbox.stub(),
      requestOptions: {}
    } as any;
    const requestSpy = sandbox.stub();
    const respondSpy = sandbox.stub(holder, 'respond');

    // Act
    holder.onRequest(requestChunk, requestSpy);
    holder.onRequest(requestChunk, requestSpy);
    holder.onResponse(responseChunk, spy);

    // Assert
    expect(respondSpy.calledWith({
      key: responseChunk.key,
      response: responseChunk.response,
      cb: requestChunk.cb,
      error: undefined,
      requestOptions: responseChunk.requestOptions
    })).to.eq(true);
    expect(spy.notCalled).to.eq(true);
  });
});
