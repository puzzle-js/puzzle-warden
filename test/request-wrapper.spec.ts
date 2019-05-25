import "reflect-metadata";

import {expect} from "chai";
import sinon from "sinon";
import faker from "faker";
import {RequestWrapper, WardenWrappedRequest} from "../src/request-wrapper";

const Request = require('request').Request;
const request = require('request');

const sandbox = sinon.createSandbox();

describe("[request-wrapper.ts]", () => {
  beforeEach(() => {

  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Request Wrapper", () => {
    // Arrange
    const requestWrapper = new RequestWrapper();

    // Assert
    expect(requestWrapper).to.be.instanceOf(RequestWrapper);
  });

  it("should support custom request configuration", () => {
    // Arrange
    const requestWrapper = new RequestWrapper();
    const spy = sandbox.stub(request, 'defaults');
    const config = {
      timeout: 3000
    } as any;

    // Act
    requestWrapper.config(config);

    // Assert
    expect(spy.calledWithExactly(config)).to.eq(true);
    expect(requestWrapper).to.be.instanceOf(RequestWrapper);
  });

  it("should call internal requestManager if name exists in configuration", () => {
    // Arrange
    const configuration = {
      name: faker.random.word(),
      url: faker.internet.url(),
      method: 'get'
    } as any;
    const isRouteRegisteredStub = sandbox.stub().returns(false);
    const handleStub = sandbox.stub();
    WardenWrappedRequest.requestManager = {
      isRouteRegistered: isRouteRegisteredStub,
      handle: handleStub
    } as any;

    // Act
    const request = new WardenWrappedRequest(configuration);

    // Assert
    expect(isRouteRegisteredStub.calledWithExactly(configuration.name)).to.eq(true);
    expect(handleStub.notCalled).to.eq(true);
    expect(request).to.be.instanceOf(Request);
  });

  it("should call use request manager if route registered", () => {
    // Arrange
    const configuration = {
      name: faker.random.word(),
      url: faker.internet.url(),
      method: 'get',
      callback: () => {
      }
    } as any;
    const isRouteRegisteredStub = sandbox.stub().returns(true);
    const handleStub = sandbox.stub();
    WardenWrappedRequest.requestManager = {
      isRouteRegistered: isRouteRegisteredStub,
      handle: handleStub
    } as any;

    // Act
    const request = new WardenWrappedRequest(configuration);

    // Assert
    expect(isRouteRegisteredStub.calledWithExactly(configuration.name)).to.eq(true);
    expect(handleStub.calledWithExactly(configuration.name, {
      headers: {},
      method: configuration.method,
      url: configuration.url
    }, configuration.callback)).to.eq(true);
    expect(request).not.to.be.instanceOf(Request);
  });

  it("should wrap module", () => {
    // Arrange
    const requestT = request.Request;
    const module = {} as any;
    const requestWrapper = new RequestWrapper();

    // Act
    requestWrapper.wrap(module);

    // Assert
    expect(request.Request).to.eq(WardenWrappedRequest);
    expect(request.Request.requestManager).to.eq(module);

    request.Request = requestT;
  });

  it("should not rewrap module", () => {
    // Arrange
    const requestT = request.Request;
    const module = {} as any;
    const module2 = {} as any;
    const requestWrapper = new RequestWrapper();

    // Act
    requestWrapper.wrap(module);

    // Assert
    expect(request.Request).to.eq(WardenWrappedRequest);
    expect(request.Request.requestManager).to.eq(module);
    expect(request.Request.requestManager).to.not.eq(module2);

    request.Request = requestT;
  });
});
