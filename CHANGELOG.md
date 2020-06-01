# Change Log
All notable changes to this project will be documented in this file.

## [2.17.0] 2020-06-01
### Changed
- [5292ade](https://github.com/fabulator/rest-api-handler/commit/5292adec8dbf3f033d2a220ec484d5ff116ebd8e) Update dependency @babel/runtime to v7.10.2

## [2.16.0] 2020-05-29
### Changed
- [8fbe720](https://github.com/fabulator/rest-api-handler/commit/8fbe72052a6965d589e3ca1fff09c0d40fc80d77) Update dependency @babel/runtime to v7.10.1

## [2.15.0] 2020-04-30
### Changed
- [d1e0dbc](https://github.com/fabulator/rest-api-handler/commit/d1e0dbc855f9629c3845436dd93226ff87000b8d) Update dependency @babel/runtime to v7.9.6

## [2.14.0] 2020-03-22
### Changed
- [83f647f](https://github.com/fabulator/rest-api-handler/commit/83f647f178d3f036c6aba5452d217580b32c8b06) Update dependency @babel/runtime to v7.9.2

## [2.13.0] 2020-03-06
### Changed
- [bb56e3c](https://github.com/fabulator/rest-api-handler/commit/bb56e3c9ff8117f0a97202ae745de04d787c2c8a) Update dependency @babel/runtime to v7.8.7
- [2b49a97](https://github.com/fabulator/rest-api-handler/commit/2b49a97b3721f02f70e5bb1040f332933fc97564) Update dev dependency @socifi/eslint-config to v2.10.2 

## [2.12.0] 2020-01-31
### Changed
- [3184428](https://github.com/fabulator/rest-api-handler/commit/31844285c35d6c8f5b8dcbe89cf3d745c0ab191f) Update dependency @babel/runtime to v7.8.4

## [2.11.0] 2020-01-14
### Changed
- [7ba1c88](https://github.com/fabulator/rest-api-handler/commit/7ba1c8892c177ae7c30a2f060d67f77647c0adf9) Update dependency @babel/runtime to v7.8.3

## [2.10.0] 2020-01-13
### Changed
- [7e31da8](https://github.com/fabulator/rest-api-handler/commit/7e31da802a8c29834e3839bdf3a4376e5b98b5b3) Update dependency @babel/runtime to v7.8.0

## [2.9.0] 2019-12-20
### Changed
- [1465eb7](https://github.com/fabulator/rest-api-handler/commit/1465eb70c7e90a7c44f0a6a6e1d211b0cef794c5) Update dependency @babel/runtime to v7.7.7

## [2.8.0] 2019-12-09
### Changed
- [652358e](https://github.com/fabulator/rest-api-handler/commit/652358e6b34584a76eeeb068496ae24eb5a263b5) Update dependency @babel/runtime to v7.7.6

## [2.7.0] 2019-12-07
### Changed
- [fad00a7](https://github.com/fabulator/rest-api-handler/commit/fad00a731cd961049905f528ce5bff4216103fe5) Update dependency @babel/runtime to v7.7.5

## [2.6.0] 2019-11-24
### Changed
- [131b6ea](https://github.com/fabulator/rest-api-handler/commit/131b6ea6ddc41274baafccf68bdb7289e28d96a3) Update dependency @babel/runtime to v7.7.4

## [2.5.0] 2019-11-09
### Changed
- [a3393ff](https://github.com/fabulator/rest-api-handler/commit/a3393ff9663e3e893b55d4acbc2b38efc7025ea9) Update dependency @babel/runtime to v7.7.2

## [2.4.1] 2019-10-26
### Fixed
- [6f3d709](https://github.com/fabulator/rest-api-handler/commit/6f3d70963c80255d7f55316367ba074d67ca1027) Add missing dependenci babel runtime

## [2.4.0] 2019-10-24
### Changed
- [d4b99bf](https://github.com/fabulator/rest-api-handler/commit/d4b99bf46bf68d013e833d24968e05939b0164a3) Update dev dependency @socifi/rollup-config to ^2.2.2

## [2.3.0] 2019-10-21
### Changed
- [ec42ec9](https://github.com/fabulator/rest-api-handler/commit/ec42ec9504c8fa024165613f0f4f9b6c929d2aed) Update dependencies and activate automatic releases.

### Other
- [fc51917](https://github.com/fabulator/rest-api-handler/commit/fc51917344088980193ca6d5e8cd9a96671780c0) Update dependency @types/node to ^12.7.12

## [2.2.0] 2019-10-07
### Changed
- Update babel dependency
- Remove proto from DefaultException - not need from babel 7


## [2.1.0] 2018-12-01
### Added
- Request info to Default response

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
