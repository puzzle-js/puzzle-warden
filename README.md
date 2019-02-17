# Warden 
`Under Development`

Warden is an outgoing request optimizer for creating fast and scalable applications. Warden is being used in [PuzzleJs](https://github.com/puzzle-js/puzzle-js) framework for gateway communication.

## Features
- 📥  **Smart Caching** Caches requests by converting HTTP requests to smart key strings. ✅
- 🚧  **Request Holder** Stopping same request to be sent multiple times. ✅
- 🚥  **API Queue** Throttles API calls to protect target service. 📝
- 😎  **Easy Implementation** Warden can be easily implemented with a few lines of codes. ✅
- 👻  **Request Shadowing** Copies a fraction of traffic to a new deployment for observation. 📝
- 🔌  **Support** Warden can be used with anything but it has out of the box support for [request](https://github.com/request/request). 📝
- 🚉  **Reverse Proxy** It can be deployable as an external application which can serve as reverse proxy. 📝
- 🔩  **Ingress Controller** Warden can be used as Ingress Controller. 📝
- 📛  **Circuit Breaker** Immediately refuses new requests to provide time for the API to become healthy. 📝

![Warden Achitecture](/warden_architecture.svg)

## Getting started
-   [Installing](#Installing)

### Installing

Yarn
```
yarn add puzzle-warden
```
Npm
```
npm i puzzle-warden --save
```



