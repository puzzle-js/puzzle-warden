import "reflect-metadata";

import sinon, {SinonMock} from "sinon";
import {Warden} from "../src/warden";
import {expect} from "chai";
import {Cache} from "../src/cache/cache";

const sandbox = sinon.createSandbox();
const cache = new Cache();

let cacheMock: SinonMock;

describe("[sentry.ts]", () => {
  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  beforeEach(() => {
    cacheMock = sandbox.mock(cache);
  });

  it("should create new Sentry instance", () => {
    // Arrange
    const sentry = new Warden(cache);

    // Assert
    expect(sentry).to.be.instanceOf(Warden);
  });
});
