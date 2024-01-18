

import merge from 'lodash/merge';
import RestEntityAPI from './restEntityApi';
import request  from './request'
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
const ApiBuilder = (options) => {
    // Destructure the options object to get entities, endpoints, name, and endpoint
    const { entities, endpoints, name, endpoint } = options;
    // Define a function to get API endpoints
    const getApiEndpoints = (endpoints) => {
    // Initialize an empty object for API endpoints
    let apiEndpoints = {};
    // Initialize an empty object for API entities
    let apiEntities = {};

     // Define a function to get methods
     const getMethods = (properties, isEntity) =>
     // Use Object.keys and reduce to iterate over each property
     Object.keys(properties).reduce((methods, methodName) => {
       // Destructure the property to get endpoint, type, and selection
       const { endpoint, type, selection } = properties[methodName];
       // Create a new RestEntityAPI instance
       const api = RestEntityAPI({ methodName, endpoint, selection });
       // If isEntity is true, add the entire api instance to methods, otherwise add the specific API method
       methods[methodName] = isEntity ? api : api[API_METHODS[type]];
       // Return the updated methods object
       return methods;
     }, {});

      // If the name and endpoint are provided in the options
      if (name && endpoint) {
        // Create a new RestEntityAPI instance for the entire entity
        apiEntities = RestEntityAPI({ name, endpoint });
      }
      // If entities are provided and there are entities
      else if (entities && Object.keys(entities).length) {
        // Call getMethods function to get the methods for each entity
        apiEntities = getMethods(entities, true);
      }
      // If endpoints are provided and there are endpoints
      else if (endpoints && Object.keys(endpoints).length) {
        // Call getMethods function to get the methods for each endpoint
        apiEndpoints = getMethods(endpoints);
      }
 // Return an object with apiEntities and apiEndpoints
    return merge({}, { ...apiEndpoints }, { ...apiEntities });
  };
// Call getApiEndpoints function to get the API endpoints
  return { ...getApiEndpoints(endpoints) };
};

export { METHOD_TYPES, request };
export default ApiBuilder;
