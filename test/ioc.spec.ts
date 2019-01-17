import "reflect-metadata";
import sinon from "sinon";
import {bootstrap} from "../src/ioc";
import {expect} from "chai";

const sandbox = sinon.createSandbox();

describe("[ioc.ts]", () => {
  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should register dependencies to container", () => {
    // Arrange
    const bindingMock = {
      toSelf: sandbox.stub().returnsThis(),
      inSingletonScope: sandbox.stub().returnsThis(),
    };
    const containerMock = {
      bind: sandbox.stub().returns(bindingMock)
    };

    class MyClass {
    }

    class MyClass2 {
    }

    // Act
    const classes = [MyClass, MyClass2];
    bootstrap(classes, containerMock as any);

    // Assert
    classes.forEach(constructor => expect(containerMock.bind.calledWithExactly(constructor)).to.eq(true));
    expect(bindingMock.toSelf.callCount).to.eq(classes.length);
    expect(bindingMock.inSingletonScope.callCount).to.eq(classes.length);
  });
});
