/**
 * @desc Types of formats of data you can send through body of Fetch request.
 */

/**
 * @desc Json is object converted to string. It is default format in a library.
 */
export const JSON = 'json';

/**
 * @desc Form Data can be used to send images.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
export const FORM_DATA = 'formdata';

/**
 * @desc Url encoded data in body
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
 */
export const URL_ENCODED = 'urlencoded';

export type Format = typeof JSON | typeof FORM_DATA | typeof URL_ENCODED;
