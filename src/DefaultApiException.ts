/* eslint-disable no-proto */
import { ApiResponseType } from './DefaultResponseProcessor';

export interface ApiExceptionConstructor<ResponseType> {
    new (response: ApiResponseType<ResponseType>, request: Request): ApiExceptionInterface<ResponseType>,
}

export interface ApiExceptionInterface<ResponseType> {
    getResponse: () => ApiResponseType<ResponseType>,
    getRequest: () => Request,
}

/**
 * Default API Exception
 */
export default class DefaultApiException<ResponseType> extends Error implements ApiExceptionInterface<ResponseType> {
    /**
     * Response from server that throwed an error.
     */
    private response: ApiResponseType<ResponseType>;

    /**
     * Request that failed.
     */
    private request: Request;

    /**
     * Constructor.
     *
     * @param response - Processed response from server.
     * @param request - Fetch Request.
     */
    public constructor(response: ApiResponseType<ResponseType>, request: Request) {
        super(`Api exception: ${JSON.stringify(response.data)}`);
        this.response = response;
        this.request = request;

        // babel bug - https://github.com/babel/babel/issues/4485
        // @ts-ignore
        this.__proto__ = DefaultApiException.prototype;
    }

    public getResponse() {
        return this.response;
    }

    public getRequest() {
        return this.request;
    }
}
