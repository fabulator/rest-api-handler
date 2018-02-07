// @flow
import {
    Api,
    FORM_DATA_FORMAT,
    defaultResponseProcessor,
    DefaultResponseProcessor,
    DefaultApiException,
} from './../src';

const apiUrl = 'http://api-endpoint.dev';
const headers = new Headers({});

describe('Api service testing', () => {
    let api: Api = new Api(apiUrl, [
        defaultResponseProcessor,
    ]);

    describe('Test request', () => {
        beforeEach(() => {
            spyOn(window, 'fetch').and.callFake((request: Request) => {
                return Promise.resolve(request);
            });
            api = new Api(apiUrl);
        });

        it('should convert data to json string', () => {
            expect(Api.convertData({ a: 'b' })).toEqual(JSON.stringify({ a: 'b' }));
        });

        it('should call request', () => {
            api.request('some-namespace', 'GET').catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call get request', () => {
            api.get('some-namespace').catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call delete request', () => {
            api.delete('some-namespace').catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'Delete',
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call get request with parameters', () => {
            api.get('some-namespace', { a: 'b', b: 2 }).catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace?a=b&b=2`, {
                headers,
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call post request', () => {
            api.post('some-namespace', {}).catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'POST',
                body: JSON.stringify({}),
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
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

        it('should call put request', () => {
            api.put('some-namespace', { a: 'b', b: 2 }).catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'PUT',
                body: JSON.stringify({ a: 'b', b: 2 }),
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call put request without data', () => {
            api.put('some-namespace').catch(error => error);
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'PUT',
                body: JSON.stringify({}),
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
        });

        it('should call put request with form data', () => {
            api.put('some-namespace', { a: 'b', b: 2 }, FORM_DATA_FORMAT).catch(error => error);
            const formdata = new FormData();
            formdata.append('a', 'b');
            formdata.append('b', '2');
            const request: Request = new Request(`${apiUrl}/some-namespace`, {
                headers,
                method: 'PUT',
                body: formdata,
            });

            expect(window.fetch).toHaveBeenCalledWith(request);
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

        it('throws ApiException on API error', (done) => {
            const processor1 = () => {
                return Promise.resolve(new Response(new Blob([JSON.stringify({ a: 'b' })]), {
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

            api
                .get('some-namespace')
                .catch((exception) => {
                    expect(exception instanceof DefaultApiException).toBeTruthy();
                    done();
                    throw exception;
                });
        });

        it('throws regular exception if it is not API error', (done) => {
            const processor1 = () => {
                return Promise.resolve({ status: 500 });
            };

            api = new Api(apiUrl, [
                processor1,
                new DefaultResponseProcessor(DefaultApiException),
            ]);

            api
                .get('some-namespace')
                .catch((exception) => {
                    expect(exception instanceof DefaultApiException).toBeFalsy();
                    done();
                    throw exception;
                });
        });
    });
});
