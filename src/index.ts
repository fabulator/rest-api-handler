import Api from './Api';
import DefaultResponseProcessor, { ApiResponseType as ApiResponseTypeSource } from './DefaultResponseProcessor';
import DefaultApiException, {
    ApiExceptionConstructor as ApiExceptionConstructorSource,
    ApiExceptionInterface as ApiExceptionInterfaceSource,
} from './DefaultApiException';

export { Api, DefaultResponseProcessor, DefaultApiException };

// piggy way how to reexport with babel
export type ApiResponseType<A> = ApiResponseTypeSource<A>;
export type ApiExceptionConstructor<A> = ApiExceptionConstructorSource<A>;
export type ApiExceptionInterface<A> = ApiExceptionInterfaceSource<A>;
