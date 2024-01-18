import axios from 'axios';

import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
import replace from 'lodash/replace';

/**
 * Convert api params to query string
 *
 * @param {Object}  params  Params to convert
 * @return {String}
 */
export const toQueryString = (params) =>
  // Use lodash's reduce function to iterate over each key-value pair in the params object
  reduce(
    params,
    (result, value, key) => {
      // If either the key or value is undefined, return the result as is
      if (value === undefined || key === undefined) {
        return result;
      }
      // If the value is an array and it has elements
      if (isArray(value) && value.length > 0) {
        // Use lodash's reduce function to iterate over each item in the value array
        const resultString = reduce(
          value,
          (result, valueItem) => {
            // Replace all occurrences of '#' with '%23' in the valueItem
            valueItem = replace(valueItem, new RegExp('#', 'g'), '%23');
            // Replace all occurrences of apostrophes with '%27' in the valueItem
            valueItem = replace(valueItem, new RegExp('[\'’]', 'g'), '%27');

            // Append the key-value pair to the result string, separated by '&' if result is not empty
            return `${result}${result === '' ? '' : '&'}${key}=${valueItem}`;
          },
          '',
        );
        // Append the resultString to the result, separated by '?' if result is empty, otherwise '&'
        return `${result}${result === '' ? '?' : '&'}${resultString}`;
      }

      // If the value is not an array, replace all occurrences of '#' with '%23' and apostrophes with '%27' in the value
      value = replace(value, new RegExp('#', 'g'), '%23');
      value = replace(value, new RegExp('[\'’]', 'g'), '%27');

      // Append the key-value pair to the result, separated by '?' if result is empty, otherwise '&'
      return `${result}${result === '' ? '?' : '&'}${key}=${value}`;
    },
    '',
  );

/**
 * Return headers for network request
 *
 * @param {Object}  options
 * @return {Object} headers
 */
async function getRequestHeaders(options = {}) {
    // Define default headers
    const headers = {
      'Content-Type': 'application/json',
      // Spread operator is used to include any additional headers passed in options
      ...options.headers,
    };
    // Return the headers object
    return headers;
  }

/**
 * Make a request and throw an error if response code is not in successful range.
 *
 * @param {String} url              The url of the request.
 * @param {Object} options
 * @param {String} options.method   The method for the request.
 * @param {Object} options.headers  The headers to send with the request.
 * @param {Object} options.body     The body to send with the request.
 */
async function makeRequest(url, options = {}) {
  let response;
  const requestHeaders = await getRequestHeaders(options);
  const requestOptions = {
    url,
    method: options.method || 'GET',
    headers: requestHeaders,
    data: options.body,
    cancelToken: options.cancelToken,
  };
    // If form data is supplied, do not stringify the body and
    // remove the Content-Type header so that the browser can set it itself.
  if (options.formData) {
    requestOptions.headers['Content-Type'] = 'multipart/form-data';
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

  // Throw an error if the status code is not a successful status code.
  if (response.status < 200 || response.status > 299) {
    throw response;
  }

  // Otherwise, return the response.
  return response;
}

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
export async function apiRequest(url, options = {}) {
  try {
    // Make request with current tokens.
    const response = await makeRequest(url, options);
    // Should just return if no-content response
    if (response.status === 204) {
      return true;
    }

    return response.data;
  } catch (error) {
    const response = error.response || error || {};
    const getEndpoint = (url) =>
      url.substring(
        url.length,
        url.indexOf('?') > -1 ? url.indexOf('?') : undefined,
      );
    const endpoint = url.includes(getEndpoint(url))
      ? getEndpoint(url)
      : 'external endpoint';
    /* eslint-disable-next-line no-underscore-dangle */
    const errorMessage = `Received ${response.status} from ${error?.request?._method} request to ${endpoint}`;
    console.log(`${errorMessage}`, {
      url,
      status: response.status,
      error: response?.data?.error,
      message: response?.data?.message,
      method: options.method,
      headers: options.headers,
    });

    throw error;
  }
}
