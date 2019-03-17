import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import faker from "faker";
import {RequestWrapper} from "../src/request-wrapper";
import request from "request";

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

  it("should call internal requestManager if name exists in connfiguration", () => {
    // Arrange
    // const configuration = {
    //   name: faker.random.word(),
    //   url: faker.internet.url(),
    //   method:
    // }

    // Act

    // Assert

  });
});
