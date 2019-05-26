# Changelog

## [1.6.0] - 2019-05-26
### Added
- Schema for faster parse & stringify json operations.
- `cacheWithCookie` option for caching when `set-cookie` header exists.
- Now route registering returns a handle that can be used to send request from that registration.

### Changed
- Removed Node Streams for faster processing. It made huge impact.
- Improved Cache, cache now stores clear and smaller data

## [1.5.0] - 2019-05-09
### Added
- Couchbase plugin
- Plugin interface to create custom cache plugins

## [1.4.0] - 2019-05-08
### Added
- Retry plugin for retrying failed responses
- Added generic identifiers
### Changed
- Identifiers are not required anymore

## [1.3.0] - 2019-05-02
### Added
- Security for set-cookie header to prevent dangerous response caching with credentials.

## [1.2.2] - 2019-04-13
### Fixed
- Cache leak for memory plugin

## [1.2.1] - 2019-04-13
### Fixed
- Added getting Enum values from string implementing cache strategy
