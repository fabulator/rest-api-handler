// processor can be instance of class
export type ProcessorAdapter = {
    processResponse: (response: any, request: Request) => Promise<any>,
};

/**
 * Resolve given processor.
 *
 * @param response - Response to process.
 * @param list - Array of processors.
 * @param request - fetch request
 * @param i - Index of current processor.
 * @returns Processed response
 */
export default async function resolveProcessors<Input = any, Processors extends Array<ProcessorAdapter> = Array<any>>(
    response: Input,
    list: Processors,
    request: Request,
    i = 0,
): Promise<any> {
    const processor: ProcessorAdapter | undefined = list[i];

    if (!processor) {
        return response;
    }

    const processedResponse = await processor.processResponse(response, request);

    if (list[i + 1]) {
        return resolveProcessors(processedResponse, list, request, i + 1);
    }

    return processedResponse;
}
