// @flow
/**
 * @desc Types of formats of data you can send through body of Fetch request.
 * @todo rename file to data-formats
 * @todo rename variables to JSON and FORM_DATA
 */

/**
 * @desc Json is object converted to string. It is default format in a library.
 */
export const JSON_FORMAT: 'json' = 'json';

/**
 * @desc Form Data can be used to send images.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
export const FORM_DATA_FORMAT: 'formdata' = 'formdata';

export type Format = typeof JSON_FORMAT | typeof FORM_DATA_FORMAT;
