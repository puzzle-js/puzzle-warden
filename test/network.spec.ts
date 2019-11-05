import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import faker from "faker";
import nock from "nock";
import * as http from "http";
import {Network} from "../src/network";

const sandbox = sinon.createSandbox();


describe("[network.ts]", () => {
  beforeEach(() => {

  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Network", () => {
    // Arrange
    const network = new Network(faker.random.word());

    // Assert
    expect(network).to.be.instanceOf(Network);
  });

  it('should send request (get)', (done) => {
    // Arrange
    const url = faker.internet.url();
    const responseContent = {data: faker.random.word()};
    const spy = sandbox.stub();
    const scope = nock(url).get('/').reply(200, responseContent);
    const chunk = {
      requestOptions: {
        method: 'get',
        url: `${url}/`,
        json: true
      },
      key: faker.random.word(),
      cb: spy
    } as any;
    const network = new Network(faker.random.word());
    sandbox.stub(network as any, 'respond')
      .callsFake(chunk => {
        expect(chunk).to.deep.include({
          key: chunk.key,
          cb: chunk.cb,
          requestOptions: chunk.requestOptions
        });

        expect(chunk.response.body).to.deep.eq(responseContent);
        done();
    });

    // Act
    network.onRequest(chunk);
  });

  it('should send request (post)', (done) => {
    // Arrange
    const url = faker.internet.url();
    const responseContent = {data: faker.random.word()};
    const spy = sandbox.stub();
    const scope = nock(url).post('/', {request: true}).reply(200, responseContent);
    const chunk = {
      requestOptions: {
        method: 'post',
        url: `${url}/`,
        body: {request: true},
        json: true
      },
      key: faker.random.word(),
      cb: spy
    } as any;
    const network = new Network(faker.random.word());
    sandbox.stub(network as any, 'respond')
      .callsFake(chunk => {
        expect(chunk).to.deep.include({
          key: chunk.key,
          cb: chunk.cb,
          requestOptions: chunk.requestOptions
        });

        expect(chunk.response.body).to.deep.eq(responseContent);
        done();
      });

    // Act
    network.onRequest(chunk);
  });

  it('should send request (get raw)', (done) => {
    // Arrange
    const url = faker.internet.url();
    const responseContent = {data: faker.random.word()};
    const spy = sandbox.stub();
    const scope = nock(url).get('/').reply(200, responseContent);
    const chunk = {
      requestOptions: {
        method: 'get',
        url: `${url}/`
      },
      key: faker.random.word(),
      cb: spy
    } as any;
    const network = new Network(faker.random.word());
    sandbox
      .stub(network as any, 'respond')
      .callsFake(chunk => {
        expect(chunk).to.deep.include({
          key: chunk.key,
          cb: chunk.cb,
          requestOptions: chunk.requestOptions
        });

        expect(chunk.response.body).to.eq(JSON.stringify(responseContent));
        done();
      });

    // Act
    network.onRequest(chunk);
  });

  it('should send request (get raw) exception', (done) => {
    // Arrange
    const url = faker.internet.url();
    const responseContent = {data: faker.random.word()};
    const spy = sandbox.stub();
    const scope = nock(url).get('/').replyWithError("Failed");
    const chunk = {
      requestOptions: {
        method: 'get',
        url: `${url}/`
      },
      key: faker.random.word(),
      cb: spy
    } as any;
    const network = new Network(faker.random.word());
    sandbox
      .stub(network as any, 'respond')
      .callsFake(chunk => {
        expect(chunk).to.deep.include({
          key: chunk.key,
          cb: chunk.cb,
          requestOptions: chunk.requestOptions,
        });

        expect(chunk.error.toString()).to.include("Failed");

        done();
      });

    // Act
    network.onRequest(chunk);
  });
});
