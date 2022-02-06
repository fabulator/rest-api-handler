import { ApiResponseType as ApiResponseTypeSource } from './DefaultResponseProcessor';
import {
    ApiExceptionConstructor as ApiExceptionConstructorSource,
    ApiExceptionInterface as ApiExceptionInterfaceSource,
} from './DefaultApiException';

// piggy way how to reexport with babel
export type ApiResponseType<A> = ApiResponseTypeSource<A>;
export type ApiExceptionConstructor<A> = ApiExceptionConstructorSource<A>;
export type ApiExceptionInterface<A> = ApiExceptionInterfaceSource<A>;

export { default as Api } from './Api';
export { default as DefaultResponseProcessor } from './DefaultResponseProcessor';
export { default as DefaultApiException } from './DefaultApiException';
