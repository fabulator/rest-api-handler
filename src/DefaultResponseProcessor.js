// @flow
import responseProcessor from './responseProcessor';
import type { ProcessedResponse } from './responseProcessor';
import type { ApiExceptionInterface } from './ApiExceptionInterface';

/**
 * Processor provider that process response from API and throw custom Exception.
 */
class DefaultResponseProcessor {
    Exception: Class<ApiExceptionInterface>;
    processResponse: (response: Response, request: Request) => Promise<ProcessedResponse>;

    /**
     * Constructor.
     *
     * @param {Class<ApiExceptionInterface>} Exception - Exception class that will be throwed if request fails.
     */
    constructor(Exception: Class<ApiExceptionInterface>) {
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
    processResponse(response: Response, request: Request): Promise<ProcessedResponse> {
        return responseProcessor(response)
            .catch((exception: *) => {
                if (exception.data && exception.status && exception.source) {
                    throw new this.Exception(exception, request);
                }

                throw exception;
            });
    }
}

export default DefaultResponseProcessor;
