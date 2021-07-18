/* eslint-disable no-proto */
import { ApiResponseType } from './DefaultResponseProcessor';

export interface ApiExceptionConstructor<ResponseType> {
    // eslint-disable-next-line no-use-before-define
    new (response: ApiResponseType<ResponseType>, request: Request): ApiExceptionInterface<ResponseType>;
}

export interface ApiExceptionInterface<ResponseType> {
    getRequest: () => Request;
    getResponse: () => ApiResponseType<ResponseType>;
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
     * Constructor.
     *
     * @param response - Processed response from server.
     */
    public constructor(response: ApiResponseType<ResponseType>) {
        super(`Api exception: ${JSON.stringify(response.data)}`);
        this.response = response;
    }

    public getResponse() {
        return this.response;
    }

    public getRequest() {
        return this.response.request;
    }
}
