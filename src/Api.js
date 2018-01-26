// @flow
import resolveProcessors from './resolveProcessors';
import { JSON_FORMAT, FORM_DATA_FORMAT } from './dataFormats';
import type { Format } from './dataFormats';
import type { Processor } from './resolveProcessors';

type MethodType = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH' | 'TRACE';

// for some reason this does not work in flow yet
type SimpleObject = { [key: string | number]: string | number };

class Api {
    apiUrl: string;
    defaultHeaders: SimpleObject;
    defaultOptions: SimpleObject;
    processors: Array<Processor>;

    getDefaultHeaders: () => SimpleObject;

    constructor(
        apiUrl: string,
        processors: Array<Processor> = [],
        defaultHeaders: SimpleObject = {},
        defaultOptions: SimpleObject = {},
    ): void {
        this.apiUrl = apiUrl;
        this.defaultHeaders = defaultHeaders;
        this.defaultOptions = defaultOptions;
        this.processors = processors;
    }

    /**
     * Convert data object to fetch format.
     *
     * @param {SimpleObject} data - data to convert
     * @param {Format} to - Format to which convert the data
     * @returns {string | FormData} converted data
     */
    static convertData(data: SimpleObject, to: ?Format = JSON_FORMAT): string | FormData {
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
     * @param {SimpleObject} parameters - list of parameters
     * @returns {string} encoded string
     */
    static convertParametersToUrl(parameters: SimpleObject): string {
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
    setDefaultHeaders(headers: SimpleObject): void {
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
    getDefaultHeaders(): SimpleObject {
        return this.defaultHeaders;
    }

    /**
     * Request given API endpoint.
     *
     * @param {string} namespace - api endpoint
     * @param {MethodType} method - request method
     * @param {Object} options - fetch options
     * @param {SimpleObject} headers - custom headers
     * @returns {Promise<mixed>} processed response
     */
    request(
        namespace: string,
        method: MethodType,
        options: Object = {},
        headers: SimpleObject = {}): Promise<mixed> {
        const fetched: Promise<Response> = fetch(new Request(`${this.apiUrl}/${namespace}`, {
            ...this.defaultOptions,
            method,
            headers: new Headers({
                ...this.getDefaultHeaders(),
                ...headers,
            }),
            ...options,
        }));

        return fetched.then((response: Response) => resolveProcessors(response, this.processors));
    }

    /**
     * Send a GET request.
     *
     * @param {string} namespace - api endpoint
     * @param {SimpleObject} parameters - get parameters
     * @returns {Promise<mixed>} processed response
     */
    get(namespace: string, parameters: SimpleObject = {}): Promise<mixed> {
        return this.request(`${namespace}${Api.convertParametersToUrl(parameters)}`, 'GET');
    }

    /**
     * Send a POST request.
     *
     * @param {string} namespace - api endpoint
     * @param {SimpleObject} data - body JSON parameters
     * @param {?Format} format - format of body request
     * @returns {Promise<mixed>} processed response
     */
    post(namespace: string, data: SimpleObject = {}, format: ?Format = JSON_FORMAT): Promise<mixed> {
        return this.request(namespace, 'POST', {
            body: Api.convertData(data, format),
        });
    }

    /**
     * Send a PUT request.
     *
     * @param {string} namespace - api endpoint
     * @param {SimpleObject} data - body JSON parameters
     * @param {?Format} format - format of body request
     * @returns {Promise<mixed>} processed response
     */
    put(namespace: string, data: SimpleObject = {}, format: ?Format = JSON_FORMAT): Promise<mixed> {
        return this.request(namespace, 'PUT', {
            body: Api.convertData(data, format),
        });
    }

    /**
     * Send a DELETE request.
     *
     * @param {string} namespace - api endpoint
     * @returns {Promise<mixed>} processed response
     */
    delete(namespace: string): Promise<mixed> {
        return this.request(namespace, 'DELETE');
    }
}

export default Api;
