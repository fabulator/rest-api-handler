(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.apiHandler = {})));
}(this, (function (exports) { 'use strict';

function resolveArray(response, list) {
    var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (!list[i]) {
        return response;
    }

    return list[i](response).then(function (processedResponse) {
        if (list[i + 1]) {
            return resolveArray(processedResponse, list, i + 1);
        }

        return processedResponse;
    });
}

var JSON_FORMAT = 'json';
var FORM_DATA_FORMAT = 'formdata';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// for some reason this does not work in flow yet

var Api = function () {
    function Api(apiUrl) {
        var processors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var defaultHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var defaultOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        _classCallCheck(this, Api);

        this.apiUrl = apiUrl;
        this.defaultHeaders = defaultHeaders;
        this.defaultOptions = defaultOptions;
        this.processors = processors;
    }

    /**
     * Convert data object to fetch format.
     *
     * @param {SimpleObject} data - data to convert
     * @param {Format} to - Format to which convert the data
     * @returns {string | FormData} converted data
     */


    _createClass(Api, [{
        key: 'setDefaultHeaders',


        /**
         * Set default headers.
         *
         * @param {Headers} headers - http headers
         */
        value: function setDefaultHeaders(headers) {
            this.defaultHeaders = headers;
        }

        /**
         * Add default header for all requests.
         *
         * @param {string} name - name of header
         * @param {string} value - value for header
         */

    }, {
        key: 'setDefaultHeader',
        value: function setDefaultHeader(name, value) {
            this.defaultHeaders[name] = value;
        }

        /**
         * Default default header.
         *
         * @param {string} name - name of header
         */

    }, {
        key: 'removeDefaultHeader',
        value: function removeDefaultHeader(name) {
            delete this.defaultHeaders[name];
        }

        /**
         * Get default headers.
         *
         * @returns {Headers} - default headers for all requests
         */

    }, {
        key: 'getDefaultHeaders',
        value: function getDefaultHeaders() {
            return this.defaultHeaders;
        }

        /**
         * Request given API endpoint.
         *
         * @param {string} namespace - api endpoint
         * @param {MethodType} method - request method
         * @param {Object} options - fetch options
         * @param {SimpleObject} headers - custom headers
         * @returns {Promise<mixed>} processed response
         */

    }, {
        key: 'request',
        value: function request(namespace, method) {
            var _this = this;

            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            var fetched = fetch(new Request(this.apiUrl + '/' + namespace, _extends({}, this.defaultOptions, {
                method: method,
                headers: new Headers(_extends({}, this.getDefaultHeaders(), headers))
            }, options)));

            return fetched.then(function (response) {
                return resolveArray(response, _this.processors);
            });
        }

        /**
         * Send a GET request.
         *
         * @param {string} namespace - api endpoint
         * @param {SimpleObject} parameters - get parameters
         * @returns {Promise<mixed>} processed response
         */

    }, {
        key: 'get',
        value: function get(namespace) {
            var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.request('' + namespace + Api.convertParametersToUrl(parameters), 'GET');
        }

        /**
         * Send a POST request.
         *
         * @param {string} namespace - api endpoint
         * @param {SimpleObject} data - body JSON parameters
         * @param {?Format} format - format of body request
         * @returns {Promise<mixed>} processed response
         */

    }, {
        key: 'post',
        value: function post(namespace) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : JSON_FORMAT;

            return this.request(namespace, 'POST', {
                body: Api.convertData(data, format)
            });
        }

        /**
         * Send a PUT request.
         *
         * @param {string} namespace - api endpoint
         * @param {SimpleObject} data - body JSON parameters
         * @param {?Format} format - format of body request
         * @returns {Promise<mixed>} processed response
         */

    }, {
        key: 'put',
        value: function put(namespace) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : JSON_FORMAT;

            return this.request(namespace, 'PUT', {
                body: Api.convertData(data, format)
            });
        }

        /**
         * Send a DELETE request.
         *
         * @param {string} namespace - api endpoint
         * @returns {Promise<mixed>} processed response
         */

    }, {
        key: 'delete',
        value: function _delete(namespace) {
            return this.request(namespace, 'DELETE');
        }
    }], [{
        key: 'convertData',
        value: function convertData(data) {
            var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : JSON_FORMAT;

            if (to === FORM_DATA_FORMAT) {
                var formData = new FormData();
                Object.keys(data).forEach(function (key) {
                    var value = data[key];
                    formData.append(key, typeof value === 'number' ? value.toString() : value);
                });
                return formData;
            }

            return JSON.stringify(data);
        }

        /**
         * Convert parameters to url parameters string.
         *
         * @param {SimpleObject} parameters - list of parameters
         * @returns {string} encoded string
         */

    }, {
        key: 'convertParametersToUrl',
        value: function convertParametersToUrl(parameters) {
            var keys = Object.keys(parameters);

            if (keys.length === 0) {
                return '';
            }

            return '?' + keys.map(function (key) {
                var value = parameters[key];
                return key + '=' + encodeURI(typeof value === 'number' ? value.toString() : value);
            }).join('&');
        }
    }]);

    return Api;
}();

function decodeResponse(response) {
    if (response.headers.get('content-type').indexOf('application/json') !== -1) {
        return response.json();
    }

    return response.text();
}

var responseProcessor = (function (response) {
    return decodeResponse(response).then(function (decodedResponse) {
        // create custom response format
        var toRespond = {
            data: decodedResponse,
            status: response.status,
            source: response
        };

        // resolve promise on 2xx answer
        if (response.status >= 200 && response.status <= 299) {
            return toRespond;
        }

        // otherwise create an error
        throw toRespond;
    });
});

exports.JSON_FORMAT = JSON_FORMAT;
exports.FORM_DATA_FORMAT = FORM_DATA_FORMAT;
exports.defaultResponseProcessor = responseProcessor;
exports.Api = Api;

Object.defineProperty(exports, '__esModule', { value: true });

})));
