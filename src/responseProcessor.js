// @flow
export type ApiResponseType<Respond> = {
    data: Respond;
    status: number;
    source: Response;
}
export type BodyDecoder = (response: Response) => *;

type DecodedStream = Blob | Object | string;

export type ProcessedResponse = ApiResponseType<*>;

/**
 * Decode API body response.
 *
 * @param {Response} response - Native response.
 * @returns {DecodedStream} Decoded json or simple string.
 */
export function decodeResponse(response: Response): Promise<DecodedStream> {
    const contentType: ?string = response.headers.get('content-type');

    // on default decode response as text
    if (!contentType) {
        return response.text();
    }

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
 * @param {BodyDecoder} decoder - Custom body decoder.
 * @returns {Promise<ProcessedResponse>} Processed response from API.
 */
export default function responseProcessor(response: Response, decoder: BodyDecoder = decodeResponse): Promise<ProcessedResponse> {
    return decoder(response)
        .then((decodedResponse: *) => {
            // create custom response format
            const toRespond: ProcessedResponse = {
                data: decodedResponse,
                status: response.status,
                source: response,
            };

            // response ok means that response was successful (2xx)
            if (response.ok) {
                return toRespond;
            }

            // otherwise create an error
            throw toRespond;
        });
}
