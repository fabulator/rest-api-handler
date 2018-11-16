# Change Log
All notable changes to this project will be documented in this file.


## [2.0.0] 2018-11-16
### Changed
- Formats name are changed and no longer exported from library by them self. They are accessible from Api.FORMATS
- Converted from flow to typescript

### Remove
 - defaultResponseProcessor method
 - docs config


## [1.8.1] 2018-06-27
### Fixed
- Encoding of get parameters


## [1.8.0] 2018-05-31
### Added
- Add option to define custom body decoder for DefaultResponseProcessor
- Add option to get, post, put and delete request to define custom headers


## [1.7.0] 2018-05-31
### Added
- Add urldecode format for requests body


## [1.6.1] 2018-04-20
### Fixed
- Decode response without content type as text.


## [1.6.0] 2018-04-13
### Added
- Add docs generator

### Changed
- Update packages


## [1.5.0] 2018-04-09
### Added
- Add new method fetchRequest that handles fetch API. It can be easily overrrided by its children.


## [1.4.1] 2018-03-28
### Changed
- Add name to exported function responseProcessor


## [1.4.0] 2018-03-28
### Changed
- Use better node polyfill for documentation
- Add option to request full url


## [1.3.1] 2018-03-21
### Fixed
- Fix flow definitions
- Change building strategy and improve compatibility with fetch definitions.


## [1.3.0] 2018-03-19
### Changed
- Update flow version to 68
- Add request info to exceptions


## [1.2.0] 2018-03-15
### Changed
- Better response decoding. If content type is not json or text, blob will be returned.


## [1.1.1] 2018-02-08
### Fixed
- Fixed flow validation.


## [1.1.0] 2018-02-07
### Added
- Add API exception handling.

## [1.0.2] 2018-01-26
### Changed
- Add module property to package.json that is linked to builded package with ES6 modules.

## [1.0.1] 2018-01-26
### Changed
- Name of package was changed from api-handler to rest-api-handler because the first one was denied by npm.


## [1.0.0] 2018-01-26
- First commit
