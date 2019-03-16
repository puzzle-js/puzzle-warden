import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import faker from "faker";
import {Network} from "../src/network";
import {RequestWrapper} from "../src/request-wrapper";

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
    const chunk = {
      requestOptions: {
        method: 'get',
        url: faker.internet.url()
      },
      key: faker.random.word()
    } as any;
    const network = new Network(requestWrapper);
    const spy = sandbox.stub();
    const response = {};
    const parsedData = {};
    const responseStub = sandbox.stub(network, 'respond');
    const requestStub = sandbox
      .stub(requestWrapper.request, 'get')
      .callsArgWith(1, null, response, parsedData) as any;

    // Act
    network.onRequest(chunk, spy);

    // Assert
    expect(requestStub.calledWithExactly(chunk.requestOptions.url, sinon.match.any)).to.eq(true);
    expect(spy.calledWithExactly(undefined, null)).to.eq(true);
    expect(responseStub.calledWith({
      key: chunk.key,
      cb: chunk.cb,
      data: parsedData,
      error: null
    })).to.eq(true);
  });
});
