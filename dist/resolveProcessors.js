'use strict';

/**
 * Resolve given processor.
 *
 * @param {any} response - Response to process.
 * @param {Array<ProcessorAdapter>} list - Array of processors.
 * @param {number} i - Index of current processor.
 * @returns {any} Processed response
 */
function resolveArray(response, list) {
    var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var processor = list[i];

    if (!processor) {
        return response;
    }

    return (typeof processor === 'function' ? processor(response) : processor.processResponse(response)).then(function (processedResponse) {
        if (list[i + 1]) {
            return resolveArray(processedResponse, list, i + 1);
        }

        return processedResponse;
    });
}

// processor can be function or instance of class

module.exports = resolveArray;
