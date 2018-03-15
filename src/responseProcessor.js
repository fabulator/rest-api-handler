// @flow
export type ApiResponseType<Respond> = {
    data: Respond;
    status: number;
    source: Response;
}

type DecodedStream = Blob | Object | string;

export type ProcessedResponse = ApiResponseType<DecodedStream>;

/**
 * Decode API body response.
 *
 * @param {Response} response - Native response.
 * @returns {DecodedStream} Decoded json or simple string.
 */
function decodeResponse(response: Response): Promise<DecodedStream> {
    const contentType = response.headers.get('content-type');

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
export default (response: Response): Promise<ProcessedResponse> => {
    return decodeResponse(response)
        .then((decodedResponse: DecodedStream) => {
            // create custom response format
            const toRespond: ProcessedResponse = {
                data: decodedResponse,
                status: response.status,
                source: response,
            };

            // resolve promise on 2xx answer
            if (response.status >= 200 && response.status <= 299) {
                return toRespond;
            }

            // otherwise create an error
            throw toRespond;
        });
};
