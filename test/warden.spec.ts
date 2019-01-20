import "reflect-metadata";

import sinon, {SinonMock} from "sinon";
import {Warden} from "../src/warden";
import {expect} from "chai";
import {Configuration} from "../src/configuration";
import {RequestManager} from "../src/request-manager";

const sandbox = sinon.createSandbox();
const configuration = new Configuration();
const requestManager = {} as RequestManager;

let requestManagerMock: SinonMock;
let configurationMock: SinonMock;

describe("[warden.ts]", () => {
  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  beforeEach(() => {
    requestManagerMock = sandbox.mock(requestManager);
    configurationMock = sandbox.mock(configuration);
  });

  it("should create new Warden instance", () => {
    // Arrange
    const sentry = new Warden(configuration, requestManager);

    // Assert
    expect(sentry).to.be.instanceOf(Warden);
  });
});
