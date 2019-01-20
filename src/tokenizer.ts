import {injectable} from "inversify";
import {reverseString} from "./helpers";

type KeyMaker = (
  url: string,
  cookies: { [key: string]: string },
  headers: { [key: string]: string },
  query: { [key: string]: string },
) => string;

@injectable()
class Tokenizer {
  tokenize(name: string, identifier: string): KeyMaker {
    const reversedIdentifier = reverseString(identifier);
    const interpolationsAdded = reversedIdentifier.replace(/{(?!\\)/g, "{$");
    const cacheKey = reverseString(interpolationsAdded);
    const cacheName = name.replace(/\W/g, "");

    const fnContent = `${cacheName}_tokenizer(url,cookies,headers,query){return \`${cacheName}_${cacheKey}\`}`;
    const fn = new Function(`return function ${fnContent}`);

    return fn();
  }
}

export {
  Tokenizer,
};
