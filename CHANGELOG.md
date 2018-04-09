# Change Log
All notable changes to this project will be documented in this file.


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
