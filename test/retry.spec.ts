import * as sinon from "sinon";
import * as faker from "faker";
import {expect} from "chai";
import {Retry, RetryConfiguration} from "../src/retry";
import {SinonStub} from "sinon";

const sandbox = sinon.createSandbox();
let retryStream: Retry;

const defaultConfiguration = {
  count: 2,
  delay: 100
};

let clock: sinon.SinonFakeTimers;

describe('[retry.ts]', () => {
  beforeEach(() => {
    clock = sandbox.useFakeTimers();
    retryStream = new Retry(defaultConfiguration);
  });

  afterEach(() => {
    clock.restore();
    sandbox.verifyAndRestore();
  });

  it('should create new Retry', () => {
    // Arrange
    const retryStream = new Retry(defaultConfiguration);

    // Assert
    expect(retryStream).to.be.instanceOf(Retry);
  });

  it('should create new Retry from number', () => {
    // Arrange
    const retryConfiguration = 100;

    // Act
    const retry = Retry.create(retryConfiguration);

    // Assert
    expect(retry).to.be.instanceOf(Retry);
  });

  it('should create new Retry from boolean', () => {
    // Arrange
    const retryConfiguration = true;

    // Act
    const retry = Retry.create(retryConfiguration);

    // Assert
    expect(retry).to.be.instanceOf(Retry);
  });

  it('should create new Retry from configuration', () => {
    // Arrange
    const retryConfiguration = {
      count: 2,
      delay: 100
    };

    // Act
    const retry = Retry.create(retryConfiguration);

    // Assert
    expect(retry).to.be.instanceOf(Retry);
  });

  it('should create new Retry from configuration with default delay', () => {
    // Arrange
    const retryConfiguration = {
      count: 2
    };

    // Act
    const retry = Retry.create(retryConfiguration);

    // Assert
    expect(retry).to.be.instanceOf(Retry);
  });

  it('should create new Retry from configuration with default count', () => {
    // Arrange
    const retryConfiguration = {
      delay: 100
    };

    // Act
    const retry = Retry.create(retryConfiguration);

    // Assert
    expect(retry).to.be.instanceOf(Retry);
  });

  it('should create new Retry when provided configuration is not valid', () => {
    // Arrange
    const retryConfiguration = "" as unknown as RetryConfiguration;

    // Act
    const retry = Retry.create(retryConfiguration);

    // Assert
    expect(retry).to.be.instanceOf(Retry);
  });

  it('should and retry count to outgoing request for the first time', async () => {
    // Arrange
    const chunk = {};
    const spy = sandbox.stub();

    // Act
    await retryStream.onRequest(chunk as any, spy);

    // Assert
    expect(spy.calledWith(null, {
      ...chunk,
      retryCount: 0
    })).to.eq(true);
  });

  it('should not retry incoming failed response if it is not error', async () => {
    // Arrange
    const chunk = {
      retryCount: 0
    } as any;
    const spy = sandbox.stub();
    const retry = new Retry({
      count: 1,
      delay: 0
    });
    const request = sandbox.stub(retry, 'request');

    // Act
    await retry.onResponse(chunk, spy);

    // Assert
    expect(request.notCalled).to.eq(true);
    expect(spy.calledWithExactly(undefined, chunk)).to.eq(true);
  });

  it('should retry incoming failed response if status code is 429 (too many requests)', async () => {
    // Arrange
    const chunk = {
      retryCount: 0,
      response: {
        statusCode: 429
      }
    } as any;
    const spy = sandbox.stub();
    const retry = new Retry({
      count: 1,
      delay: 0
    });
    const request = sandbox.stub(retry, 'request') as SinonStub;

    // Act
    await retry.onResponse(chunk, spy);

    // Assert
    expect(request.calledWith({
      retryCount: 1,
      cb: chunk.cb,
      key: chunk.key,
      requestOptions: chunk.requestOptions
    })).to.eq(true);
    expect(spy.calledWithExactly(undefined, null)).to.eq(true);
  });

  it('should retry incoming failed response if status code is 500', async () => {
    // Arrange
    const chunk = {
      retryCount: 0,
      response: {
        statusCode: 500
      }
    } as any;
    const spy = sandbox.stub();
    const retry = new Retry({
      count: 1,
      delay: 0
    });
    const request = sandbox.stub(retry, 'request') as SinonStub;

    // Act
    await retry.onResponse(chunk, spy);

    // Assert
    expect(request.calledWith({
      retryCount: 1,
      cb: chunk.cb,
      key: chunk.key,
      requestOptions: chunk.requestOptions
    })).to.eq(true);
    expect(spy.calledWithExactly(undefined, null)).to.eq(true);
  });

  it('should retry incoming failed response if the request errored with one of specific error types', async () => {
    // Arrange
    const chunk = {
      error: {
        code: 'ECONNRESET'
      },
      retryCount: 0
    } as any;
    const spy = sandbox.stub();
    const retry = new Retry({
      count: 1,
      delay: 0
    });
    const request = sandbox.stub(retry, 'request') as SinonStub;

    // Act
    await retry.onResponse(chunk, spy);

    // Assert
    expect(request.calledWith({
      retryCount: 1,
      cb: chunk.cb,
      key: chunk.key,
      requestOptions: chunk.requestOptions
    })).to.eq(true);
    expect(spy.calledWithExactly(undefined, null)).to.eq(true);
  });

  it('should call logger function if it is provided', async () => {
    // Arrange
    const chunk = {
      error: {
        code: 'ECONNRESET'
      },
      retryCount: 0
    } as any;
    const spy = sandbox.stub();
    const logger = sandbox.stub();
    const retry = new Retry({
      count: 1,
      delay: 0,
      logger
    });
    const request = sandbox.stub(retry, 'request') as SinonStub;

    // Act
    await retry.onResponse(chunk, spy);

    // Assert
    expect(request.calledWith({
      retryCount: 1,
      cb: chunk.cb,
      key: chunk.key,
      requestOptions: chunk.requestOptions
    })).to.eq(true);
    expect(logger.calledWithExactly(1)).to.eq(true);
    expect(spy.calledWithExactly(undefined, null)).to.eq(true);
  });

  it('should retry incoming failed response if the request errored with delay', async () => {
    // Arrange
    const chunk = {
      error: {
        code: 'ECONNRESET'
      },
      retryCount: 0
    } as any;
    const spy = sandbox.stub();
    const retry = new Retry({
      count: 1,
      delay: 100
    });
    const request = sandbox.stub(retry, 'request') as SinonStub;

    // Act
    await retry.onResponse(chunk, spy);
    clock.tick(110);

    // Assert
    expect(request.calledWith({
      retryCount: 1,
      cb: chunk.cb,
      key: chunk.key,
      requestOptions: chunk.requestOptions
    })).to.eq(true);
    expect(spy.calledWithExactly(undefined, null)).to.eq(true);
  });
});