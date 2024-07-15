import { AxiosRequestHeaders, RawAxiosRequestHeaders, Method } from 'axios';

declare const METHOD_TYPES: {
    POST: string;
    PUT: string;
    DELETE: string;
    GET: string;
    LIST: string;
};
/**
 *
 * @param {Object} options
 * @param {String} options.name
 * @param {Function}options.endpoint
 * @param {Object} options.endpoints
 * @param {Object} options.entities
 */
type ApiBuilderOptions = {
    name?: string;
    endpoint?: Function;
    endpoints?: {
        [key: string]: {
            endpoint: Function;
            type: 'list' | 'create' | 'update' | 'destroy' | 'getById' | string;
        };
    };
    entities?: {
        [key: string]: {
            name: string;
            endpoint: Function;
        };
    };
    headers?: AxiosRequestHeaders | RawAxiosRequestHeaders;
};
declare const ApiBuilder: (options: ApiBuilderOptions) => Object;

/**
 * Convert api params to query string
 *
 * @param {Object}  params  Params to convert
 * @return {String}
 */
declare const toQueryString: (params: any) => string;
/**
 * Make a request and throw an error if response code is not in successful range.
 *
 * @param {String} url              The url of the request.
 * @param {Object} options
 * @param {String} options.method   The method for the request.
 * @param {Object} options.headers  The headers to send with the request.
 * @param {Object} options.body     The body to send with the request.
 */
type RequestOptionTypes = {
    method?: Method;
    headers?: AxiosRequestHeaders | RawAxiosRequestHeaders;
    body?: any;
    cancelToken?: any;
    formData?: boolean;
};
/**
 * Make a request with the ability to refresh tokens in the event of a 401.
 *
 * @param {String} url              The url of the request.
 * @param {Object} options
 * @param {Number} retry            Retry count
 * @param {String} options.method   The method for the request.
 * @param {Object} options.headers  The headers to send with the request.
 * @param {Object} options.body     The body to send with the request.
 */
declare function apiRequest(url: string, options: RequestOptionTypes): Promise<any>;

export { METHOD_TYPES, ApiBuilder as default, apiRequest as request, toQueryString };
