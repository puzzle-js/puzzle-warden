import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import faker from "faker";
import {Network} from "../src/network";
import {RequestWrapper} from "../src/request-wrapper";
import request from "request";

const requestWrapper = new RequestWrapper();
const sandbox = sinon.createSandbox();

let requestWrapperMock: SinonMock;

describe("[network.ts]", () => {
  beforeEach(() => {
    requestWrapperMock = sandbox.mock(requestWrapper);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Network", () => {
    // Arrange
    const network = new Network(requestWrapper);

    // Assert
    expect(network).to.be.instanceOf(Network);
  });

  it("should pass incoming response to left handler", () => {
    // Arrange
    const chunk = {} as any;
    const network = new Network(requestWrapper);
    const spy = sandbox.stub();

    // Act
    network
      .onResponse(chunk, spy);

    // Assert
    expect(spy.calledWithExactly(undefined, chunk));
  });

  it("should send outgoing request to request wrapper", () => {
    // Arrange
    const spy = sandbox.stub();
    const chunk = {
      requestOptions: {
        method: 'get',
        url: faker.internet.url()
      },
      key: faker.random.word(),
      cb: spy
    } as any;
    const network = new Network(requestWrapper);
    const response = {
      body: faker.random.word()
    };
    const parsedData = {};
    const responseStub = sandbox.stub(network, 'respond');
    const requestStub = sandbox
      .stub(requestWrapper.request, 'get')
      .callsArgWith(1, null, response, parsedData) as any;

    // Act
    network.onRequest(chunk, spy);

    // Assert
    expect(requestStub.calledWithExactly(chunk.requestOptions, sinon.match.any)).to.eq(true);
    expect(spy.calledWithExactly(undefined, null)).to.eq(true);
    expect(responseStub.calledWith({
      key: chunk.key,
      cb: chunk.cb,
      response: response as unknown as request.Response,
      error: null as any,
      requestOptions: chunk.requestOptions as any
    })).to.eq(true);
  });

});
