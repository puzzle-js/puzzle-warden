import "reflect-metadata";

import {Warden} from "../src/warden";
import {expect} from "chai";

describe("[sentry.ts]", () => {
  it("should create new Sentry instance", () => {
    // Arrange
    const sentry = new Warden();

    // Assert
    expect(sentry).to.be.instanceOf(Warden);
  });
});
