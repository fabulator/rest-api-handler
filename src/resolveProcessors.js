// @flow

type ProcessorFunction = (response: any) => Promise<any>;

// processor can be function or instance of class
export type ProcessorAdapter = ProcessorFunction | {
    processResponse: (response: any, request: Request) => Promise<any>,
};

/**
 * Resolve given processor.
 *
 * @param {Input} response - Response to process.
 * @param {Array<ProcessorAdapter>} list - Array of processors.
 * @param {Request} request - fetch request
 * @param {number} i - Index of current processor.
 * @returns {any} Processed response
 */
export default function resolveProcessors<Input, Processors: Array<ProcessorAdapter>>(
    response: Input,
    list: Processors,
    request: Request,
    i: number = 0,
): Promise<any> {
    const processor: ?ProcessorAdapter = list[i];

    if (!processor) {
        return Promise.resolve(response);
    }

    return (typeof processor === 'function' ? processor(response) : processor.processResponse(response, request))
        .then((processedResponse: *) => {
            if (list[i + 1]) {
                return resolveProcessors(processedResponse, list, request, i + 1);
            }

            return processedResponse;
        });
}
