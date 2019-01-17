import {injectable} from "inversify";

type KeyMaker = (url: string, cookies: { [key: string]: string }, headers: { [key: string]: string }, query: { [key: string]: string }) => string

@injectable()
class Tokenizer {
  tokenize(name: string, identifier: string): KeyMaker {
    const reversedIdentifier = Tokenizer.reverseString(identifier);
    const interpolationsAdded = reversedIdentifier.replace(/{(?!\\)/g, '{$');
    const cacheKey = Tokenizer.reverseString(interpolationsAdded);
    const cacheName = name.replace(/\W/g, "");

    return new Function(`return function ${cacheName}_tokenizer(url,cookies,headers,query){return \`${cacheName}_${cacheKey}\`}`)();
  }

  private static reverseString(str: string): string {
    return str.split('').reverse().join('');
  }
}

export {
  Tokenizer
}
