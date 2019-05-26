<p align="center"><img width="400" alt="Warden" src="./logo.png"></p>

Warden is an outgoing request optimizer for creating fast and scalable applications. 

[![CircleCI](https://circleci.com/gh/puzzle-js/puzzle-warden/tree/master.svg?style=svg)](https://circleci.com/gh/puzzle-js/puzzle-warden/tree/master) 
![npm](https://img.shields.io/npm/dt/puzzle-warden.svg) 
![npm](https://img.shields.io/npm/v/puzzle-warden.svg) 
[![Known Vulnerabilities](https://snyk.io/test/github/puzzle-js/puzzle-warden/badge.svg)](https://snyk.io/test/github/puzzle-js/puzzle-warden) 
[![codecov](https://codecov.io/gh/puzzle-js/puzzle-warden/branch/master/graph/badge.svg)](https://codecov.io/gh/puzzle-js/puzzle-warden)
[![Codacy](https://api.codacy.com/project/badge/Grade/e806d72373414fd9818ab2a403f1b36d)](https://www.codacy.com/app/Acanguven/puzzle-warden?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=puzzle-js/puzzle-warden&amp;utm_campaign=Badge_Grade) 

## Features
- 📥 **Smart Caching** Caches requests by converting HTTP requests to smart key strings. ✅
- 🚧 **Request Holder** Stopping same request to be sent multiple times. ✅
- 🔌 **Support** Warden can be used with anything but it supports [request](https://github.com/request/request) out of the box. ✅
- 😎 **Easy Implementation** Warden can be easily implemented with a few lines of codes. ✅
- 🔁 **Request Retry** Requests will automatically be re-attempted on recoverable errors. ✅
- 📇 **Schema Stringifier** Warden uses a schema which can be provided by you for parsing JSON stringify. ✅
- 🚥 **API Queue** Throttles API calls to protect target service. 📝
- 👻 **Request Shadowing** Copies a fraction of traffic to a new deployment for observation. 📝
- 🚉 **Reverse Proxy** It can be deployable as an external application which can serve as a reverse proxy. 📝
- 📛 **Circuit Breaker** Immediately refuses new requests to provide time for the API to become healthy. 📝

![Warden Achitecture](./warden_architecture.svg)

## Getting started
- [Installing](#installing)
- [Quick Guide](#quick-guide)
- [Benchmarks](./benchmarks/BENCHMARK.md)
- [Examples](./examples/)
- [Identifier](#identifier)
- [Registering Route](#registering-route)
- [Cache](#cache)
- [Retry](#retry)
- [Holder](#holder)
- [Schema](#schema)
- [Api](#api)

### Installing

Yarn
```bash
yarn add puzzle-warden
```
Npm
```bash
npm i puzzle-warden --save
```

### Quick Guide

#### 1.  Register Route
```js
const warden = require('puzzle-warden');
warden.register('test', {
  identifier: '{query.foo}_{cookie.bar}',
  cache: true,
  holder: true
});
```

#### 2. Send Request

##### Using Route Registration
```js
const routeRegistration = warden.register('test', {
  identifier: '{query.foo}_{cookie.bar}',
  cache: true,
  holder: true
});

routeRegistration({
  url: `https://postman-echo.com/get?foo=value`,
  headers: {
    cookie: `bar=value`
  },
  method: 'get',
  gzip: true,
  json: true
}, (err, response, data) => {
  console.log(data);
});
```

##### Using Warden
```js
warden.request('test', {
  url: `https://postman-echo.com/get?foo=value`,
  headers: {
    cookie: `bar=value`
  },
  method: 'get',
  gzip: true,
  json: true
}, (err, response, data) => {
  console.log(data);
});
```

##### Using [Request](https://github.com/request/request) Module
```js
request({
  name: 'test',
  url: `https://postman-echo.com/get?foo=value`,
  headers: {
    cookie: `bar=value`
  },
  method: 'get',
  gzip: true,
  json: true
}, (err, response, data) => {
  console.log(data);
});
```
___

### Identifier

Warden uses identifiers to convert HTTP requests to unique keys. Using these keys it is able to implement cache, holder and other stuff.
Let's assume we want to send a GET request to `https://postman-echo.com/get?foo=value&bar=anothervalue`. And we want to cache responses based on query string `foo`.
We should use the identifier `{query.foo}`. There are 5 types of identifier variables.

- `{url}` Url of the request
- `{cookie}` Cookie variable. You can use `{cookie.foo}` to make request unique by foo cookie value.
- `{headers}` Header variable. You can use `{headers.Authorization}` to make request unique by Authorization header
- `{query}` Query string variables. You can use `{query.foo}` to make request unique by query name.
- `{method}` HTTP method. GET, POST, etc.

You can also use javascript to create custom identifiers.

- `{url.split('product-')[1]}` Works for link `/item/product-23`.

Identifiers can be chained like `{query.foo}_{cookie.bar}`.

Identifiers get converted to keys for each request. Let's assume we have an identifier like `{query.foo}_{method}`
We use this identifier for a GET request to `/path?foo=bar`. Then the unique key of this request will be `bar_GET`.

### Registering Route

You can simply register a route providing an identifier and module configurations. Please see [Identifier](#Identifier)

```js
warden.register('test', {
  identifier: '{query.foo}_{cookie.bar}',
  cache: true,
  holder: true
});
```

`identifier` is an optional field. If an identifier is not provided warden will be use generic identifier which is `${name}_${url}_${JSON.stringify({cookie, headers, query})}_${method}`.

### Cache

You can simply enable cache with default values using.

```js
warden.register('test', {
  identifier: '{query.foo}_{cookie.bar}',
  cache: true,
  holder: true
});
```

Or you can customize cache configuration by passing an object.

```js
warden.register('test', {
  identifier: '{query.foo}_{cookie.bar}',
  cache: {
    plugin: 'memory',
    strategy: 'CacheThenNetwork',
    duration: '2m'
  },
  holder: true
});
```

Default values and properties

| Property | Required | Default Value | Definition |
| :---         | :---: | ---: | :--- |
| plugin       | ❌ | memory    | Where cached data will be stored. Please see [Cache Plugins](#cache-plugins) for more information. Currently, only `memory` available. |
| strategy     | ❌ | CacheThenNetwork | Controls when and how things will be cached. Please see [Caching Strategy](#caching-strategy) for more information. |
| duration     | ❌ |    1m   | Caching Duration. You can use `number` for ms. Or you can use `1m` `1h` `1d` etc. Please see [ms](https://github.com/zeit/ms) for full list|
| cacheWithCookie     | ❌ |    false   | Warden never caches responses including set-cookie header. To enable this pass this property as `true` |


#### Cache Plugins

Cache plugins control where cache will be stored. These are available plugins:

- __Memory__ - ✅
- [Couchbase](./src/couchbase-cache.ts) - ✅
- [Custom Plugin Support](#warden.registerCachePlugin()) - ✅ 
- Redis - 📝 [Todo](https://github.com/puzzle-js/puzzle-warden/projects/1#card-20220030)


##### Custom Plugins

Anything that implements interface below can be used as Cache Plugin.
```typescript
interface CachePlugin {
  get<T>(key: string): Promise<T | null>;

  set(key: string, value: unknown, ms?: number): Promise<void>;
}
```

You first register the cache plugin
```js
warden.registerCachePlugin('mySuperCache', {
  set(){},
  get(){}
});
```

Then make route configuration with your plugin name

```js
warden.register('test', {
  identifier: '{query.foo}_{cookie.bar}',
  cache: {
    plugin: 'mySuperCache',
    strategy: 'CacheThenNetwork',
    duration: '2m'
  },
  holder: true
});
```

#### Caching Strategy

Caching strategies defines how things will be cached and when cached responses will be used. Currently, the only available caching strategy is [CacheThenNetwork](#cachethennetwork)

##### CacheThenNetwork

Simple old school caching. Asks cache plugin if it has a valid cached response. If yes, returns the cached value as the response. If no, passes the request to the next handler. When it receives the response, it caches and returns the value as a response.

### Holder

Holder prevents same HTTP requests to be sent at the same time. 
Let's assume we have an identifier for a request: `{query.foo}`. We send a HTTP request `/product?foo=bar`. While waiting for the response, warden received another HTTP request to the same address which means both HTTP requests are converted to the same key. Then Warden stops the second request. After receiving the response from the first request, Warden returns both requests with the same response by sending only one HTTP request.

### Schema

Warden uses custom object -> string transformation to improve performance. Schema will only affect `POST` requests with json body.

```js
warden.register('test', {
  identifier: '{query.foo}',
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      age: {
        type: 'number'
      }
    }
  }
});

warden.request('test', {
  url: 'https://github.com/puzzle-js/puzzle-warden?foo=bar',
  method: 'post',
  json: true,
  body: {
    name: 'Test',
    age: 23
  }
}, (err, response, data) => {
  console.log(data);
})
```

To enable Schema module, you need to give schema option when registering route. This schema options must be compatible with [jsonschema](http://json-schema.org/)

You should use `json: true` property. 

### Retry

When the connection fails with one of `ECONNRESET`, `ENOTFOUND`, `ESOCKETTIMEDOUT`, `ETIMEDOUT`, `ECONNREFUSED`, `EHOSTUNREACH`, `EPIPE`, `EAI_AGAIN` or when an HTTP 5xx or 429 error occurrs, the request will automatically be re-attempted as these are often recoverable errors and will go away on retry.

```js
warden.register('routeName', {
  retry: {
    delay: 100,
    count: 1,
    logger: (retryCount) => {
      console.log(retryCount);
    }
  }
}); 

warden.register('routeName', {
  retry: true // default settings
}); 
```

Default values and properties

| Property | Required | Default Value | Definition |
| :---         | :---: | ---: | :--- |
| delay       | ❌ | 100    | Warden will wait for 100ms before retry |
| count     | ❌ | 1 | It will try for 1 time by default |
| logger     | ❌ |       | Logger will be called on each retry with retry count|


### Api

#### warden.register()

Check [Registering Route](#registering-route) section for better information and usage details

```js
warden.register('routeName', routeConfiguration);
```

#### warden.request()

Sends a HTTP request using warden (internally uses [request](https://github.com/request/request))
```js
warden.request('test', {
  url: `https://postman-echo.com/get?foo=value`,
  method: 'get'
}, (err, response, data) => {
  console.log(data);
});
```

Any valid property for request module can be used.

#### warden.requestConfig()

Works exactly like [request defaults](https://github.com/request/request#requestdefaultsoptions). It can be used for settings default values for requests.

```js
warden.requestConfig({
  headers: {'x-token': 'my-token'}
});
```
Sets `x-token` header with value `my-token` for all HTTP requests

#### warden.isRouteRegistered()

Checks whether route is registered.
```js
warden.isRouteRegistered('route'); // true | false
```

#### warden.unregisterRoute()

Unregisters route
```js
warden.unregisterRoute('route');
```

#### warden.registerCachePlugin()

Unregisters route
```js
warden.registerCachePlugin('pluginName', {
  set(){
    
  },
  get(){
    
  }
});
```
