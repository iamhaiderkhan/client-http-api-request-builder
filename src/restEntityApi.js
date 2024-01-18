import  {apiRequest as request, toQueryString } from './request';

const RestEntityAPI = (options) => {
  const { endpoint, selection } = options;

  const buildEndpoint = (endpoint, params) =>
    (Array.isArray(params) ? endpoint(...params) : endpoint(params));

  const create = async (data, params, cancelToken, query) =>
    request(`${buildEndpoint(endpoint, params)}${toQueryString(query)}`, {
      method: 'POST',
      body: data,
      cancelToken,
      ...selection,
    });

  const update = async (id, data, params) =>
    request(`${buildEndpoint(endpoint, params)}/${id}`, {
      method: 'PUT',
      body: data,
      ...selection,
    });

  const destroy = async (id = '', params) =>
    request(`${buildEndpoint(endpoint, params)}/${id}`, {
      method: 'DELETE',
      ...selection,
    });

  const getById = async (id, params, query = null, cancelToken) =>
    request(
      `${buildEndpoint(endpoint, params)}/${id}${toQueryString(query)}`,
      { method: 'GET', cancelToken },
    );

  const list = async (query, params, cancelToken) =>
    request(`${buildEndpoint(endpoint, params)}${toQueryString(query)}`, {
      method: 'GET',
      cancelToken,
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
