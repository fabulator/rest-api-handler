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

export default DefaultResponseProcessor;
