// @flow
import resolveProcessors from './resolveProcessors';
import { JSON_FORMAT, FORM_DATA_FORMAT, URL_ENCODED_FORMAT } from './dataFormats';
import type { Format } from './dataFormats';
import type { ProcessorAdapter } from './resolveProcessors';

export type MethodType = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH' | 'TRACE';

/**
 * Class for handling responses and requests.
 */
export default class Api<ProcessedResponse> {
    /**
     * Base api url
     */
    apiUrl: string;

    /**
     * Base http headers
     */
    defaultHeaders: Object;

    /**
     * Base settings for Fetch Request
     */
    defaultOptions: RequestOptions;

    /**
     * List of processors that parse response from server.
     */
    processors: Array<ProcessorAdapter>;

    getDefaultHeaders: () => Object;
    setDefaultHeaders: (headers: Object) => void;
    setDefaultHeader: (name: string, value: string) => void;
    removeDefaultHeader: (name: string) => void;
    fetchRequest: (request: Request) => Promise<Response>;

    /**
     * List of formatter you can use to process content of body request.
     *
     * @type {{JSON_FORMAT: string, FORM_DATA_FORMAT: string}}
     */
    static FORMATS = {
        JSON_FORMAT,
        FORM_DATA_FORMAT,
        URL_ENCODED_FORMAT,
    };

    /**
     * Constructor.
     *
     * @param {string} apiUrl - Base api url
     * @param {Array<ProcessorAdapter>} processors - List of processors that parse response from server.
     * @param {Object} defaultHeaders - Base settings for Fetch Request
     * @param {RequestOptions} defaultOptions - List of processors that parse response from server.
     */
    constructor(
        apiUrl: string,
        processors: Array<ProcessorAdapter> = [],
        defaultHeaders: Object = {},
        defaultOptions: RequestOptions = {},
    ): void {
        this.apiUrl = apiUrl;
        this.defaultHeaders = defaultHeaders;
        this.defaultOptions = defaultOptions;
        this.processors = processors;
    }

