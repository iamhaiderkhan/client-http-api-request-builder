var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var client_http_api_request_builder_exports = {};
__export(client_http_api_request_builder_exports, {
  METHOD_TYPES: () => METHOD_TYPES,
  default: () => client_http_api_request_builder_default,
  request: () => apiRequest,
  toQueryString: () => toQueryString
});
module.exports = __toCommonJS(client_http_api_request_builder_exports);

// src/api-builder.ts
var import_merge = __toESM(require("lodash/merge"), 1);

// src/request.ts
var import_axios = __toESM(require("axios"), 1);
var import_isArray = __toESM(require("lodash/isArray"), 1);
var import_reduce = __toESM(require("lodash/reduce"), 1);
var import_replace = __toESM(require("lodash/replace"), 1);
var toQueryString = (params) => (
  // Use lodash's reduce function to iterate over each key-value pair in the params object
  (0, import_reduce.default)(
    params,
    (result, value, key) => {
      if (value === void 0 || key === void 0) {
        return result;
      }
      if ((0, import_isArray.default)(value) && value.length > 0) {
        const resultString = (0, import_reduce.default)(
          value,
          (result2, valueItem) => {
            valueItem = (0, import_replace.default)(valueItem, new RegExp("#", "g"), "%23");
            valueItem = (0, import_replace.default)(valueItem, new RegExp("['\u2019]", "g"), "%27");
            return `${result2}${result2 === "" ? "" : "&"}${key}=${valueItem}`;
          },
          ""
        );
        return `${result}${result === "" ? "?" : "&"}${resultString}`;
      }
      value = (0, import_replace.default)(value, new RegExp("#", "g"), "%23");
      value = (0, import_replace.default)(value, new RegExp("['\u2019]", "g"), "%27");
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
    response = await (0, import_axios.default)(requestOptions);
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
    return (0, import_merge.default)({}, { ...apiEndpoints }, { ...apiEntities });
  };
  return { ...getApiEndpoints(endpoints) };
};
var api_builder_default = ApiBuilder;

// index.ts
var client_http_api_request_builder_default = api_builder_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  METHOD_TYPES,
  request,
  toQueryString
});
//# sourceMappingURL=index.cjs.map