declare module 'fast-url-parser' {
  export function parse(url: string, parseQuery: boolean): {
    pathname: string,
    query: { [key: string]: string };
  };
}