    /**
     * Convert data in object to format of Fetch body.
     *
     * @param {Object} data - Data to convert
     * @param {Format} to - Format to which convert the data. Default is JSON.
     * @returns {string | FormData} Converted data
     *
     * @example
     * const body = Api.convertData({ a: 'b' }, Api.FORMATS.JSON_FORMAT);
     * // output is {"a":"b"}
     */
    static convertData(data: Object, to: ?Format = JSON_FORMAT): string | FormData {
        if (to === FORM_DATA_FORMAT) {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                const value = data[key];
                formData.append(key, typeof value === 'number' ? value.toString() : value);
            });
            return formData;
        }

        if (to === URL_ENCODED_FORMAT) {
            return Api.convertParametersToUrl(data).slice(1);
        }

        return JSON.stringify(data);
    }

    /**
     * Convert object to url parameters string.
     *
     * @param {Object} parameters - List of parameters
     * @returns {string} Encoded string with ? prefix and variables separated by &
     *
     * @example
     * const parameters = Api.convertData({ a: '%b%' });
     * // output is ?a=%25b%25
     */
    static convertParametersToUrl(parameters: Object): string {
        const keys = Object.keys(parameters);

        if (keys.length === 0) {
            return '';
        }

        return `?${keys.map((key: string) => {
            const value = parameters[key];
            return `${key}=${encodeURI(typeof value === 'number' ? value.toString() : value)}`;
        }).join('&')}`;
    }

    /**
     * Set default headers.
     *
     * @param {Headers} headers - HTTP headers
     */
    setDefaultHeaders(headers: Object): void {
        this.defaultHeaders = headers;
    }

    /**
     * Add default HTTP header.
     *
     * @param {string} name - Name of header
     * @param {string} value - Value for header
     * @example
     * api.setDefaultHeader('content-type', 'application/json');
     */
    setDefaultHeader(name: string, value: string): void {
        this.defaultHeaders[name] = value;
    }

    /**
     * Remove default header.
     *
     * @param {string} name - Name of header
     */
    removeDefaultHeader(name: string): void {
        delete this.defaultHeaders[name];
    }

    /**
     * Get default headers.
     *
     * @returns {Headers} - Get Default headers
     */
    getDefaultHeaders(): Object {
        return this.defaultHeaders;
    }

    /**
     * Fetch API url.
     *
     * @protected
     * @param {Request} request - Fetch request
     * @returns {Promise<Response>} Fetch response
     */
    fetchRequest(request: Request): Promise<Response> {
        return fetch(request);
    }

    /**
     * Request given API endpoint.
     *
     * @param {string} namespace - Api endpoint or full url
     * @param {MethodType} method - Request method eg. POST or GET
     * @param {RequestOptions} options - Fetch options
     * @param {Object} headers - Custom headers
     * @returns {Promise<ProcessedResponse>} processed response
     * @example
     * const { data } = await api.request('ad', 'POST', {
     *     body: '{"ad":1}'
     * })
     *
     * const { data } = await api.request('http://i-can-request-full-url.com/?a=b', 'GET')
     */
    request(
        namespace: string,
        method: MethodType,
        options: RequestOptions = {},
        headers: Object = {},
    ): Promise<ProcessedResponse> {
        const urlToRequest = namespace.indexOf('http') === 0 ? namespace : `${this.apiUrl}/${namespace}`;

        const request = new Request(urlToRequest, {
            ...this.defaultOptions,
            method,
            headers: new Headers({
                ...this.getDefaultHeaders(),
                ...headers,
            }),
            ...options,
        });

        return this.fetchRequest(request)
            .then((response: Response) => {
                return resolveProcessors(response, this.processors, request);
            });
    }

    /**
     * Send a request with body.
     *
     * @protected
     * @param {string} namespace - api endpoint
     * @param {MethodType} method - api method
     * @param {Object} data - body JSON parameters
     * @param {Format} format - format of body request
     * @param {Object} headers - custom headers
     * @returns {Promise<ProcessedResponse>} processed response
     */
    requestWithBody(namespace: string, method: MethodType, data: Object, format: Format, headers: Object = {}): Promise<ProcessedResponse> {
        return this.request(namespace, method, {
            body: Api.convertData(data, format),
        }, headers);
    }

    /**
     * Send a GET request.
     *
     * @param {string} namespace - api endpoint
     * @param {Object} parameters - get parameters
     * @param {Object} headers - custom headers
     * @returns {Promise<ProcessedResponse>} processed response
     *
     * @example
     * const { data } = await api.get('brand', { id: 5 })
     * // will call YOUR_URI/brand?id=5
     * console.log(data);
     */
    get(namespace: string, parameters: Object = {}, headers: Object = {}): Promise<ProcessedResponse> {
        return this.request(`${namespace}${Api.convertParametersToUrl(parameters)}`, 'GET', {}, headers);
    }

    /**
     * Send a POST request.
     *
     * @param {string} namespace - Api endpoint
     * @param {Object} data - Request object
     * @param {?Format} format - Format of body request
     * @param {Object} headers - custom headers
     * @returns {Promise<ProcessedResponse>} Processed response
     */
    post(namespace: string, data: Object = {}, format: Format = JSON_FORMAT, headers: Object = {}): Promise<ProcessedResponse> {
        return this.requestWithBody(namespace, 'POST', data, format, headers);
    }

    /**
     * Send a PUT request.
     *
     * @param {string} namespace - Api endpoint
     * @param {Object} data - Request object
     * @param {?Format} format - Format of body request
     * @param {Object} headers - custom headers
     * @returns {Promise<ProcessedResponse>} Processed response
     */
    put(namespace: string, data: Object = {}, format: Format = JSON_FORMAT, headers: Object = {}): Promise<ProcessedResponse> {
        return this.requestWithBody(namespace, 'PUT', data, format, headers);
    }

    /**
     * Send a DELETE request.
     *
     * @param {string} namespace - Api endpoint
     * @param {Object} headers - custom headers
     * @returns {Promise<ProcessedResponse>} Processed response
     */
    delete(namespace: string, headers: Object = {}): Promise<ProcessedResponse> {
        return this.request(namespace, 'DELETE', {}, headers);
    }
}
