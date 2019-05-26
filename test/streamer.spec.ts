import "reflect-metadata";

import {expect} from "chai";
import faker from "faker";
import sinon from "sinon";
import {Streamer} from "../src/streamer";
import {createRequestChunk, createResponseChunk} from "./helpers";
import {StreamLogger} from "../src/stream-logger";
import {Warden} from "../src/warden";

const sandbox = sinon.createSandbox();

describe("[warden-stream.ts]", () => {
  afterEach(() => {
    Warden.debug = false;
    sandbox.verifyAndRestore();
  });

  it('should create new Streamer', function () {
    // Arrange
    const name = faker.random.word();

    // Act
    const streamer = new Streamer(name);

    //Assert
    expect(streamer).to.be.instanceOf(Streamer);
  });

  it('should connect streams each other', () => {
    // Arrange
    const nextStream = new Streamer('next');
    const stream = new Streamer('stream');

    // Act
    const pipeStream = stream
      .connect(nextStream);

    // Assert
    expect(pipeStream).to.eq(nextStream);
    expect(stream.nextStream).to.eq(nextStream);
    expect(nextStream.previousStream).to.eq(stream);
  });

  it('should start new request stream', () => {
    // Arrange
    const stream = new Streamer('stream');
    const key = faker.random.word();
    const id = faker.random.number();
    const requestOptions = {} as any;
    const cb = sandbox.stub();

    const stub = sandbox.stub(stream as any, '_onRequest');

    // Act
    stream.start(key, id, requestOptions, cb);

    // Assert
    expect(stub.calledWithExactly({
      id,
      key,
      requestOptions,
      cb
    })).to.eq(true);
  });

  it('should call previous streams _onResponse when called respond', () => {
    // Arrange
    const stream = new Streamer('stream');
    const nextStream = new Streamer('prevStream');
    const chunk = createResponseChunk();

    stream.connect(nextStream);
    const stub = sandbox.stub(stream as any, '_onResponse');

    // Act
    nextStream.respond(chunk);

    // Assert
    expect(stub.calledWithExactly(chunk)).to.eq(true);
  });

  it('should call next streams _onRequest when called request', () => {
    // Arrange
    const stream = new Streamer('stream');
    const nextStream = new Streamer('nextStream');
    const chunk = createRequestChunk();

    stream.connect(nextStream);
    const stub = sandbox.stub(nextStream as any, '_onRequest');

    // Act
    stream.request(chunk);

    // Assert
    expect(stub.calledWithExactly(chunk)).to.eq(true);
  });

  it('should pass chunk to next stream if no handle registered for response', () => {
    // Arrange
    const stream = new Streamer('stream');
    const nextStream = new Streamer('nextStream');


    stream
      .connect(nextStream);

    const chunk = {
      id: faker.random.number(),
      key: faker.random.word(),
      requestOptions: {} as any,
      cb: sandbox.stub()
    };

    const nextStreamStub = sandbox.stub(nextStream as any, '_onRequest');

    // Act
    stream.start(chunk.key, chunk.id, chunk.requestOptions, chunk.cb);

    // Assert
    expect(nextStreamStub.calledWithExactly(chunk)).to.eq(true);
  });

  it('should pass chunk to next stream if no handle registered for response', () => {
    // Arrange
    const stream = new Streamer('stream');
    const nextStream = new Streamer('nextStream');
    const finalStream = new Streamer('finalStream');

    const responseChunk = createResponseChunk();

    stream
      .connect(nextStream)
      .connect(finalStream);

    const streamResponseStub = sandbox.stub(stream as any, '_onResponse');

    // Act
    finalStream.respond(responseChunk);

    // Assert
    expect(streamResponseStub.calledWithExactly(responseChunk)).to.eq(true);
  });

  it('should pass chunk to handler when it present', () => {
    // Arrange
    const nextStream = new Streamer('nextStream');
    const requestSpy = sandbox.stub();

    class Handler extends Streamer {
      constructor() {
        super('Handler');
      }

      onRequest(chunk: any) {
        requestSpy(chunk);
      }
    }

    const stream = new Handler();

    stream
      .connect(nextStream);

    const chunk = {
      id: faker.random.number(),
      key: faker.random.word(),
      requestOptions: {} as any,
      cb: sandbox.stub()
    };

    // Act
    stream.start(chunk.key, chunk.id, chunk.requestOptions, chunk.cb);

    // Assert
    expect(requestSpy.calledWithExactly(chunk)).to.eq(true);
  });

  it('should pass chunk to response handler when it present', () => {
    // Arrange
    const nextStream = new Streamer('nextStream');
    const responseSpy = sandbox.stub();

    class Handler extends Streamer {
      constructor() {
        super('Handler');
      }

      onResponse(chunk: any) {
        responseSpy(chunk);
      }
    }

    const stream = new Handler();

    stream
      .connect(nextStream);

    const chunk = createResponseChunk();

    // Act
    nextStream.respond(chunk);

    // Assert
    expect(responseSpy.calledWithExactly(chunk)).to.eq(true);
  });

  it('should pass chunk to logger when Warden debug is true', () => {
    // Arrange
    const nextStream = new Streamer('nextStream');
    const responseSpy = sandbox.stub();

    class Handler extends Streamer {
      constructor() {
        super('Handler');
      }

      onResponse(chunk: any) {
        responseSpy(chunk);
      }
    }

    Warden.debug = true;

    const stub = sandbox.stub(StreamLogger, 'onResponse');

    const stream = new Handler();

    stream
      .connect(nextStream);

    const chunk = createResponseChunk();

    // Act
    nextStream.respond(chunk);

    // Assert
    expect(responseSpy.calledWithExactly(chunk)).to.eq(true);
    expect(stub.calledWithExactly(chunk, stream, undefined, nextStream));
  });

  it('should pass chunk to handler when it present', () => {
    // Arrange
    const nextStream = new Streamer('nextStream');
    const requestSpy = sandbox.stub();

    class Handler extends Streamer {
      constructor() {
        super('Handler');
      }

      onRequest(chunk: any) {
        requestSpy(chunk);
      }
    }

    Warden.debug = true;

    const stub = sandbox.stub(StreamLogger, 'onRequest');

    const stream = new Handler();

    stream
      .connect(nextStream);

    const chunk = {
      id: faker.random.number(),
      key: faker.random.word(),
      requestOptions: {} as any,
      cb: sandbox.stub()
    };

    // Act
    stream.start(chunk.key, chunk.id, chunk.requestOptions, chunk.cb);


    // Assert
    expect(requestSpy.calledWithExactly(chunk)).to.eq(true);
    expect(stub.calledWithExactly(chunk, stream, undefined, nextStream));
  });

  it('should do nothing if response received when previous stream not exists', () => {
    // Arrange
    const stream = new Streamer('stream');

    const responseChunk = createResponseChunk();

    // Act
    stream.respond(responseChunk);
  });

  it('should do nothing if request received when next stream not exists', () => {
    // Arrange
    const stream = new Streamer('stream');

    const responseChunk = createRequestChunk();

    // Act
    stream.request(responseChunk);
  });

  it('should not pipe to next handler if response received from previous stream', () => {
    // Arrange
    const stream = new Streamer('stream');
    const nextStream = new Streamer('nextStream');

    stream
      .connect(nextStream);

    const requestChunk = createRequestChunk();
    const stub = sandbox.spy(stream as any, '_onResponse');

    // Act
    nextStream.respond(requestChunk);

    // Assert
    expect(stub.calledWithExactly(requestChunk)).to.eq(true);
  });
});
