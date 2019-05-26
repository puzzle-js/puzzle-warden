# Benchmark Results

You will find comparison results for warden with [request](https://github.com/request/request). Used [nock](https://github.com/nock/nock) to simulate HTTP server and [custom test runner](/benchmarks/benchmarker.ts) to measure results. You can run same tests by yourself

```bash
TS_NODE_FILES=true node -r ts-node/register  benchmarks/holder.ts
``` 

## Tests
- [Raw](#raw)
- [Holder](#holder)
- [Cache](#cache)
- [Retry](#retry)

## Raw
All modules are disabled on warden.

```js
[
    {
        "name": "Request Module",
        "stats": {
            "runs": 10000,
            "success": 10000,
            "errors": 0,
            "duration": 16827.367216
        }
    },
    {
        "name": "Warden",
        "stats": {
            "runs": 10000,
            "success": 10000,
            "errors": 0,
            "duration": 16868.094933
        }
    }
]
```

Warden almost puts 0.24% overhead on request module. Almost nothing.


## Holder
Only holder module enabled. Running on 500 parallel requests with 1/100 chance of same request. This means only 5 same concurrent requests

```js
[
    {
        "name": "Request Module",
        "stats": {
            "runs": 100000,
            "success": 100000,
            "errors": 0,
            "duration": 17612.177992
        }
    },
    {
        "name": "Warden",
        "stats": {
            "runs": 100000,
            "success": 100000,
            "errors": 0,
            "duration": 17501.875109
        }
    }
]
```

Warden wins this one clearly. Results will be better for warden when transferring over real network.

## Cache
Cache module active. Running with 100 parallelism and 1000 different requests.

```js
[
    {
        "name": "Request Module",
        "stats": {
            "runs": 1000,
            "success": 1000,
            "errors": 0,
            "duration": 1702.591433
        }
    },
    {
        "name": "Warden",
        "stats": {
            "runs": 1000,
            "success": 1000,
            "errors": 0,
            "duration": 22.202227
        }
    }
]
```

This one is no-brainer. Cached one will be faster all the time. But cache implementation on Warden is amazingly fast.

## Retry
Retry module active. Nock is configured to simulate a production class server with >0.99 success rate.
Running tests 100 parallelism and 1 retry amount.

```js
[
    {
        "name": "Request Module",
        "stats": {
            "runs": 5000,
            "success": 4956,
            "errors": 44,
            "duration": 4216.685647
        }
    },
    {
        "name": "Warden",
        "stats": {
            "runs": 5000,
            "success": 5000,
            "errors": 0,
            "duration": 4222.504931
        }
    }
]
```

request module is barely faster but it resulted with 44 errors. Meanwhile Warden has full success rate.
