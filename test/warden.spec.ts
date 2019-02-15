import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {Warden} from "../src/warden";
import {CacheFactory} from "../src/cache-factory";

const sandbox = sinon.createSandbox();

const cacheFactory = new CacheFactory();

let cacheFactoryMock: SinonMock;

describe("[warden.ts]", () => {
  beforeEach(() => {
    cacheFactoryMock = sandbox.mock(cacheFactory);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Warden instance", () => {
    // Arrange
    const warden = new Warden(cacheFactory);

    // Assert
    expect(warden).to.be.instanceOf(Warden);
  });
});
