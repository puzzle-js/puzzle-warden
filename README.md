# Warden

Warden is an outgoing request optimizer for creating fast and scalable applications. Warden is being used in [PuzzleJs](https://github.com/puzzle-js/puzzle-js) framework for gateway communication.

[![CircleCI](https://circleci.com/gh/puzzle-js/puzzle-warden/tree/master.svg?style=svg)](https://circleci.com/gh/puzzle-js/puzzle-warden/tree/master) ![npm](https://img.shields.io/npm/dt/puzzle-warden.svg) ![npm](https://img.shields.io/npm/v/puzzle-warden.svg) ![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/puzzle-js/puzzle-warden.svg)

## Features
- 📥  **Smart Caching** Caches requests by converting HTTP requests to smart key strings. ✅
- 🚧  **Request Holder** Stopping same request to be sent multiple times. ✅
- 🔌  **Support** Warden can be used with anything but it has out of the box support for [request](https://github.com/request/request). ✅
- 😎  **Easy Implementation** Warden can be easily implemented with a few lines of codes. ✅
- 🔁  **Request Retry** Requests will automatically be re-attempted on recoverable errors. 📝
- 📇  **Schema Parser** Uses provided schema for parsing json faster. 📝
- 🚥  **API Queue** Throttles API calls to protect target service. 📝
- 👻  **Request Shadowing** Copies a fraction of traffic to a new deployment for observation. 📝
- 🚉  **Reverse Proxy** It can be deployable as an external application which can serve as reverse proxy. 📝
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



