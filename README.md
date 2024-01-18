# Client HTTP API Request Builder

This project provides a set of utilities for building and interacting with HTTP APIs in a client-side JavaScript application.

## Overview

The `client-http-api-request-builder` is designed to simplify the process of making HTTP requests to RESTful APIs. It provides a builder pattern for constructing API requests, and includes utilities for handling common tasks such as setting headers, handling different HTTP methods, and managing endpoints.

## Key Files

- `api-builder.js`: Contains the `ApiBuilder`, which provides methods for building API requests for entities or endpoints. The `ApiBuilder` function is used to build an API. It takes an options object as a parameter, which can include entities, endpoints, a name, and an endpoint.

- `request.js`: Contains the `apiRequest` function, which is used to make the actual HTTP requests, and the `toQueryString` function, which converts an object to a query string for GET requests.

- `restEntityApi.js`: `RestEntityAPI` are used to encapsulate the logic for making HTTP requests to a REST API, including creating, reading, updating, and deleting resources

## Installation

First, Install a `client-http-api-request-builder` package from npm.

To install and set up the library, run:
```javascript
npm install client-http-api-request-builder
```
Or if you prefer using Yarn:
```javascript
yarn add client-http-api-request-builder
```

## Usage
```javascript
import ApiBuilder from 'client-http-api-request-builder'

const UsersAPI = ApiBuilder({
    name:'users',
    endpoint: () => 'https://your.baseUrl/users'
})
```
Now `UserAPI` have http request methods for create, update, destroy, getById and list for this endpoint `'https://your.baseUrl/users'`.

```javascript
await UsersAPI.create({...payload});
await UsersAPI.update('id',{...updatedPayload});
await UsersAPI.destroy('id');
await UsersAPI.getById('id',{},{...query});
await UsersAPI.list({...query});
```

## Generate Mutiple Entities in a single run
You can generate methods for multiple entities in a single run.

```javascript
import ApiBuilder from 'client-http-api-request-builder'

const API = ApiBuilder({
    entities:{
        users:{
            name:'users',
            endpoint: () => 'https://your.baseUrl/users'
        },
        books:{
            name:'books',
            endpoint: () => 'https://your.baseUrl/books'
        }
    }
})
```
Now `API` have `API.users`, `API.books` and both have http request methods for create, update, destroy, getById and list respect to their endpoint `'https://your.baseUrl/users'`, `'https://your.baseUrl/books'`.

```javascript
// for user
await API.users.create({...payload});
await API.users.update('id',{...updatedPayload});
await API.users.destroy('id');
await API.users.getById('id',{},{...query});
await API.users.list({...query});

// for books
await API.books.create({...payload});
await API.books.update('id',{...updatedPayload});
await API.books.destroy('id');
await API.books.getById('id',{},{...query});
await API.books.list({...query});
```

## Generate Mutiple enpoints in a single run
If you need different methods for different endpoints you can define your own methods name with request method types.

```javascript
import ApiBuilder, { METHOD_TYPES } from 'client-http-api-request-builder'

const API = ApiBuilder({
    endpoints:{
        getUsers:{
            type: METHOD_TYPES.LIST,
            endpoint: () => 'https://your.baseUrl/users-list'
        },
        getSingleBookByUserId:{
            type: METHOD_TYPES.GET,
            endpoint: (bookId) => 'https://your.baseUrl/book/${bookId}/users'
        }
    }
})
```
Now `API` have `API.getUsers` and `API.getSingleBookByUserId` functions.

```javascript
await API.getUsers({page:4}); // https://your.baseUrl/users-list?page=4

await API.getSingleBookByUserId('userId',['bookId'],{author='haider'});
//'https://your.baseUrl/book/bookId/users/userId?author=haider'
```

## Generate Custom request methods & formData request.
```javascript
import ApiBuilder, { METHOD_TYPES, request } from 'client-http-api-request-builder'

const API = ApiBuilder({
    endpoints:{
        getUsers:{
            type: METHOD_TYPES.LIST,
            endpoint: () => 'https://your.baseUrl/users-list'
        }
    }
});

const getSingleBookByUserId = (userId, BookId) => request(
    `https://your.baseUrl/book/${bookId}/users/${userId}`,{
     method: 'GET',
     headers:{
        'Content-Type': 'application/json',
     }
    },
);

 const uploadPhoto = (data) =>
    request(
      `https://your.baseUrl/api/photo`, {
        method: 'POST',
        body: data,
        formData: true,
      },
    );

return {
    ...API,
    getSingleBookByUserId,
    uploadPhoto
}

```
Now `API` have `API.getUsers` and `API.getSingleBookByUserId` functions.

```javascript
await API.getUsers({page:4}); // https://your.baseUrl/users-list?page=4

await API.getSingleBookByUserId('userId','bookId');
//'https://your.baseUrl/book/bookId/users/userId'

const data = new FormData();
data.append('image', image);
await API.uploadPhoto(data); // https://your.baseUrl/api/photo
```
