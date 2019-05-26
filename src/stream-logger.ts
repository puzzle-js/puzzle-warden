import {RequestChunk, ResponseChunk, Streamer} from "./streamer";
import chalk from "chalk";

const COLORS = {
  responseFailed: chalk.bold.bgRed.black,
  responseSuccessful: chalk.bold.bgGreen.black,
  requestNoStatus: chalk.bold.yellow
};

class StreamLogger {
  static onRequest(chunk: RequestChunk, currentHandler: Streamer, previousStream?: Streamer, nextStream?: Streamer){
    const keyText = StreamLogger.getKeyColor(chunk)(`${chunk.id} | ${chunk.key}:`);

    if (previousStream) {
      console.debug(keyText, previousStream.name, '--->', currentHandler.name);
    } else {
      console.debug(keyText, '|--->', currentHandler.name);
    }
  }

  static onResponse(chunk: RequestChunk, currentHandler: Streamer, previousStream?: Streamer, nextStream?: Streamer){
    const keyText = StreamLogger.getKeyColor(chunk)(`${chunk.id}|${chunk.key}:`);

    if (nextStream) {
      console.debug(keyText, currentHandler.name, '<---', nextStream.name);
    } else {
      console.debug(keyText, currentHandler.name, '<---|');
    }
  }

  private static getKeyColor(chunk: ResponseChunk){
    if(chunk.error) return COLORS.responseFailed;
    if(chunk.response) return COLORS.responseSuccessful;

    return COLORS.requestNoStatus;
  }
}

export {
  StreamLogger
};
