import merge from 'lodash/merge';
import RestEntityAPI,{RestEntityAPIReturnTypes} from './restEntityApi';
import { AxiosRequestHeaders, RawAxiosRequestHeaders } from 'axios';

const METHOD_TYPES = {
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  GET: 'GET',
  LIST: 'GET',
};

const API_METHODS = {
  [METHOD_TYPES.POST]: 'create',
  [METHOD_TYPES.PUT]: 'update',
  [METHOD_TYPES.DELETE]: 'destroy',
  [METHOD_TYPES.GET]: 'getById',
  [METHOD_TYPES.LIST]: 'list',
};

/**
 *
 * @param {Object} options
 * @param {String} options.name
 * @param {Function}options.endpoint
 * @param {Object} options.endpoints
 * @param {Object} options.entities
 */

interface ApiBuilderOptions {
  name?: string;
  endpoint?: () => string;
  endpoints?: {
    [x: string]: {
      endpoint: ()=> string;
      type:  'list' | 'create' | 'update' | 'destroy' | 'getById' | string
    }
  };
  entities?: {
    [key: string]: {
      name: string;
      endpoint: ()=> string;
  } };
  headers?: AxiosRequestHeaders | RawAxiosRequestHeaders;
}

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
    ? I
    : never;

interface DefaultEntityAPIReturnTypes extends RestEntityAPIReturnTypes{ }

 interface EndpointsAPIReturnTypes {
  [key: string]: UnionToIntersection<RestEntityAPIReturnTypes[keyof RestEntityAPIReturnTypes]>;
}
 interface EntityAPIReturnTypes {
  [key: string]: RestEntityAPIReturnTypes;
}

const ApiBuilder = (options: ApiBuilderOptions)  =>  {
  // Destructure the options object to get entities, endpoints, name, endpoint and headers
  const {
    entities, endpoints, name, endpoint, headers,
  } = options;
  // Define a function to get API endpoints
  const getApiEndpoints = (endpoints) =>  {
    // Initialize an empty object for API endpoints
    let apiEndpoints = {};
    // Initialize an empty object for API entities
    let apiEntities = {};

    // Define a function to get methods
    const getMethods = (properties, isEntity, headerOptions) =>
    // Use Object.keys and reduce to iterate over each property
      Object.keys(properties).reduce((methods, methodName) => {
        // Destructure the property to get endpoint, type, and selection
        const { endpoint, type, selection } = properties[methodName];
        // Create a new RestEntityAPI instance
        const api = RestEntityAPI({ name:methodName, endpoint, selection, headers: headerOptions });
        // If isEntity is true, add the entire api instance to methods, otherwise add the specific API method

        methods[methodName] = isEntity ? api : api[API_METHODS[type]];
        // Return the updated methods object
        return methods;
      }, {});

    // If the name and endpoint are provided in the options
    if (name && endpoint) {
      // Create a new RestEntityAPI instance for the entire entity
      apiEntities = RestEntityAPI({ name, endpoint, headers });
    }
    // If entities are provided and there are entities
    else if (entities && Object.keys(entities).length) {
      // Call getMethods function to get the methods for each entity
      apiEntities = getMethods(entities, true, headers);
    }
    // If endpoints are provided and there are endpoints
    else if (endpoints && Object.keys(endpoints).length) {
      // Call getMethods function to get the methods for each endpoint
      apiEndpoints = getMethods(endpoints, false, headers);
    }
    // Return an object with apiEntities and apiEndpoints
    return merge({}, { ...apiEndpoints }, { ...apiEntities });
  };

  // Call getApiEndpoints function to get the API endpoints
  return { ...getApiEndpoints(endpoints)} as DefaultEntityAPIReturnTypes & EndpointsAPIReturnTypes & EntityAPIReturnTypes;
};

export { METHOD_TYPES, DefaultEntityAPIReturnTypes, EndpointsAPIReturnTypes, EntityAPIReturnTypes };
export default ApiBuilder;
