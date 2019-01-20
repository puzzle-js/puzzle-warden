import "reflect-metadata";

import sinon, {SinonMock} from "sinon";
import {Warden} from "../src/warden";
import {expect} from "chai";
import {Cache} from "../src/cache/cache";
import {Configuration} from "../src/configuration";

const sandbox = sinon.createSandbox();
const configuration = new Configuration();
const cache = new Cache(configuration);

let cacheMock: SinonMock;
let configurationMock: SinonMock;

describe("[warden.ts]", () => {
  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  beforeEach(() => {
    cacheMock = sandbox.mock(cache);
    configurationMock = sandbox.mock(configuration);
  });

  it("should create new Warden instance", () => {
    // Arrange
    const sentry = new Warden(cache, configuration);

    // Assert
    expect(sentry).to.be.instanceOf(Warden);
  });

  it("should create a new Warden instance when dependency not injected", () => {
    // Arrange
    const warden = new Warden();

    // Assert
    expect(warden).to.be.instanceOf(Warden);
  });
});
