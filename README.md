# REST API Handler

[![Greenkeeper badge](https://badges.greenkeeper.io/fabulator/rest-api-handler.svg)](https://greenkeeper.io/)
[![codecov](https://img.shields.io/npm/v/rest-api-handler.svg)](https://www.npmjs.com/package/rest-api-handler) [![codecov](https://codecov.io/gh/fabulator/rest-api-handler/branch/master/graph/badge.svg)](https://codecov.io/gh/fabulator/rest-api-handler) [![codecov](https://travis-ci.org/fabulator/rest-api-handler.svg?branch=master)](https://travis-ci.org/fabulator/rest-api-handler)

This library will help you with requests to REST APIs. It uses [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) which isn't supported by node and some [older browsers](https://caniuse.com/#feat=fetch) and Node. Remember to include polyfill if need it.

## Basic request

Install npm library:

```node
npm install rest-api-handler --save
```

First initiate Api class and then you can send HTTP requests. As first parameter use base url.

```javascript
import { Api } from 'rest-api-handler';

const api = new Api('https://api.blockcypher.com');

api.get('v1/btc/main').then((response) => {
    console.log(response); // same response as in Fetch API
});

// or you can request full url

api.get('https://api.blockcypher.com/v1/btc/main');

```

In default configuration, response is same as in Fetch API. That why you can define your own processors that will parse responses or use default one provided by this library.

```javascript
import { Api, defaultResponseProcessor } from 'rest-api-handler';

const api = new Api('https://api.blockcypher.com', [
    defaultResponseProcessor,
]);

api.get('v1/btc/main').then((response) => {
    console.log(response.code); // 200
    console.log(response.data); // parsed JSON
    console.log(response.source); // original Response
});

```

Here is how to create your own response processors and use them in the chain:

```javascript
const api = new Api('//some.api.com', [
    defaultResponseProcessor,
    onlyDataProcessor,
]);

function onlyDataProcessor(response) {
    return Promise.resolve(response.data);
}

api.get('endpoint').then((response) => {
    console.log(response); // parsed JSON
});

```

## Methods

There are default methods for GET, POST, PUT and DELETE. But you can send any HTTP method using request.

```javascript
api.get('v1/btc/main'); // GET https://api.blockcypher.com/v1/btc/main
api.get('v1/btc/main', { a: 'b' }); // GET https://api.blockcypher.com/v1/btc/main?a=b

api.post('method', { a: 'b' });
api.put('method', { a: 'b' });
api.delete('method');

// you can create your own requests
// use can use other parameters from Fetch API - https://developer.mozilla.org/en-US/docs/Web/API/Request
api.request('endpoint', 'PUT', {
    body: 'Simple string request',
});
```

## Data encoding

By default, data for POST and PUT are encoded as JSON. You can also encode them as FormData. This can be used for images or files uploading.

```javascript
import { Api, defaultResponseProcessor, FORM_DATA_FORMAT } from 'rest-api-handler';
const api = new Api('//some.api.com');

api.post('file-upload', {
    file: fileObject,
}, FORM_DATA_FORMAT);

```

## Authentication

You can authorize to API by using default headers or set them after.

```javascript
const api = new Api('//some.api.com', [], {
    Authorization: 'Bearer XYZ',
    'Content-Type': 'application/json',
});

// this will replace original default value
api.addDefaultHeader('Authorization', 'Bearer ABC');

// this will delete authorization
api.removeDefaultHeader('Authorization');
```

You can also set custom headers for every request:

```javascript
api.request('endpoint', 'GET', {}, {
    'Authorization': 'Bearer XYZ',
})
```

## Node

To use it as node library, just import Fetch polyfill:

```javascript
require('cross-fetch/polyfill');
const FormData = require('form-data');

global.FormData = FormData;

const { Api, defaultResponseProcessor } = require('rest-api-handler');

const api = new Api('https://api.blockcypher.com', [ defaultResponseProcessor ]);

api.get('v1/btc/main').then((response) => {
    console.log(response.data);
});
```

## Exception handling

When you catch exception from fetch it might be tricky. It can be response from api or some javascript syntax error. You can create exception throwing. Use example or your own methods:

```javascript
import { Api, DefaultResponseProcessor, DefaultApiException } from 'rest-api-handler';

const api = new Api(apiUrl, [
    new DefaultResponseProcessor(DefaultApiException),
]);

api
    .get('some-namespace')
    .catch((exception) => {
        if (exception instanceof DefaultApiException) {
            console.log('Api throwed some exception. Do something.');
        };
        console.log('There was some other exception');
        throw exception;
    });
```
