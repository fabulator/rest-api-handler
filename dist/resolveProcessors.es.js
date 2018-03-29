/**
 * Resolve given processor.
 *
 * @param {Input} response - Response to process.
 * @param {Array<ProcessorAdapter>} list - Array of processors.
 * @param {Request} request - fetch request
 * @param {number} i - Index of current processor.
 * @returns {any} Processed response
 */
function resolveArray(response, list, request) {
    var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var processor = list[i];

    if (!processor) {
        return Promise.resolve(response);
    }

    return (typeof processor === 'function' ? processor(response) : processor.processResponse(response, request)).then(function (processedResponse) {
        if (list[i + 1]) {
            return resolveArray(processedResponse, list, request, i + 1);
        }

        return processedResponse;
    });
}

// processor can be function or instance of class

export default resolveArray;
