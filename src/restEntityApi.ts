import { apiRequest as request, toQueryString } from './request';
import { AxiosRequestHeaders, RawAxiosRequestHeaders } from 'axios';
type RestEntityAPIOptions = {
  name: string;
  endpoint: Function;
  selection?: Object;
  headers: AxiosRequestHeaders | RawAxiosRequestHeaders;
}

export type RestEntityAPIReturnTypes  = {
  create: Function;
  update: Function;
  destroy: Function;
  getById: Function;
  list: Function;
  buildEndpoint: Function;
  toQueryString: Function;
} & {}

const RestEntityAPI = (options:RestEntityAPIOptions): RestEntityAPIReturnTypes => {
  const { endpoint, selection, headers } = options;

  const buildEndpoint = (endpoint, params): string =>
    (Array.isArray(params) ? endpoint(...params) : endpoint(params));

  const create = async (data, params, cancelToken, query): Promise<any> =>
    request(`${buildEndpoint(endpoint, params)}${toQueryString(query)}`, {
      method: 'POST',
      body: data,
      cancelToken,
      headers,
      ...selection,
    });

  const update = async (id, data, params): Promise<any> =>
    request(`${buildEndpoint(endpoint, params)}/${id}`, {
      method: 'PUT',
      body: data,
      headers,
      ...selection,
    });

  const destroy = async (id = '', params): Promise<any> =>
    request(`${buildEndpoint(endpoint, params)}/${id}`, {
      method: 'DELETE',
      headers,
      ...selection,
    });

  const getById = async (id, params, query = null, cancelToken): Promise<any> =>
    request(
      `${buildEndpoint(endpoint, params)}/${id}${toQueryString(query)}`,
      { method: 'GET', cancelToken },
    );

  const list = async (query, params, cancelToken): Promise<any> =>
    request(`${buildEndpoint(endpoint, params)}${toQueryString(query)}`, {
      method: 'GET',
      cancelToken,
      headers,
      ...selection,
    });

  return {
    create,
    update,
    destroy,
    getById,
    list,
    buildEndpoint,
    toQueryString,
  };
};

export default RestEntityAPI;
