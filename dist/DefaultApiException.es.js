var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
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

export default DefaultApiException;
