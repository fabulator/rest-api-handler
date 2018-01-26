// @flow
export type Processor = (response: any) => Promise<any>;

export default function resolveArray(response: any, list: Array<Processor>, i: number = 0): any {
    if (!list[i]) {
        return response;
    }

    return list[i](response)
        .then((processedResponse: any) => {
            if (list[i + 1]) {
                return resolveArray(processedResponse, list, i + 1);
            }

            return processedResponse;
        });
}
