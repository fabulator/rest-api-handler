'use strict';

/**
 * Decode API body response.
 *
 * @param {Response} response - Native response.
 * @returns {Object | string} Decoded json or simple string.
 */
function decodeResponse(response) {
    if (response.headers.get('content-type').indexOf('application/json') !== -1) {
        return response.json();
    }

    return response.text();
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

module.exports = responseProcessor;
