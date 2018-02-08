// @flow
import responseProcessor from './responseProcessor';
import type { ProcessedResponse } from './responseProcessor';

/**
 * Processor provider that process response from API and throw custom Exception.
 */
class DefaultResponseProcessor {
    Exception: any;
    processResponse: (response: Response) => Promise<ProcessedResponse>;

    /**
     * Constructor.
     *
     * @param {any} Exception - Exception class that will be throwed if request fails.
     */
    constructor(Exception: any) {
        this.Exception = Exception;
        this.processResponse = this.processResponse.bind(this);
    }

    /**
     * Process response from API.
     *
     * @param {Response} response - Native fetch response
     * @returns {Promise<ProcessedResponse>} Processed response.
     */
    processResponse(response: Response): Promise<ProcessedResponse> {
        return responseProcessor(response)
            .catch((exception: Error) => {
                if (exception.data && exception.status && exception.source) {
                    throw new this.Exception(exception);
                }

                throw exception;
            });
    }
}

export default DefaultResponseProcessor;
