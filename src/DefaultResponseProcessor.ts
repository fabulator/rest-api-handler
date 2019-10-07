import { ApiExceptionConstructor } from './DefaultApiException';

export type BodyDecoder<Decoded> = (response: Response) => Promise<Decoded>;

export interface ApiResponseType<Respond = any> {
    data: Respond,
    status: number,
    source: Response,
    request: Request,
}

/**
 * Processor provider that process response from API and throw custom Exception.
 */
export default class DefaultResponseProcessor<ResponseType = any> {
    private Exception: ApiExceptionConstructor<ResponseType>;

    private decoder: BodyDecoder<any>;

    /**
     * Constructor.
     *
     * @param Exception - Exception class that will be throwed if request fails.
     * @param decoder - Define custom response body decoder.
     */
    public constructor(Exception: ApiExceptionConstructor<ResponseType>, decoder?: BodyDecoder<ResponseType>) {
        this.Exception = Exception;
        this.decoder = decoder || DefaultResponseProcessor.decodeResponse;
    }

    public async processResponse(response: Response, request: Request): Promise<ApiResponseType<ResponseType>> {
        const decodedResponse = await this.decoder(response);

        const toRespond = {
            data: decodedResponse,
            status: response.status,
            source: response,
            request,
        };

        if (!response.ok) {
            throw new this.Exception(toRespond, request);
        }

        return toRespond;
    }

    private static decodeResponse(response: Response): Promise<Blob | Record<string, any> | string> {
        const contentType: string | null = response.headers.get('content-type');

        // on default decode response as text
        if (!contentType) {
            return response.text();
        }

        if (contentType.includes('json')) {
            return response.json();
        }

        if (contentType.includes('text') || contentType.includes('xml')) {
            return response.text();
        }

        return response.blob();
    }
}
