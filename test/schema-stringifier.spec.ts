import * as sinon from "sinon";
import {expect} from "chai";
import {SchemaStringifier} from "../src/schema-stringifier";
import {createRequestChunk, createResponseChunk} from "./helpers";
import faker from "faker";

const sandbox = sinon.createSandbox();
let schema: SchemaStringifier;

describe('[schema-stringigier.ts]', () => {
  beforeEach(() => {

  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should create new SchemaStringifier', () => {
    // Arrange
    const stub = sandbox.stub();
    const schema = {};

    const schemaStream = new SchemaStringifier(schema as any, stub);

    // Assert
    expect(stub.calledWithExactly(schema)).to.eq(true);
    expect(schemaStream).to.be.instanceOf(SchemaStringifier);
  });

  it('should stringify incoming request if it is json', () => {
    // Arrange
    const jsonObject = {};
    const headers = {
      [faker.random.word()]: faker.random.word()
    };
    const chunk = createRequestChunk({
      requestOptions: {
        json: true,
        body: jsonObject,
        headers
      }
    });
    const stringifiedObject = faker.random.word();
    const schema = {};
    const streamBuilder = () => sandbox.stub().returns(stringifiedObject);
    const schemaStream = new SchemaStringifier(schema as any, streamBuilder);
    const nextHandler = sandbox.stub();

    // Act
    schemaStream.onRequest(chunk, nextHandler);

    // Assert
    expect(nextHandler.calledWithExactly({
      ...chunk,
      requestOptions: {
        json: false,
        body: stringifiedObject,
        headers: {
          ...headers,
          "content-type": "application/json"
        }
      }
    })).to.eq(true);
  });

  it('should pass to next handler if request not json', () => {
    // Arrange
    const chunk = createRequestChunk({
      requestOptions: {
        json: false
      }
    });
    const schema = {} as any;
    const stringifier = sandbox.stub().returns(faker.random.word());
    const streamBuilder = () => stringifier;
    const stringifyStream = new SchemaStringifier(schema, streamBuilder);
    const nextHandler = sandbox.stub();

    // Act
    stringifyStream.onRequest(chunk, nextHandler);

    // Assert
    expect(stringifier.notCalled).to.eq(true);
    expect(nextHandler.calledWithExactly(chunk)).to.eq(true);
  });

  it('should parse incoming response if it is valid', () => {
    // Arrange
    const responseChunk = createResponseChunk({
      response: {
        body: '{}'
      }
    });
    const schema = {} as any;
    const stringifier = sandbox.stub().returns(faker.random.word());
    const streamBuilder = () => stringifier;
    const stringifyStream = new SchemaStringifier(schema, streamBuilder);
    const nextHandler = sandbox.stub();


    // Act
    stringifyStream.onResponse(responseChunk, nextHandler);

    // Assert
    expect(nextHandler.calledWithExactly({
      ...responseChunk,
      response: {
        body: {}
      }
    })).to.eq(true);
  });

  it('should return null if parse failed', () => {
    // Arrange
    const responseChunk = createResponseChunk({
      response: {
        body: '{}'
      }
    });
    const schema = {} as any;
    const stringifier = sandbox.stub().returns(faker.random.word());
    const streamBuilder = () => stringifier;
    const stringifyStream = new SchemaStringifier(schema, streamBuilder);
    const nextHandler = sandbox.stub();
    sandbox.stub(JSON, 'parse').throws();

    // Act
    stringifyStream.onResponse(responseChunk, nextHandler);

    // Assert
    expect(nextHandler.calledWithExactly({
      ...responseChunk,
      response: {
        body: null
      }
    })).to.eq(true);
  });

  it('should not parse response chunk if response or body not present', () => {
    // Arrange
    const responseChunk = createResponseChunk({
      response: {
        body: undefined
      }
    });
    const schema = {} as any;
    const stringifier = sandbox.stub().returns(faker.random.word());
    const streamBuilder = () => stringifier;
    const stringifyStream = new SchemaStringifier(schema, streamBuilder);
    const nextHandler = sandbox.stub();
    const parseStub = sandbox.stub(JSON, 'parse');

    // Act
    stringifyStream.onResponse(responseChunk, nextHandler);

    // Assert
    expect(nextHandler.calledWithExactly(responseChunk)).to.eq(true);
    expect(parseStub.notCalled).to.eq(true);
  });
});
