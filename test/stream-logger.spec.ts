import * as sinon from "sinon";
import {expect} from "chai";
import {LOG_COLORS, StreamLogger} from "../src/stream-logger";
import {createRequestChunk} from "./helpers";
import faker from "faker";
import {Streamer} from "../src/streamer";

const sandbox = sinon.createSandbox();
let streamLogger: StreamLogger;

describe('[stream-logger.ts]', () => {
  beforeEach(() => {
    streamLogger = new StreamLogger();
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should create new StreamLogger', () => {
    // Arrange
    const streamLogger = new StreamLogger();

    // Assert
    expect(streamLogger).to.be.instanceOf(StreamLogger);
  });

  it('should return key string for logging', () => {
    // Arrange
    const chunk = createRequestChunk({
      id: faker.random.number(),
      key: faker.random.word()
    });

    // Act
    const keyString = StreamLogger.getKeyString(chunk);

    // Assert
    expect(keyString).to.eq(`${chunk.id} | ${chunk.key}:`);
  });

  it('should log incoming request chunk when (previous stream, errored response)', () => {
    // Arrange
    const chunk = createRequestChunk({
      id: faker.random.number(),
      key: faker.random.word(),
      error: new Error(faker.random.word())
    });
    const stream = new Streamer('stream');
    const previousStream = new Streamer('previousStream');
    const nextStream = new Streamer('nextStream');

    const keyString = faker.random.word();
    const keyStub = sandbox.stub(StreamLogger, 'getKeyString').returns(keyString);

    const consoleStub = sandbox.stub(console, 'info');

    // Act
    StreamLogger.onRequest(chunk, stream, previousStream, nextStream);

    // Assert
    expect(keyStub.calledWithExactly(chunk)).to.eq(true);
    expect(consoleStub.calledWithExactly(LOG_COLORS.responseFailed(keyString), previousStream.name, '--->', stream.name)).to.eq(true);
  });

  it('should log incoming request chunk when (previous stream, success response)', () => {
    // Arrange
    const chunk = createRequestChunk({
      id: faker.random.number(),
      key: faker.random.word(),
      response: true
    });
    const stream = new Streamer('stream');
    const previousStream = new Streamer('previousStream');
    const nextStream = new Streamer('nextStream');

    const keyString = faker.random.word();
    const keyStub = sandbox.stub(StreamLogger, 'getKeyString').returns(keyString);

    const consoleStub = sandbox.stub(console, 'info');

    // Act
    StreamLogger.onRequest(chunk, stream, previousStream, nextStream);

    // Assert
    expect(keyStub.calledWithExactly(chunk)).to.eq(true);
    expect(consoleStub.calledWithExactly(LOG_COLORS.responseSuccessful(keyString), previousStream.name, '--->', stream.name)).to.eq(true);
  });

  it('should log incoming request chunk when (previous stream, no status)', () => {
    // Arrange
    const chunk = createRequestChunk({
      id: faker.random.number(),
      key: faker.random.word()
    });
    const stream = new Streamer('stream');
    const previousStream = new Streamer('previousStream');
    const nextStream = new Streamer('nextStream');

    const keyString = faker.random.word();
    const keyStub = sandbox.stub(StreamLogger, 'getKeyString').returns(keyString);

    const consoleStub = sandbox.stub(console, 'info');

    // Act
    StreamLogger.onRequest(chunk, stream, previousStream, nextStream);

    // Assert
    expect(keyStub.calledWithExactly(chunk)).to.eq(true);
    expect(consoleStub.calledWithExactly(LOG_COLORS.requestNoStatus(keyString), previousStream.name, '--->', stream.name)).to.eq(true);
  });

  it('should log incoming request chunk when (no previous stream, no status)', () => {
    // Arrange
    const chunk = createRequestChunk({
      id: faker.random.number(),
      key: faker.random.word()
    });
    const stream = new Streamer('stream');
    const nextStream = new Streamer('nextStream');

    const keyString = faker.random.word();
    const keyStub = sandbox.stub(StreamLogger, 'getKeyString').returns(keyString);

    const consoleStub = sandbox.stub(console, 'info');

    // Act
    StreamLogger.onRequest(chunk, stream, undefined, nextStream);

    // Assert
    expect(keyStub.calledWithExactly(chunk)).to.eq(true);
    expect(consoleStub.calledWithExactly(LOG_COLORS.requestNoStatus(keyString), '|--->', stream.name)).to.eq(true);
  });

  it('should log incoming response chunk when (no next stream, no status)', () => {
    // Arrange
    const chunk = createRequestChunk({
      id: faker.random.number(),
      key: faker.random.word()
    });
    const previousStream = new Streamer('previousStream');
    const stream = new Streamer('stream');

    const keyString = faker.random.word();
    const keyStub = sandbox.stub(StreamLogger, 'getKeyString').returns(keyString);

    const consoleStub = sandbox.stub(console, 'info');

    // Act
    StreamLogger.onResponse(chunk, stream, previousStream, undefined);

    // Assert
    expect(keyStub.calledWithExactly(chunk)).to.eq(true);
    expect(consoleStub.calledWithExactly(LOG_COLORS.requestNoStatus(keyString), stream.name, '<---|')).to.eq(true);
  });

  it('should log incoming response chunk when (next stream, no status)', () => {
    // Arrange
    const chunk = createRequestChunk({
      id: faker.random.number(),
      key: faker.random.word()
    });
    const previousStream = new Streamer('previousStream');
    const stream = new Streamer('stream');
    const nextStream = new Streamer('nextStream');

    const keyString = faker.random.word();
    const keyStub = sandbox.stub(StreamLogger, 'getKeyString').returns(keyString);

    const consoleStub = sandbox.stub(console, 'info');

    // Act
    StreamLogger.onResponse(chunk, stream, previousStream, nextStream);

    // Assert
    expect(keyStub.calledWithExactly(chunk)).to.eq(true);
    expect(consoleStub.calledWithExactly(LOG_COLORS.requestNoStatus(keyString), stream.name, '<---', nextStream.name)).to.eq(true);
  });
});
