import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {RequestManager, RouteConfiguration} from "../src/request-manager";
import {CacheFactory} from "../src/cache-factory";
import {StreamFactory} from "../src/stream-factory";
import {Tokenizer} from "../src/tokenizer";
import faker from "faker";

const sandbox = sinon.createSandbox();

const cacheFactory = new CacheFactory();
const streamFactory = new StreamFactory(cacheFactory);
const tokenizer = new Tokenizer();


let streamFactoryMock: SinonMock;
let tokenizerMock: SinonMock;

describe("[request-manager]", () => {
  beforeEach(() => {
    streamFactoryMock = sandbox.mock(streamFactory);
    tokenizerMock = sandbox.mock(tokenizer);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Request Manager", () => {
    // Arrange
    const requestManager = new RequestManager(streamFactory, tokenizer);

    // Assert
    expect(requestManager).to.be.instanceOf(RequestManager);
  });

  it("should create new stream and register to request manager", () => {
    // Arrange
    const routeName = faker.random.word();
    const routeConfiguration = {
      identifier: 'test'
    } as RouteConfiguration;
    const keyMaker = {};
    const network = {};
    const streamHead = {
      connect: sandbox.stub()
    };
    streamFactoryMock.expects('createHead').returns(streamHead);
    streamFactoryMock.expects('createNetwork').returns(network);
    tokenizerMock.expects('tokenize').withExactArgs(routeName, routeConfiguration.identifier).returns(keyMaker);
    const requestManager = new RequestManager(streamFactory, tokenizer);


    // Act
    requestManager.register(routeName, routeConfiguration);
    expect(streamHead.connect.calledWithExactly(network)).to.eq(true);
  });
});
