// @flow

type ProcessorFunction = (response: any) => Promise<any>;

// processor can be function or instance of class
export type ProcessorAdapter = ProcessorFunction | {
    processResponse: ProcessorFunction,
};

/**
 * Resolve given processor.
 *
 * @param {any} response - Response to process.
 * @param {Array<ProcessorAdapter>} list - Array of processors.
 * @param {number} i - Index of current processor.
 * @returns {any} Processed response
 */
export default function resolveArray(response: any, list: Array<ProcessorAdapter>, i: number = 0): any {
    const processor: ?ProcessorAdapter = list[i];

    if (!processor) {
        return response;
    }

    return (typeof processor === 'function' ? processor(response) : processor.processResponse(response))
        .then((processedResponse: any) => {
            if (list[i + 1]) {
                return resolveArray(processedResponse, list, i + 1);
            }

            return processedResponse;
        });
}
