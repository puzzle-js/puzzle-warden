declare module 'fast-url-parser' {
  export function parse(url: string, parseQuery: boolean): {
    path: string,
    query: { [key: string]: string };
  };
}
