import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import faker from "faker";
import {RequestWrapper} from "../src/request-wrapper";

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
    const requestWrapper = new RequestWrapper({
      timeout: 3000
    });

    // Assert
    expect(requestWrapper).to.be.instanceOf(RequestWrapper);
  });
});
