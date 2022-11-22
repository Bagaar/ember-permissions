# @bagaar/ember-permissions

[![CI](https://github.com/Bagaar/ember-permissions/workflows/CI/badge.svg)](https://github.com/Bagaar/ember-permissions/actions?query=workflow%3ACI)
[![NPM Version](https://badge.fury.io/js/%40bagaar%2Fember-permissions.svg)](https://badge.fury.io/js/%40bagaar%2Fember-permissions)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Permission management for Ember applications.

## Table of Contents

- [Introduction](#introduction)
- [Compatibility](#compatibility)
- [Installation](#installation)
- [Usage](#usage)
- [Public API](#public-api)
  - [`permissions` Service](#permissions-service)
    - Methods:
      - [`setPermissions`](#setpermissions)
      - [`setRoutePermissions`](#setroutepermissions)
      - [`hasPermissions`](#haspermissions)
      - [`canAccessRoute`](#canaccessroute)
      - [`enableRouteValidation`](#enableroutevalidation)
    - Events:
      - [`route-access-denied`](#route-access-denied)
  - [Helpers](#helpers)
    - [`has-permissions`](#has-permissions)
    - [`can-access-route`](#can-access-route)
- [Contributing](#contributing)
- [License](#license)
- [Maintenance](#maintenance)

## Introduction

`@bagaar/ember-permissions` is an addon that allows you to **manage and validate permissions** for the current session. It also allows you to **define required permissions per route** so you can protect specific parts of your application. Instead of using a mixin to protect your routes, the addon allows you to define the required permissions per route in a single file. Whenever a transition occurs that is denied, a [`route-access-denied`](#route-access-denied) event is triggered so you can decide how to handle the denied transition.

## Compatibility

- Ember.js v3.28 or above
- Ember CLI v3.28 or above
- Node.js v14 or above

## Installation

```shell
ember install @bagaar/ember-permissions
```

## Usage

### 1\. Setting up Session Permissions

First, we need to let the `permissions` service know which permissions are available for the current session. In the example below, we're using an additional `api` service to request the permissions from an API. Afterwards, we pass along the permissions to the `permissions` service via the [`setPermissions`](#setpermissions) method.

```javascript
// app/routes/protected.js

import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ProtectedRoute extends Route {
  @service('api') apiService;
  @service('permissions') permissionsService;

  async beforeModel() {
    const permissions = await this.apiService.request('/permissions');

    this.permissionsService.setPermissions(permissions);
  }
}
```

Once the permissions are set, we can start checking their presence. In the example below, we use the [`has-permissions`](#has-permissions) helper to conditionally render a delete button based on the presence of the `delete-users` permission.

```handlebars
{{! app/templates/users/index.hbs }}

{{#if (has-permissions "delete-users")}}
  <button type="button">
    Delete User
  </button>
{{/if}}
```

> **NOTE:** If you need to validate permissions inside a JavaScript file, you can use the [`hasPermissions`](#haspermissions) method on the `permissions` service instead.

### 2\. Setting up Route Permissions

Start off with defining the required permissions per route. You're free to define them where you want, as long as the format is the same as shown below.

```javascript
// app/route-permissions.js

export default {
  'users.index': ['view-users'],
  'users.create': ['create-users'],
  'users.edit': ['edit-users'],
};
```

Next, edit the `protected` route from step 1 as follows:

1. Use the [`setRoutePermissions`](#setroutepermissions) method to pass along the required permissions per route to the `permissions` service
2. Handle the [`route-access-denied`](#route-access-denied) event to determine what to do when a transition is denied
3. Call [`enableRouteValidation`](#enableroutevalidation) with the initial transition

```javascript
// app/routes/protected.js

import { registerDestructor } from '@ember/destroyable';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ROUTE_PERMISSIONS from 'app-name/route-permissions';

export default class ProtectedRoute extends Route {
  @service('api') apiService;
  @service('permissions') permissionsService;
  @service('router') routerService;

  async beforeModel(transition) {
    const permissions = await this.apiService.request('/permissions');

    this.permissionsService.setPermissions(permissions);
    this.permissionsService.setRoutePermissions(ROUTE_PERMISSIONS);

    const accessDeniedHandler = (/* deniedTransition */) => {
      this.routerService.replaceWith('error', { error: 'access-denied' });
    };

    this.permissionsService.on('route-access-denied', accessDeniedHandler);

    registerDestructor(this, () => {
      this.permissionsService.off('route-access-denied', accessDeniedHandler);
    });

    this.permissionsService.enableRouteValidation(transition);
  }
}
```

Now, each transition will be validated (including the provided initial transition) against the required permissions per route. If a transition is denied, the [`route-access-denied`](#route-access-denied) event will be triggered.

Since the required permissions per route are now set, we can start checking if routes can be accessed. In the example below, we use the [`can-access-route`](#can-access-route) helper to do so.

```handlebars
{{! app/components/menu.hbs }}

{{#if (can-access-route "users.index")}}
  <li>
    <LinkTo @route="users.index">
      Users
    </LinkTo>
  </li>
{{/if}}
```

> **NOTE:** If you need to validate if a route can be accessed inside a JavaScript file, you can use the [`canAccessRoute`](#canaccessroute) method on the `permissions` service instead.

## Public API

### `permissions` Service

#### Methods

##### `setPermissions`

Set the permissions for the current session.

###### Arguments

An array of permissions.

###### Returns

/

###### Example

```javascript
permissionsService.setPermissions([
  'view-users',
  'create-users',
  'edit-users',
]);
```

##### `setRoutePermissions`

Set the required permissions per route.

###### Arguments

An object of which the keys are route names and the values are arrays of required permissions.

###### Returns

/

###### Example

```javascript
permissionsService.setRoutePermissions({
  'users.index': ['view-users'],
  'users.create': ['create-users'],
  'users.edit': ['edit-users'],
});
```

##### `hasPermissions`

Check if all the provided permissions are available for the current session.

###### Arguments

An array of permissions.

###### Returns

Returns `true` if all the provided permissions are available for the current session, `false` if otherwise.

###### Example

```javascript
permissionsService.hasPermissions([
  'view-users',
  'create-users',
  'edit-users',
]);
```

##### `canAccessRoute`

Check if the provided route can be accessed.

###### Arguments

A route's name.

###### Returns

Returns `true` if the provided route can be accessed, `false` if otherwise.

###### Example

```javascript
permissionsService.canAccessRoute('users.index');
```

##### `enableRouteValidation`

Tell the `permissions` service that it should start validating each transition and confirm that it's allowed based on the required permissions per route. If a transition is denied the [`route-access-denied`](#route-access-denied) event will be triggered.

###### Arguments

/

###### Returns

/

###### Example

```javascript
permissionsService.enableRouteValidation();
```

#### Events

##### `route-access-denied`

Triggered when a transition occurs that is denied.

###### Parameters

The denied transition.

###### Example

```javascript
const accessDeniedHandler = (/* deniedTransition */) => {
  routerService.replaceWith('error', { error: 'access-denied' });
};

permissionsService.on('route-access-denied', accessDeniedHandler);
```

--------------------------------------------------------------------------------

### Helpers

#### `has-permissions`

Check if all the provided permissions are available for the current session.

###### Arguments

Separate permissions.

###### Returns

Returns `true` if all the provided permissions are available for the current session, `false` if otherwise.

###### Example

```handlebars
{{has-permissions "view-users" "create-users" "edit-users"}}
```

#### `can-access-route`

Check if the provided route can be accessed.

###### Arguments

A route's name.

###### Returns

Returns `true` if the provided route can be accessed, `false` if otherwise.

###### Example

```handlebars
{{can-access-route "users.index"}}
```

## Contributing

See the [Contributing](./CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](./LICENSE.md).

## Maintenance

`@bagaar/ember-permissions` is built and maintained by [Bagaar](https://bagaar.be).
