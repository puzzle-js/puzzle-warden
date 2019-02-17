import "reflect-metadata";

import {Tokenizer} from "../src/tokenizer";
import {expect} from "chai";

describe("[tokenizer.ts]", () => {
  it("should create new tokenizer", () => {
    // Arrange
    const tokenizer = new Tokenizer();

    // Assert
    expect(tokenizer).to.be.instanceOf(Tokenizer);
  });

  it("should create new tokenizer from key without interpolation", () => {
    // Arrange
    const tokenizer = new Tokenizer();
    const name = '_name_';
    const cacheKey = '_special_cache_key';
    const method = 'get';

    // Act
    const keyMaker = tokenizer.tokenize(name, cacheKey);
    const key = keyMaker('/path',{},{},{}, method);

    // Assert
    expect(keyMaker).to.be.a('function');
    expect(key).to.eq('_name___special_cache_key');
  });

  it("should create new tokenizer from key with interpolation", () => {
    // Arrange
    const tokenizer = new Tokenizer();
    const name = '_name_';
    const cacheKey = '_special_{cookie.test}_{headers.test}_{query.test}_{url}_key';
    const method = 'get';

    // Act
    const keyMaker = tokenizer.tokenize(name, cacheKey);
    const key = keyMaker('/he',{test:'c'},{test:'a'},{test:'c'}, method);

    // Assert
    expect(keyMaker).to.be.a('function');
    expect(key).to.eq('_name___special_c_a_c_/he_key');
  });

  it("should create new tokenizer from key with interpolation wıth default ?", () => {
    // Arrange
    const tokenizer = new Tokenizer();
    const name = '_name_';
    const cacheKey = '_special_{cookie.test}_{headers.test}_{query.test}_{url}_key';
    const method = 'get';

    // Act
    const keyMaker = tokenizer.tokenize(name, cacheKey);
    const key = keyMaker('/he',{},{test:'a'},{test:'c'}, method);

    // Assert
    expect(keyMaker).to.be.a('function');
    expect(key).to.eq('_name___special_?_a_c_/he_key');
  });

  it("should create new tokenizer from key with interpolation", () => {
    // Arrange
    const tokenizer = new Tokenizer();
    const name = '_name_';
    const cacheKey = '_special_{cookie.test}_\\{escaped}_{headers.test}_{query.test}_{url}_key';
    const method = 'get';

    // Act
    const keyMaker = tokenizer.tokenize(name, cacheKey);
    const key = keyMaker('/he',{test:'c'},{test:'a'},{test:'c'}, method);

    // Assert
    expect(keyMaker).to.be.a('function');
    expect(key).to.eq('_name___special_c_{escaped}_a_c_/he_key');
  });
});
