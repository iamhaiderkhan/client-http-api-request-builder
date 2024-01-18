"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.METHOD_TYPES = void 0;
Object.defineProperty(exports, "request", {
  enumerable: true,
  get: function get() {
    return _request["default"];
  }
});
var _merge = _interopRequireDefault(require("lodash/merge"));
var _restEntityApi = _interopRequireDefault(require("./restEntityApi"));
var _request = _interopRequireDefault(require("./request"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var METHOD_TYPES = exports.METHOD_TYPES = {
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  GET: 'GET',
  LIST: 'GET'
};
var API_METHODS = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, METHOD_TYPES.POST, 'create'), METHOD_TYPES.PUT, 'update'), METHOD_TYPES.DELETE, 'destroy'), METHOD_TYPES.GET, 'getById'), METHOD_TYPES.LIST, 'list');

/**
 *
 * @param {Object} options
 * @param {String} options.name
 * @param {Function}options.endpoint
 * @param {Object} options.endpoints
 * @param {Object} options.entities
 */
var ApiBuilder = function ApiBuilder(options) {
  // Destructure the options object to get entities, endpoints, name, and endpoint
  var entities = options.entities,
    endpoints = options.endpoints,
    name = options.name,
    endpoint = options.endpoint;
  // Define a function to get API endpoints
  var getApiEndpoints = function getApiEndpoints(endpoints) {
    // Initialize an empty object for API endpoints
    var apiEndpoints = {};
    // Initialize an empty object for API entities
    var apiEntities = {};

    // Define a function to get methods
    var getMethods = function getMethods(properties, isEntity) {
      return (
        // Use Object.keys and reduce to iterate over each property
        Object.keys(properties).reduce(function (methods, methodName) {
          // Destructure the property to get endpoint, type, and selection
          var _properties$methodNam = properties[methodName],
            endpoint = _properties$methodNam.endpoint,
            type = _properties$methodNam.type,
            selection = _properties$methodNam.selection;
          // Create a new RestEntityAPI instance
          var api = (0, _restEntityApi["default"])({
            methodName: methodName,
            endpoint: endpoint,
            selection: selection
          });
          // If isEntity is true, add the entire api instance to methods, otherwise add the specific API method
          methods[methodName] = isEntity ? api : api[API_METHODS[type]];
          // Return the updated methods object
          return methods;
        }, {})
      );
    };

    // If the name and endpoint are provided in the options
    if (name && endpoint) {
      // Create a new RestEntityAPI instance for the entire entity
      apiEntities = (0, _restEntityApi["default"])({
        name: name,
        endpoint: endpoint
      });
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
    return (0, _merge["default"])({}, _objectSpread({}, apiEndpoints), _objectSpread({}, apiEntities));
  };
  // Call getApiEndpoints function to get the API endpoints
  return _objectSpread({}, getApiEndpoints(endpoints));
};
var _default = exports["default"] = ApiBuilder;