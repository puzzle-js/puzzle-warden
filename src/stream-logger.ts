import {RequestChunk, ResponseChunk, Streamer} from "./streamer";
import chalk from "chalk";

const LOG_COLORS = {
  responseFailed: chalk.bold.bgRed.black,
  responseSuccessful: chalk.bold.bgGreen.black,
  requestNoStatus: chalk.bold.yellow
};

class StreamLogger {
  static onRequest(chunk: RequestChunk, currentHandler: Streamer, previousStream?: Streamer, nextStream?: Streamer) {
    const keyText = StreamLogger.getKeyColor(chunk)(StreamLogger.getKeyString(chunk));

    if (previousStream) {
      console.info(keyText, previousStream.name, '--->', currentHandler.name);
    } else {
      console.info(keyText, '|--->', currentHandler.name);
    }
  }

  static onResponse(chunk: RequestChunk, currentHandler: Streamer, previousStream?: Streamer, nextStream?: Streamer) {
    const keyText = StreamLogger.getKeyColor(chunk)(StreamLogger.getKeyString(chunk));

    if (nextStream) {
      console.info(keyText, currentHandler.name, '<---', nextStream.name);
    } else {
      console.info(keyText, currentHandler.name, '<---|');
    }
  }

  static getKeyColor(chunk: ResponseChunk) {
    if (chunk.error) return LOG_COLORS.responseFailed;
    if (chunk.response) return LOG_COLORS.responseSuccessful;

    return LOG_COLORS.requestNoStatus;
  }

  static getKeyString(chunk: RequestChunk) {
    return `${chunk.id} | ${chunk.key}:`;
  }
}

export {
  LOG_COLORS,
  StreamLogger
};
