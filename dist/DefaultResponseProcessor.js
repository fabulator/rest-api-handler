'use strict';

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

    if (contentType.indexOf('text') >= 0) {
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

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





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
     * @param {Class<Error>} Exception - Exception class that will be throwed if request fails.
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
     * @returns {Promise<ProcessedResponse>} Processed response.
     */


    createClass(DefaultResponseProcessor, [{
        key: 'processResponse',
        value: function processResponse(response) {
            var _this = this;

            return responseProcessor(response).catch(function (exception) {
                if (exception.data && exception.status && exception.source) {
                    throw new _this.Exception(exception);
                }

                throw exception;
            });
        }
    }]);
    return DefaultResponseProcessor;
}();

module.exports = DefaultResponseProcessor;
