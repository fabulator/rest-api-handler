// @flow
import resolveProcessors from './resolveProcessors';
import { JSON_FORMAT, FORM_DATA_FORMAT } from './dataFormats';
import type { Format } from './dataFormats';
import type { ProcessorAdapter } from './resolveProcessors';

type MethodType = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH' | 'TRACE';

class Api<ProcessedResponse> {
    apiUrl: string;
    defaultHeaders: Object;
    defaultOptions: Object;
    processors: Array<ProcessorAdapter>;
    getDefaultHeaders: () => Object;
    setDefaultHeaders: (headers: Object) => void;
    setDefaultHeader: (name: string, value: string) => void;
    removeDefaultHeader: (name: string) => void;

    static FORMATS = {
        JSON_FORMAT,
        FORM_DATA_FORMAT,
    };

    constructor(
        apiUrl: string,
        processors: Array<ProcessorAdapter> = [],
        defaultHeaders: Object = {},
        defaultOptions: Object = {},
    ): void {
        this.apiUrl = apiUrl;
        this.defaultHeaders = defaultHeaders;
        this.defaultOptions = defaultOptions;
        this.processors = processors;
    }

    /**
     * Convert data object to fetch format.
     *
     * @param {Object} data - data to convert
     * @param {Format} to - Format to which convert the data
     * @returns {string | FormData} converted data
     */
    static convertData(data: Object, to: ?Format = Api.FORMATS.JSON_FORMAT): string | FormData {
        if (to === FORM_DATA_FORMAT) {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                const value = data[key];
                formData.append(key, typeof value === 'number' ? value.toString() : value);
            });
            return formData;
        }

        return JSON.stringify(data);
    }

    /**
     * Convert parameters to url parameters string.
     *
     * @param {Object} parameters - list of parameters
     * @returns {string} encoded string
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
     * @param {Headers} headers - http headers
     */
    setDefaultHeaders(headers: Object): void {
        this.defaultHeaders = headers;
    }

    /**
     * Add default header for all requests.
     *
     * @param {string} name - name of header
     * @param {string} value - value for header
     */
    setDefaultHeader(name: string, value: string): void {
        this.defaultHeaders[name] = value;
    }

    /**
     * Default default header.
     *
     * @param {string} name - name of header
     */
    removeDefaultHeader(name: string): void {
        delete this.defaultHeaders[name];
    }

    /**
     * Get default headers.
     *
     * @returns {Headers} - default headers for all requests
     */
    getDefaultHeaders(): Object {
        return this.defaultHeaders;
    }

    /**
     * Request given API endpoint.
     *
     * @param {string} namespace - api endpoint or full url
     * @param {MethodType} method - request method
     * @param {Object} options - fetch options
     * @param {Object} headers - custom headers
     * @returns {Promise<ProcessedResponse>} processed response
     */
    request(
        namespace: string,
        method: MethodType,
        options: Object = {},
        headers: Object = {}): Promise<ProcessedResponse> {
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

        return fetch(request)
            .then((response: Response) => {
                return resolveProcessors(response, this.processors, request);
            });
    }

    /**
     * Send a GET request.
     *
     * @param {string} namespace - api endpoint
     * @param {Object} parameters - get parameters
     * @returns {Promise<ProcessedResponse>} processed response
     */
    get(namespace: string, parameters: Object = {}): Promise<ProcessedResponse> {
        return this.request(`${namespace}${Api.convertParametersToUrl(parameters)}`, 'GET');
    }

    /**
     * Send a POST request.
     *
     * @param {string} namespace - api endpoint
     * @param {Object} data - body JSON parameters
     * @param {?Format} format - format of body request
     * @returns {Promise<ProcessedResponse>} processed response
     */
    post(namespace: string, data: Object = {}, format: ?Format = Api.FORMATS.JSON_FORMAT): Promise<ProcessedResponse> {
        return this.request(namespace, 'POST', {
            body: Api.convertData(data, format),
        });
    }

    /**
     * Send a PUT request.
     *
     * @param {string} namespace - api endpoint
     * @param {Object} data - body JSON parameters
     * @param {?Format} format - format of body request
     * @returns {Promise<ProcessedResponse>} processed response
     */
    put(namespace: string, data: Object = {}, format: ?Format = Api.FORMATS.JSON_FORMAT): Promise<ProcessedResponse> {
        return this.request(namespace, 'PUT', {
            body: Api.convertData(data, format),
        });
    }

    /**
     * Send a DELETE request.
     *
     * @param {string} namespace - api endpoint
     * @returns {Promise<ProcessedResponse>} processed response
     */
    delete(namespace: string): Promise<ProcessedResponse> {
        return this.request(namespace, 'DELETE');
    }
}

export default Api;
