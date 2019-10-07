import resolveProcessors, { ProcessorAdapter } from './resolveProcessors';
import * as FORMATS from './data-formats';

type MethodType = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH' | 'TRACE';

interface HeadersParameters {[key: string]: string | number}

/**
 * Class for handling responses and requests.
 */
export default class Api<ProcessedResponse = any> {
    /**
     * Base api url
     */
    private apiUrl: string;

    /**
     * Base http headers
     */
    private defaultHeaders: HeadersParameters;

    /**
     * Base settings for Fetch Request
     */
    private defaultOptions: RequestInit;

    /**
     * List of processors that parse response from server.
     */
    private processors: ProcessorAdapter[];

    /**
     * List of formatter you can use to process content of body request.
     */
    public static FORMATS = FORMATS;

    /**
     * Constructor.
     *
     * @param apiUrl - Base api url
     * @param processors - List of processors that parse response from server.
     * @param defaultHeaders - Base settings for Fetch Request
     * @param defaultOptions - List of processors that parse response from server.
     */
    public constructor(
        apiUrl: string,
        processors: ProcessorAdapter[] = [],
        defaultHeaders: HeadersParameters = {},
        defaultOptions: RequestInit = {},
    ) {
        this.apiUrl = apiUrl;
        this.defaultHeaders = defaultHeaders;
        this.defaultOptions = defaultOptions;
        this.processors = processors;
    }

    /**
     * Convert data in object to format of Fetch body.
     *
     * @param data - Data to convert
     * @param to - Format to which convert the data. Default is JSON.
     * @returns Converted data
     *
     * @example
     * const body = Api.convertData({ a: 'b' }, Api.FORMATS.JSON);
     * // output is {"a":"b"}
     */
    public static convertData(data: {[key: string]: any}, to: FORMATS.Format = FORMATS.JSON): string | FormData {
        if (to === FORMATS.FORM_DATA) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            return formData;
        }

        if (to === FORMATS.URL_ENCODED) {
            return Api.convertParametersToUrl(data).slice(1);
        }

        return JSON.stringify(data);
    }

    /**
     * Convert object to url parameters string.
     *
     * @param parameters - List of parameters
     * @returns Encoded string with ? prefix and variables separated by &
     *
     * @example
     * const parameters = Api.convertData({ a: '%b%' });
     * // output is ?a=%25b%25
     */
    public static convertParametersToUrl(parameters: {[key: string]: any}): string {
        const keys = Object.keys(parameters);

        if (keys.length === 0) {
            return '';
        }

        return `?${keys.map((key: string) => {
            return `${key}=${encodeURIComponent(parameters[key])}`;
        }).join('&')}`;
    }

    /**
     * Set default headers.
     *
     * @param headers - HTTP headers
     */
    public setDefaultHeaders(headers: HeadersParameters): void {
        this.defaultHeaders = headers;
    }

    /**
     * Add default HTTP header.
     *
     * @param name - Name of header
     * @param value - Value for header
     * @example
     * api.setDefaultHeader('content-type', 'application/json');
     */
    public setDefaultHeader(name: string, value: string): void {
        this.defaultHeaders[name] = value;
    }

    /**
     * Remove default header.
     *
     * @param name - Name of header
     */
    public removeDefaultHeader(name: string): void {
        delete this.defaultHeaders[name];
    }

    /**
     * Get default headers.
     *
     * @returns Get Default headers
     */
    public getDefaultHeaders(): HeadersParameters {
        return this.defaultHeaders;
    }

    /**
     * Fetch API url.
     *
     * @protected
     * @param request - Fetch request
     * @returns Fetch response
     */
    protected fetchRequest(request: Request): Promise<Response> {
        return fetch(request);
    }

    /**
     * Request given API endpoint.
     *
     * @param namespace - Api endpoint or full url
     * @param method - Request method eg. POST or GET
     * @param options - Fetch options
     * @param headers - Custom headers
     * @returns processed response
     * @example
     * const { data } = await api.request('ad', 'POST', {
     *     body: '{"ad":1}'
     * })
     *
     * const { data } = await api.request('http://i-can-request-full-url.com/?a=b', 'GET')
     */
    public async request(
        namespace: string,
        method: MethodType,
        options: RequestInit = {},
        headers: HeadersParameters = {},
    ): Promise<ProcessedResponse> {
        const urlToRequest = namespace.indexOf('http') === 0 ? namespace : `${this.apiUrl}/${namespace}`;

        // eslint-disable-next-line compat/compat
        const request = new Request(urlToRequest, {
            ...this.defaultOptions,
            method,
            // @ts-ignore
            headers: new Headers({
                ...this.getDefaultHeaders(),
                ...headers,
            }),
            ...options,
        });

        const response = await this.fetchRequest(request);

        return resolveProcessors(response, this.processors, request);
    }

    /**
     * Send a request with body.
     *
     * @protected
     * @param namespace - api endpoint
     * @param method - api method
     * @param data - body JSON parameters
     * @param format - format of body request
     * @param headers - custom headers
     * @returns processed response
     */
    public requestWithBody(
        namespace: string,
        method: MethodType,
        data: Record<string, any>,
        format: FORMATS.Format,
        headers: HeadersParameters = {},
    ): Promise<ProcessedResponse> {
        return this.request(namespace, method, {
            body: Api.convertData(data, format),
        }, headers);
    }

    /**
     * Send a GET request.
     *
     * @param namespace - api endpoint
     * @param parameters - get parameters
     * @param headers - custom headers
     * @returns processed response
     *
     * @example
     * const { data } = await api.get('brand', { id: 5 })
     * // will call YOUR_URI/brand?id=5
     * console.log(data);
     */
    public get(namespace: string, parameters: Record<string, any> = {}, headers: HeadersParameters = {}): Promise<ProcessedResponse> {
        return this.request(`${namespace}${Api.convertParametersToUrl(parameters)}`, 'GET', {}, headers);
    }

    /**
     * Send a POST request.
     *
     * @param namespace - Api endpoint
     * @param data - Request object
     * @param format - Format of body request
     * @param headers - custom headers
     * @returns Processed response
     */
    public post(
        namespace: string,
        data: Record<string, any> = {},
        format: FORMATS.Format = FORMATS.JSON,
        headers: HeadersParameters = {},
    ): Promise<ProcessedResponse> {
        return this.requestWithBody(namespace, 'POST', data, format, headers);
    }

    /**
     * Send a PUT request.
     *
     * @param namespace - Api endpoint
     * @param data - Request object
     * @param format - Format of body request
     * @param headers - custom headers
     * @returns Processed response
     */
    public put(
        namespace: string,
        data: Record<string, any> = {},
        format: FORMATS.Format = FORMATS.JSON,
        headers: HeadersParameters = {},
    ): Promise<ProcessedResponse> {
        return this.requestWithBody(namespace, 'PUT', data, format, headers);
    }

    /**
     * Send a DELETE request.
     *
     * @param namespace - Api endpoint
     * @param headers - custom headers
     * @returns Processed response
     */
    public delete(namespace: string, headers: HeadersParameters = {}): Promise<ProcessedResponse> {
        return this.request(namespace, 'DELETE', {}, headers);
    }
}
