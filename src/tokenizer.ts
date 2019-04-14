import {reverseString} from "./helpers";

type KeyMaker = (
  url: string,
  cookie: { [key: string]: string },
  headers: { [key: string]: string },
  query: { [key: string]: string },
  method: string,
) => string;


class Tokenizer {
  tokenize(name: string, identifier: string): KeyMaker {
    const reversedIdentifier = reverseString(identifier);
    const interpolationsAdded = reversedIdentifier
      .replace(/{(?!\\)/g, `{$`)
      .replace(/}([\w|.]+){(?!\\)\$/g, `}"?"||$1{\$`);
    const cacheKey = reverseString(interpolationsAdded);
    const cacheName = name.replace(/\W/g, "");

    const fnContent = `${cacheName}_tokenizer(url,cookie={},headers={},query={},method){return \`${cacheName}_${cacheKey}\`}`;
    const fn = new Function(`return function ${fnContent}`);

    return fn();
  }
}

export {
  KeyMaker,
  Tokenizer,
};
