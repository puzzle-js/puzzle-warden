import {RequestChunk, ResponseChunk} from "../src/streamer";
import faker from "faker";


const createRequestChunk: (ovveride?: any) => RequestChunk = (override: any = {}) => (
  {
    id: faker.random.number(),
    key: faker.random.word(),
    requestOptions: {},
    ...override
  }
);


const createResponseChunk: (ovveride?: any) => ResponseChunk = (override: any = {}) => (
  {
    id: faker.random.number(),
    key: faker.random.word(),
    requestOptions: {},
    ...override
  }
);

export {
  createRequestChunk,
  createResponseChunk
};
