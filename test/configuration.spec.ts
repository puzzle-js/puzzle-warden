import "reflect-metadata";

import {expect} from "chai";
import sinon from "sinon";
import {Configuration} from "../src/configuration";

const sandbox = sinon.createSandbox();

describe("[configuration.ts]", () => {
  beforeEach(() => {

  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new configuration", () => {
    // Arrange
    const configuration = new Configuration();

    // Assert
    expect(configuration).to.be.instanceOf(Configuration);
  });


});
