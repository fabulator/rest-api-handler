// @flow
import responseProcessor, { decodeResponse } from './responseProcessor';
import type { ProcessedResponse, BodyDecoder } from './responseProcessor';
import type { ApiExceptionInterface } from './ApiExceptionInterface';

/**
 * Processor provider that process response from API and throw custom Exception.
 */
export default class DefaultResponseProcessor {
    Exception: Class<ApiExceptionInterface>;
    processResponse: (response: Response, request: Request) => Promise<ProcessedResponse>;
    decoder: BodyDecoder = decodeResponse;

    /**
     * Constructor.
     *
     * @param {Class<ApiExceptionInterface>} Exception - Exception class that will be throwed if request fails.
     * @param {Function} decoder - Define custom response body decoder.
     */
    constructor(Exception: Class<ApiExceptionInterface>, decoder: BodyDecoder = decodeResponse) {
        this.Exception = Exception;
        this.decoder = decoder;
        this.processResponse = this.processResponse.bind(this);
    }

    /**
     * Process response from API.
     *
     * @param {Response} response - Native fetch response
     * @param {Request} request - Native fetch request
     * @returns {Promise<ProcessedResponse>} Processed response.
     */
    processResponse(response: Response, request: Request): Promise<ProcessedResponse> {
        return responseProcessor(response, this.decoder)
            .catch((exception: *) => {
                if (exception.data && exception.status && exception.source) {
                    throw new this.Exception(exception, request);
                }

                throw exception;
            });
    }
}
