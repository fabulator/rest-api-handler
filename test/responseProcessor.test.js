// @flow
import 'cross-fetch/polyfill';
import { defaultResponseProcessor } from '../src';

describe('Response processor testing', () => {
    beforeEach(() => { });

    it('should decode response without content type as teext', async () => {
        const response = new Response('xyz', {
            headers: new Headers({}),
        });

        const processedResponse = await defaultResponseProcessor(response);

        expect(processedResponse.data).toEqual('xyz');
    });

    it('should decode text response', async () => {
        const response = new Response('xyz', {
            headers: new Headers({
                'content-type': 'text/csv',
            }),
        });

        const processedResponse = await defaultResponseProcessor(response);

        expect(processedResponse.data).toEqual('xyz');
    });

    it('should decode json response', async () => {
        const response = new Response(JSON.stringify({ a: 'b' }), {
            headers: new Headers({
                'content-type': 'application/json',
            }),
            status: 200,
            body: '',
        });

        const processedResponse = await defaultResponseProcessor(response);

        expect(processedResponse.data).toEqual({ a: 'b' });
    });

    it('should decode blob response', async () => {
        const response = new Response('xyz', {
            headers: new Headers({
                'content-type': 'other',
            }),
            status: 200,
            body: '',
        });

        const processedResponse = await defaultResponseProcessor(response);

        expect(processedResponse.data.toString()).toEqual('[object Blob]');
    });

    it('should decode response and throw error base on status', async () => {
        const response = new Response(JSON.stringify({ a: 'b' }), {
            headers: new Headers({
                'content-type': 'application/json',
            }),
            status: 500,
        });

        let processedResponse;
        try {
            processedResponse = await defaultResponseProcessor(response);
        } catch (exception) {
            expect(exception.data).toEqual({ a: 'b' });
        }

        expect(processedResponse).toBeUndefined();
    });
});
