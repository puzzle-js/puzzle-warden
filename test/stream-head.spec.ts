import "reflect-metadata";

import {expect} from "chai";
import sinon from "sinon";
import faker from "faker";
import {StreamHead} from "../src/stream-head";

const sandbox = sinon.createSandbox();

let streamHead: StreamHead;


describe("[stream-head.ts]", () => {
  beforeEach(() => {
    streamHead = new StreamHead();
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new StreamHead", () => {
    // Arrange
    const streamHead = new StreamHead();

    // Assert
    expect(streamHead).to.be.instanceOf(StreamHead);
  });

  it("should start stream", () => {
    // Arrange
    const key = faker.random.word();
    const requestOptions = {} as any;
    const cb = sandbox.stub();
    const requestStub = sandbox.stub(streamHead, 'request');

    // Act
    streamHead.start(key, requestOptions, cb);

    // Assert
    expect(requestStub.calledWithExactly({
      key,
      requestOptions,
      cb
    }));
  });

  it("should call request callbback when received response", () => {
    // Arrange
    const cb = sandbox.stub();
    const error = null;
    const data = faker.random.word();
    const chunk = {
      cb,
      data,
      error
    } as any;
    const streamCb = sandbox.stub();

    // Act
    streamHead.onResponse(chunk, streamCb);

    // Assert
    expect(cb.calledWithExactly(error, chunk, data)).to.eq(true);
  });

  it("should throw error when it is a pipe target", () => {
    // Arrange
    const test = () => {
      (streamHead as any).onRequest();
    };

    // Assert
    expect(test).to.throw();
  });
});
