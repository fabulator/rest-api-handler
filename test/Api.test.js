// @flow
import 'cross-fetch/polyfill';
import {
    Api,
    FORM_DATA_FORMAT,
    URL_ENCODED_FORMAT,
    defaultResponseProcessor,
    DefaultResponseProcessor,
    DefaultApiException,
} from './../src';
import type { ProcessedResponse } from './../src/responseProcessor';

class FormData {
    data = {};

    append(key, value) {
        this.data[key] = value;
    }

    toString() {
        return JSON.stringify(this.data);
    }
}

global.FormData = FormData;

const apiUrl = 'http://api-endpoint.dev';
const headers = new Headers({});

describe('Api service testing', () => {
    let api: Api<ProcessedResponse> = new Api(apiUrl, [
        defaultResponseProcessor,
    ]);

    describe('Test request', () => {
        beforeEach(() => {
            // eslint-disable-next-line no-undef
            spyOn(window, 'fetch').and.callFake((request: Request) => {
                return Promise.resolve(request);
            });
            api = new Api(apiUrl);
        });

        it('should convert data to json string', () => {
            expect(Api.convertData({ a: 'b' })).toEqual(JSON.stringify({ a: 'b' }));
        });

        it('should call request', async () => {
            const request = await api.request('some-namespace', 'GET');

            expect(request).toEqual(new Request(`${apiUrl}/some-namespace`, {
                headers,
            }));
        });

        it('should call request with full url', async () => {
            const request = await api.request('http://google.com/', 'GET');

            expect(request.url).toEqual('http://google.com/');
        });

        it('should call get request', async () => {
            const request = await api.get('some-namespace');

            expect(request.method).toEqual('GET');
        });

        it('should call delete request', async () => {
            const request = await api.delete('some-namespace');

            expect(request.method).toEqual('DELETE');
        });

        it('should call get request with parameters', async () => {
            const request = await api.get('some-namespace', { a: 'b', b: 2 });
            expect(request.url).toEqual(`${apiUrl}/some-namespace?a=b&b=2`);
        });

        it('should call post request', async () => {
            const request = await api.post('some-namespace');
            expect(request.method).toEqual('POST');
        });

        it('should call post request without data', () => {
            api.post('some-namespace').catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'POST',
                body: JSON.stringify({}),
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call put request', async () => {
            const request = await api.put('some-namespace');
            expect(request.method).toEqual('PUT');
        });

        it('should call put request without data', async () => {
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'PUT',
                body: JSON.stringify({}),
            });

            const apiRequest = await api.put('some-namespace');

            expect(request.method).toEqual(apiRequest.method);
            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call put request with form data', async () => {
            const formdata = new FormData();
            formdata.append('a', 'b');
            formdata.append('b', '2');
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'PUT',
                body: formdata,
            });

            const apiRequest = await api.put('some-namespace', { a: 'b', b: 2 }, FORM_DATA_FORMAT);
            expect(request).toEqual(apiRequest);
        });

        it('should call post request with body', () => {
            api.post('some-namespace', { a: 'b' }).catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'POST',
                body: JSON.stringify({ a: 'b' }),
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call post request with body in url encoded format', () => {
            api.post('some-namespace', { e: 'f' }, URL_ENCODED_FORMAT).catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'POST',
                body: 'e=f',
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should handle default headers', () => {
            api.setDefaultHeaders({ a: 'b' });

            expect(api.getDefaultHeaders()).toEqual({ a: 'b' });

            api.setDefaultHeader('c', 'd');

            expect(api.getDefaultHeaders()).toEqual({ a: 'b', c: 'd' });
            api.removeDefaultHeader('a');

            expect(api.getDefaultHeaders()).toEqual({ c: 'd' });
        });

        it('response should be processed through procesor', (done) => {
            const processor = () => {
                return Promise.resolve({ data: { changed: 'response' }, status: 200 });
            };

            api = new Api(apiUrl, [
                processor,
            ]);
            api
                .get('some-namespace')
                .then((response) => {
                    expect(response).toEqual({ data: { changed: 'response' }, status: 200 });
                    done();
                    return response;
                })
                .catch(error => error);
        });

        it('response should be processed multiple procesors', (done) => {
            const processor1 = () => {
                return Promise.resolve({ data: { changed: 'response' }, status: 200 });
            };

            const processor2 = (response: Object) => {
                return Promise.resolve(response.data);
            };

            api = new Api(apiUrl, [
                processor1,
                processor2,
            ]);
            api
                .get('some-namespace')
                .then((response) => {
                    expect(response).toEqual({ changed: 'response' });
                    done();
                    return response;
                })
                .catch(error => error);
        });

        it('throws ApiException on API error', async () => {
            const processor1 = () => {
                return Promise.resolve(new Response(JSON.stringify({ a: 'b' }), {
                    headers: new Headers({
                        'content-type': 'application/json',
                    }),
                    status: 500,
                }));
            };

            api = new Api(apiUrl, [
                processor1,
                new DefaultResponseProcessor(DefaultApiException),
            ]);

            let request;

            try {
                request = await api.get('some-namespace');
            } catch (exception) {
                expect(exception instanceof DefaultApiException).toBeTruthy();
            }

            expect(request).toBeUndefined();
        });

        it('throws regular exception if it is not API error', async () => {
            const processor1 = () => {
                return Promise.resolve({ status: 500 });
            };

            api = new Api(apiUrl, [
                processor1,
                new DefaultResponseProcessor(DefaultApiException),
            ]);

            let request;

            try {
                request = await api.get('some-namespace');
            } catch (exception) {
                expect(exception instanceof DefaultApiException).toBeFalsy();
            }

            expect(request).toBeUndefined();
        });
    });
});
