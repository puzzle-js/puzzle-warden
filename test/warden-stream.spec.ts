import "reflect-metadata";

import {expect} from "chai";
import sinon from "sinon";
import faker from "faker";
import {RequestChunk, ResponseChunk, Streamer} from "../src/streamer";
import {PassThrough, TransformCallback, Readable} from "stream";
import ParallelTransform from "parallel-transform";


const sandbox = sinon.createSandbox();

describe("[warden-stream.ts]", () => {
  beforeEach(() => {

  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new debug mode default and not head", () => {
    // Arrange
    const name = faker.random.word();

    class Stream extends Streamer {
      constructor() {
        super(name, false);
      };

      onRequest(chunk: RequestChunk, callback: TransformCallback): void {
      }

      onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
      }
    }

    // Act
    const stream = new Stream();

    // Assert
    expect(stream.requestStream).to.be.instanceOf(ParallelTransform);
    expect(stream).to.be.instanceOf(Streamer);
  });

  it("should create new debug mode default and head", () => {
    // Arrange
    const name = faker.random.word();

    class Stream extends Streamer {
      constructor() {
        super(name, true);
      };

      onRequest(chunk: RequestChunk, callback: TransformCallback): void {
      }

      onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
      }
    }

    // Act
    const stream = new Stream();

    // Assert
    expect(stream.requestStream).to.be.instanceOf(Readable);
    expect(stream).to.be.instanceOf(Streamer);
  });

  it("should push to response stream on response", () => {
    // Arrange
    const name = faker.random.word();

    class Stream extends Streamer {
      constructor() {
        super(name, true);
      };

      onRequest(chunk: RequestChunk, callback: TransformCallback): void {
      }

      onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
      }
    }

    const stream = new Stream();
    const stub = sandbox.stub(stream.responseStream, 'push');
    const chunk = {} as any;

    // Act
    stream.respond(chunk);

    // Assert
    expect(stub.calledWithExactly(chunk)).to.eq(true);
  });

  it("should push to request stream on request", () => {
    // Arrange
    const name = faker.random.word();

    class Stream extends Streamer {
      constructor() {
        super(name, true);
      };

      onRequest(chunk: RequestChunk, callback: TransformCallback): void {
      }

      onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
      }
    }

    const stream = new Stream();
    const stub = sandbox.stub(stream.requestStream, 'push');
    const chunk = {} as any;

    // Act
    stream.request(chunk);

    // Assert
    expect(stub.calledWithExactly(chunk)).to.eq(true);
  });

  it("should connect a stream to other one", () => {
    // Arrange
    const name = faker.random.word();

    class Stream extends Streamer {
      constructor() {
        super(name, true);
      };

      onRequest(chunk: RequestChunk, callback: TransformCallback): void {
      }

      onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
      }
    }

    const stream = new Stream();
    const stream2 = new Stream();

    const requestStreamStub1 = sandbox.stub(stream.requestStream, 'pipe');
    const responseStreamStub2 = sandbox.stub(stream2.responseStream, 'pipe');

    // Act
    const returningStream = stream.connect(stream2);

    // Assert
    expect(requestStreamStub1.calledWithExactly(stream2.requestStream as any)).to.eq(true);
    expect(responseStreamStub2.calledWithExactly(stream.responseStream as any)).to.eq(true);
    expect(returningStream).to.eq(stream2);
  });

  it("should connect a stream to other one and debug link", () => {
    // Arrange
    class Stream extends Streamer {
      constructor() {
        super(faker.random.word(), true, true);
      };

      onRequest(chunk: RequestChunk, callback: TransformCallback): void {
      }

      onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
      }
    }

    const stream = new Stream();
    const stream2 = new Stream();

    const requestStreamStub1 = sandbox.stub(stream.requestStream, 'pipe').returnsArg(0);
    const responseStreamStub2 = sandbox.stub(stream2.responseStream, 'pipe').returnsArg(0);

    // Act
    const returningStream = stream.connect(stream2);

    // Assert
    expect(requestStreamStub1.calledWithExactly(stream.requestStreamPassThrough as PassThrough)).to.eq(true);
    expect(responseStreamStub2.calledWithExactly(stream2.responseStreamPassThrough as any)).to.eq(true);
    expect(returningStream).to.eq(stream2);
  });

  it("should log calls when debug mod is enabled", () => {
    // Arrange
    class Stream extends Streamer {
      constructor() {
        super(faker.random.word(), true, true);
      };

      onRequest(chunk: RequestChunk, callback: TransformCallback): void {
      }

      onResponse(chunk: ResponseChunk, callback: TransformCallback): void {
      }
    }

    const stub = sandbox.stub(console, 'log');
    const stream = new Stream();

    // Act
    stream.requestStreamPassThrough!.write({requestOptions: {}} as any);
    stream.responseStreamPassThrough!.write({requestOptions: {}} as any);

    // Assert
    expect(stub.calledTwice).to.eq(true);
  });
});
