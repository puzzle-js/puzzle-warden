import {reverseString} from "../src/helpers";
import {expect} from "chai";

describe("[helpers.ts]", () => {
  it("should reverse string", () => {
    // Arrange
    const word = '12345';

    // Act
    const reversed = reverseString(word);

    // Assert
    expect(reversed).to.eq('54321');
  });
});
