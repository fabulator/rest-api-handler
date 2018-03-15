'use strict';

/**
 * Decode API body response.
 *
 * @param {Response} response - Native response.
 * @returns {DecodedStream} Decoded json or simple string.
 */
function decodeResponse(response) {
    var contentType = response.headers.get('content-type');

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
