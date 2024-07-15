// src/api-builder.ts
import merge from "lodash/merge";

// src/request.ts
import axios from "axios";
import isArray from "lodash/isArray";
import reduce from "lodash/reduce";
import replace from "lodash/replace";
var toQueryString = (params) => (
  // Use lodash's reduce function to iterate over each key-value pair in the params object
  reduce(
    params,
    (result, value, key) => {
      if (value === void 0 || key === void 0) {
        return result;
      }
      if (isArray(value) && value.length > 0) {
        const resultString = reduce(
          value,
          (result2, valueItem) => {
            valueItem = replace(valueItem, new RegExp("#", "g"), "%23");
            valueItem = replace(valueItem, new RegExp("['\u2019]", "g"), "%27");
            return `${result2}${result2 === "" ? "" : "&"}${key}=${valueItem}`;
          },
          ""
        );
        return `${result}${result === "" ? "?" : "&"}${resultString}`;
      }
      value = replace(value, new RegExp("#", "g"), "%23");
      value = replace(value, new RegExp("['\u2019]", "g"), "%27");
      return `${result}${result === "" ? "?" : "&"}${key}=${value}`;
    },
    ""
  )
);
async function getRequestHeaders(options) {
  const headers = {
    "Content-Type": "application/json",
    // Spread operator is used to include any additional headers passed in options
    ...options.headers
  };
  return headers;
}
async function makeRequest(url, options) {
  let response;
  const requestHeaders = await getRequestHeaders(options);
  const requestOptions = {
    url,
    method: options.method || "GET",
    headers: Object.entries(requestHeaders).reduce((headers, [key, value]) => {
      headers[key] = value.toString();
      return headers;
    }, {}),
    data: options.body,
    cancelToken: options.cancelToken
  };
  if (options.formData) {
    requestOptions.headers["Content-Type"] = "multipart/form-data";
  }
  if (options.formData) {
    response = await fetch(url, { body: options.body, ...requestOptions });
    if (response.status < 200 || response.status > 299) {
      throw response;
    }
    const parseResponse = await response.json();
    response = { data: parseResponse };
  } else {
    response = await axios(requestOptions);
  }
  if (response.status < 200 || response.status > 299) {
    throw response;
  }
  return response;
}
async function apiRequest(url, options) {
  var _a, _b, _c;
  try {
    const response = await makeRequest(url, options);
    if (response.status === 204) {
      return true;
    }
    return response.data;
  } catch (error) {
    const response = error.response || error || {};
    const getEndpoint = (url2) => url2.substring(
      url2.length,
      url2.indexOf("?") > -1 ? url2.indexOf("?") : void 0
    );
    const endpoint = url.includes(getEndpoint(url)) ? getEndpoint(url) : "external endpoint";
    const errorMessage = `Received ${response.status} from ${(_a = error == null ? void 0 : error.request) == null ? void 0 : _a._method} request to ${endpoint}`;
    console.log(`${errorMessage}`, {
      url,
      status: response.status,
      error: (_b = response == null ? void 0 : response.data) == null ? void 0 : _b.error,
      message: (_c = response == null ? void 0 : response.data) == null ? void 0 : _c.message,
      method: options.method,
      headers: options.headers
    });
    throw error;
  }
}

// src/restEntityApi.ts
var RestEntityAPI = (options) => {
  const { endpoint, selection, headers } = options;
  const buildEndpoint = (endpoint2, params) => Array.isArray(params) ? endpoint2(...params) : endpoint2(params);
  const create = async (data, params, cancelToken, query) => apiRequest(`${buildEndpoint(endpoint, params)}${toQueryString(query)}`, {
    method: "POST",
    body: data,
    cancelToken,
    headers,
    ...selection
  });
  const update = async (id, data, params) => apiRequest(`${buildEndpoint(endpoint, params)}/${id}`, {
    method: "PUT",
    body: data,
    headers,
    ...selection
  });
  const destroy = async (id = "", params) => apiRequest(`${buildEndpoint(endpoint, params)}/${id}`, {
    method: "DELETE",
    headers,
    ...selection
  });
  const getById = async (id, params, query = null, cancelToken) => apiRequest(
    `${buildEndpoint(endpoint, params)}/${id}${toQueryString(query)}`,
    { method: "GET", cancelToken }
  );
  const list = async (query, params, cancelToken) => apiRequest(`${buildEndpoint(endpoint, params)}${toQueryString(query)}`, {
    method: "GET",
    cancelToken,
    headers,
    ...selection
  });
  return {
    create,
    update,
    destroy,
    getById,
    list,
    buildEndpoint,
    toQueryString
  };
};
var restEntityApi_default = RestEntityAPI;

// src/api-builder.ts
var METHOD_TYPES = {
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  GET: "GET",
  LIST: "GET"
};
var API_METHODS = {
  [METHOD_TYPES.POST]: "create",
  [METHOD_TYPES.PUT]: "update",
  [METHOD_TYPES.DELETE]: "destroy",
  [METHOD_TYPES.GET]: "getById",
  [METHOD_TYPES.LIST]: "list"
};
var ApiBuilder = (options) => {
  const {
    entities,
    endpoints,
    name,
    endpoint,
    headers
  } = options;
  const getApiEndpoints = (endpoints2) => {
    let apiEndpoints = {};
    let apiEntities = {};
    const getMethods = (properties, isEntity, headerOptions) => (
      // Use Object.keys and reduce to iterate over each property
      Object.keys(properties).reduce((methods, methodName) => {
        const { endpoint: endpoint2, type, selection } = properties[methodName];
        const api = restEntityApi_default({ name: methodName, endpoint: endpoint2, selection, headers: headerOptions });
        methods[methodName] = isEntity ? api : api[API_METHODS[type]];
        return methods;
      }, {})
    );
    if (name && endpoint) {
      apiEntities = restEntityApi_default({ name, endpoint, headers });
    } else if (entities && Object.keys(entities).length) {
      apiEntities = getMethods(entities, true, headers);
    } else if (endpoints2 && Object.keys(endpoints2).length) {
      apiEndpoints = getMethods(endpoints2, false, headers);
    }
    return merge({}, { ...apiEndpoints }, { ...apiEntities });
  };
  return { ...getApiEndpoints(endpoints) };
};
var api_builder_default = ApiBuilder;

// index.ts
var client_http_api_request_builder_default = api_builder_default;
export {
  METHOD_TYPES,
  client_http_api_request_builder_default as default,
  apiRequest as request,
  toQueryString
};
//# sourceMappingURL=index.js.map