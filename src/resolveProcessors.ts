// processor can be instance of class
type Processor<Input = any, Output = any> = (response: Input, request: Request) => Promise<Output>;

export type ProcessorAdapter<Input = any, Output = any> = {
    processResponse: Processor<Input, Output>,
} | Processor<Input, Output>;

/**
 * Resolve given processor.
 *
 * @param response - Response to process.
 * @param list - Array of processors.
 * @param request - fetch request
 * @param i - Index of current processor.
 * @returns Processed response
 */
export default async function resolveProcessors<Processors extends ProcessorAdapter[] = ProcessorAdapter[]>(
    response: any,
    list: Processors,
    request: Request,
    i = 0,
): Promise<any> {
    const processor: ProcessorAdapter | undefined = list[i];

    if (!processor) {
        return response;
    }

    const processedResponse = typeof processor === 'function'
        ? await processor(response, request)
        : await processor.processResponse(response, request);

    if (list[i + 1]) {
        return resolveProcessors(processedResponse, list, request, i + 1);
    }

    return processedResponse;
}
