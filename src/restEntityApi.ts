import { apiRequest as request, toQueryString } from './request';
import { AxiosRequestHeaders, RawAxiosRequestHeaders } from 'axios';
type RestEntityAPIOptions = {
  name: string;
  endpoint: Function;
  selection?: Object;
  headers: AxiosRequestHeaders | RawAxiosRequestHeaders;
}

interface CreateTypes {
  data?: any;
  params?: any;
  cancelToken?: any;
  query?: any;
}
interface UpdateTypes {
  id?: any;
  data?: any;
  params?: any;
}
interface DestroyTypes {
  id?: any;
  params?: any;
}
interface GetByIdTypes {
  id?: any;
  params?: any;
  query?: any;
  cancelToken?: any;
}
interface ListTypes {
  query?: any;
  params?: any;
  cancelToken?: any;
}


export type RestEntityAPIReturnTypes  = {
  create: (data?: CreateTypes['data'], params?: CreateTypes['params'], cancelToken?: CreateTypes['cancelToken'], query?: CreateTypes['query']) => Promise<any>;
  update: (id?: UpdateTypes['id'], data?: UpdateTypes['data'], params?: UpdateTypes['params']) => Promise<any>;
  destroy: (id?: DestroyTypes['id'], params?: DestroyTypes['params']) => Promise<any>;
  getById: (id?: GetByIdTypes['id'], params?: GetByIdTypes['params'], query?: GetByIdTypes['query'], cancelToken?: GetByIdTypes['cancelToken']) => Promise<any>;
  list:  (query?: ListTypes['query'], params?: ListTypes['params'], cancelToken?: ListTypes['cancelToken']) => Promise<any>;
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
