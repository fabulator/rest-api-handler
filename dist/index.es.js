/**
 * Resolve given processor.
 *
 * @param {Input} response - Response to process.
 * @param {Array<ProcessorAdapter>} list - Array of processors.
 * @param {Request} request - fetch request
 * @param {number} i - Index of current processor.
 * @returns {any} Processed response
 */
function resolveArray(response, list, request) {
    var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var processor = list[i];

    if (!processor) {
        return Promise.resolve(response);
    }

    return (typeof processor === 'function' ? processor(response) : processor.processResponse(response, request)).then(function (processedResponse) {
        if (list[i + 1]) {
            return resolveArray(processedResponse, list, request, i + 1);
        }

        return processedResponse;
    });
}

// processor can be function or instance of class

var JSON_FORMAT = 'json';
var FORM_DATA_FORMAT = 'formdata';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Api = function () {
    function Api(apiUrl) {
        var processors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var defaultHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var defaultOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        classCallCheck(this, Api);

        this.apiUrl = apiUrl;
        this.defaultHeaders = defaultHeaders;
        this.defaultOptions = defaultOptions;
        this.processors = processors;
    }

    /**
     * Convert data object to fetch format.
     *
     * @param {Object} data - data to convert
     * @param {Format} to - Format to which convert the data
     * @returns {string | FormData} converted data
     */


    createClass(Api, [{
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
         * Fetch API url.
         *
         * @param {Request} request - fetch request
         * @returns {Promise<Response>} fetch response
         */

    }, {
        key: 'fetchRequest',
        value: function fetchRequest(request) {
            return fetch(request);
        }

        /**
         * Request given API endpoint.
         *
         * @param {string} namespace - api endpoint or full url
         * @param {MethodType} method - request method
         * @param {Object} options - fetch options
         * @param {Object} headers - custom headers
         * @returns {Promise<ProcessedResponse>} processed response
         */

    }, {
        key: 'request',
        value: function request(namespace, method) {
            var _this = this;

            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            var urlToRequest = namespace.indexOf('http') === 0 ? namespace : this.apiUrl + '/' + namespace;

            var request = new Request(urlToRequest, _extends({}, this.defaultOptions, {
                method: method,
                headers: new Headers(_extends({}, this.getDefaultHeaders(), headers))
            }, options));

            return this.fetchRequest(request).then(function (response) {
                return resolveArray(response, _this.processors, request);
            });
        }

        /**
         * Send a GET request.
         *
         * @param {string} namespace - api endpoint
         * @param {Object} parameters - get parameters
         * @returns {Promise<ProcessedResponse>} processed response
         */

    }, {
        key: 'get',
        value: function get$$1(namespace) {
            var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.request('' + namespace + Api.convertParametersToUrl(parameters), 'GET');
        }

        /**
         * Send a request with body.
         *
         * @param {string} namespace - api endpoint
         * @param {MethodType} method - api method
         * @param {Object} data - body JSON parameters
         * @param {Format} format - format of body request
         * @returns {Promise<ProcessedResponse>} processed response
         */

    }, {
        key: 'requestWithBody',
        value: function requestWithBody(namespace, method, data, format) {
            return this.request(namespace, method, {
                body: Api.convertData(data, format)
            });
        }

        /**
         * Send a POST request.
         *
         * @param {string} namespace - api endpoint
         * @param {Object} data - body JSON parameters
         * @param {?Format} format - format of body request
         * @returns {Promise<ProcessedResponse>} processed response
         */

    }, {
        key: 'post',
        value: function post(namespace) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Api.FORMATS.JSON_FORMAT;

            return this.requestWithBody(namespace, 'POST', data, format);
        }

        /**
         * Send a PUT request.
         *
         * @param {string} namespace - api endpoint
         * @param {Object} data - body JSON parameters
         * @param {?Format} format - format of body request
         * @returns {Promise<ProcessedResponse>} processed response
         */

    }, {
        key: 'put',
        value: function put(namespace) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Api.FORMATS.JSON_FORMAT;

            return this.requestWithBody(namespace, 'PUT', data, format);
        }

        /**
         * Send a DELETE request.
         *
         * @param {string} namespace - api endpoint
         * @returns {Promise<ProcessedResponse>} processed response
         */

    }, {
        key: 'delete',
        value: function _delete(namespace) {
            return this.request(namespace, 'DELETE');
        }
    }], [{
        key: 'convertData',
        value: function convertData(data) {
            var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Api.FORMATS.JSON_FORMAT;

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
         * @param {Object} parameters - list of parameters
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

Api.FORMATS = {
    JSON_FORMAT: JSON_FORMAT,
    FORM_DATA_FORMAT: FORM_DATA_FORMAT
};

/**
 * Decode API body response.
 *
 * @param {Response} response - Native response.
 * @returns {DecodedStream} Decoded json or simple string.
 */
function decodeResponse(response) {
    var contentType = response.headers.get('content-type');

    if (contentType.indexOf('json') >= 0) {
        return response.json();
    }

    if (contentType.indexOf('text') >= 0 || contentType.indexOf('xml') >= 0) {
        return response.text();
    }

    return response.blob();
}

/**
 * Process response from API.
 *
 * @param {Response} response - Native response.
 * @returns {Promise<ProcessedResponse>} Processed response from API.
 */

function responseProcessor(response) {
    return decodeResponse(response).then(function (decodedResponse) {
        // create custom response format
        var toRespond = {
            data: decodedResponse,
            status: response.status,
            source: response
        };

        // response ok means that response was successful (2xx)
        if (response.ok) {
            return toRespond;
        }

        // otherwise create an error
        throw toRespond;
    });
}

/**
 * Processor provider that process response from API and throw custom Exception.
 */
var DefaultResponseProcessor = function () {

    /**
     * Constructor.
     *
     * @param {Class<ApiExceptionInterface>} Exception - Exception class that will be throwed if request fails.
     */
    function DefaultResponseProcessor(Exception) {
        classCallCheck(this, DefaultResponseProcessor);

        this.Exception = Exception;
        this.processResponse = this.processResponse.bind(this);
    }

    /**
     * Process response from API.
     *
     * @param {Response} response - Native fetch response
     * @param {Request} request - Native fetch request
     * @returns {Promise<ProcessedResponse>} Processed response.
     */


    createClass(DefaultResponseProcessor, [{
        key: 'processResponse',
        value: function processResponse(response, request) {
            var _this = this;

            return responseProcessor(response).catch(function (exception) {
                if (exception.data && exception.status && exception.source) {
                    throw new _this.Exception(exception, request);
                }

                throw exception;
            });
        }
    }]);
    return DefaultResponseProcessor;
}();

/**
 * Default API Exception
 */

/* eslint-disable no-proto */
var DefaultApiException = function (_Error) {
    inherits(DefaultApiException, _Error);

    /**
     * Constructor.
     *
     * @param {ProcessedResponse} response - Processed response from server.
     * @param {Request} request - fetch Request.
     */
    function DefaultApiException(response, request) {
        classCallCheck(this, DefaultApiException);

        var _this = possibleConstructorReturn(this, (DefaultApiException.__proto__ || Object.getPrototypeOf(DefaultApiException)).call(this, 'Api exception: ' + JSON.stringify(response.data)));

        _this.response = response;
        _this.request = request;

        // babel bug - https://github.com/babel/babel/issues/4485
        // $FlowFixMe
        _this.__proto__ = DefaultApiException.prototype;
        return _this;
    }

    return DefaultApiException;
}(Error);

export { JSON_FORMAT, FORM_DATA_FORMAT, Api, responseProcessor as defaultResponseProcessor, DefaultResponseProcessor, DefaultApiException };
