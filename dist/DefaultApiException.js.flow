// @flow
/* eslint-disable no-proto */
import type { ProcessedResponse } from './responseProcessor';
import type { ApiExceptionInterface } from './ApiExceptionInterface';

/**
 * Default API Exception
 */
class DefaultApiException extends Error implements ApiExceptionInterface {
    response: ProcessedResponse;
    request: Request;

    /**
     * Constructor.
     *
     * @param {ProcessedResponse} response - Processed response from server.
     * @param {Request} request - fetch Request.
     */
    constructor(response: ProcessedResponse, request: Request) {
        super(`Api exception: ${JSON.stringify(response.data)}`);
        this.response = response;
        this.request = request;

        // babel bug - https://github.com/babel/babel/issues/4485
        // $FlowFixMe
        this.__proto__ = DefaultApiException.prototype;
    }
}

export default DefaultApiException;
