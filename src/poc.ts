// "use strict";
//
// const reverse = (str: string) => str.split('').reverse().join('');
// const createTokenizer = (cacheName: string, cacheString: string) => {
//   cacheString = reverse(reverse(cacheString)
//     .replace(/{(?!\\)/g, '{$'));
//   cacheName = cacheName.replace(/\W/g, "");
//
//   return new Function(`return function ${cacheName}_tokenizer(url,cookies,headers,query){return \`${cacheName}_${cacheString}\`}`)();
// };
//
// const tokenizer = createTokenizer('product-detail', '{cookies.test}_and_\\{test_done_end');
//
// const key = tokenizer('https://localhost:4446', {test: 24}, {}, {});
//
// console.log(key);
//
// const storefrontConfig = {
//   plugin: {
//     type: 'couchbase',
//     //couchbase bilgileri
//   }
// };
//
// const gatewayRule = {
//   cache: {
//     name: 'name',
//     key: 'rule_{cookies.blabla}',
//     strategy: 'cacheThenNetwork',
//     ttl: '2m'
//   }
// };
//
//
// // ['cacheThenNetwork', 'networkThenCache', 'FastestFirst', 'CacheThenUpdate']
//
// const strategy = {
//   order: ['cache', 'network'],
//   update: true,
//
// };
