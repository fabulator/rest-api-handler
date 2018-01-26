// @flow
import { defaultResponseProcessor } from './../src';

describe('Response processor testing', () => {
    beforeEach(() => { });

    it('should decode text response', () => {
        const response = new Response(new Blob(['xyz']), {
            headers: new Headers({
                'content-type': 'text/csv',
            }),
        });

        defaultResponseProcessor(response).then((processedResponse) => {
            expect(processedResponse.data).toEqual('xyz');
            return processedResponse;
        }).catch(error => error);
    });

    it('should decode json response', (done) => {
        const response = new Response(new Blob([JSON.stringify({ a: 'b' })]), {
            headers: new Headers({
                'content-type': 'application/json',
            }),
            status: 200,
            body: '',
        });

        defaultResponseProcessor(response).then((processedResponse) => {
            expect(processedResponse.data).toEqual({ a: 'b' });
            done();
            return processedResponse;
        }).catch(error => error);
    });

    it('should decode response and throw error base on status', (done) => {
        const response = new Response(new Blob([JSON.stringify({ a: 'b' })]), {
            headers: new Headers({
                'content-type': 'application/json',
            }),
            status: 500,
        });

        defaultResponseProcessor(response).then((processedResponse) => {
            return processedResponse;
        }).catch((error) => {
            expect(error.data).toEqual({ a: 'b' });
            done();
        });
    });
});
