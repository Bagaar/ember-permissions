# Bagaar Ember Permissions

![Bagaar Logo](https://bagaar.be/hubfs/logo-bagaar-black.svg)

**`@bagaar/ember-permissions` is built and maintained by [Bagaar](https://bagaar.be).**

[![NPM Version](https://badge.fury.io/js/%40bagaar%2Fember-permissions.svg)](https://badge.fury.io/js/%40bagaar%2Fember-permissions) [![Build Status](https://travis-ci.com/Bagaar/ember-permissions.svg?branch=master)](https://travis-ci.com/Bagaar/ember-permissions) [![Ember Observer Score](https://emberobserver.com/badges/-bagaar-ember-permissions.svg)](https://emberobserver.com/addons/@bagaar/ember-permissions) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Permission management for Ember applications.

## Table of Contents

- [Introduction](#introduction)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
- [Public API](#public-api)
- [Contributing](#contributing)
- [License](#license)

## Introduction

`@bagaar/ember-permissions` is an addon that allows you to **manage and validate permissions** for the current user session. It also allows you to **define required permissions per route** so you can protect specific parts of your application. Instead of using a mixin to protect your routes, the addon allows you to define the required permissions per route in a single file. Whenever a transition occurs that is not allowed, a specific event is triggered so you can decide how to handle the denied transition.

## Support

**`@bagaar/ember-permissions` supports Ember v3.12 and up.**

## Installation

```shell
ember install @bagaar/ember-permissions
```

## Usage

### 1\. Setting up User Session Permissions

First, we need to let the `permissions` service know which permissions are available for the current user session. In the example below, we're using an additional service to request the permissions from a server API. Afterwards, we pass along the permissions to the `permissions` service via the [`setPermissions`](#setpermissions) method.

```javascript
// app/routes/application.js

import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default class ApplicationRoute extends Route {
  @service('api') apiService
  @service('permissions') permissionsService
  
  async beforeModel () {
    const permissions = await this.apiService.request('/permissions')
    
    this.permissionsService.setPermissions(permissions)
  }
}
```

Once the permissions are set, we can start checking their presence. In the example below, we use the [`has-permissions`](#has-permissions) helper to conditionally render a button based on the presence of a specific permission.

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
  'users.edit': ['edit-users']
}
```

Next, edit the `application` route from step 1 as follows:

1. Use the [`setRoutePermissions`](#setroutepermissions) method to pass along the required permissions per route to the `permissions` service.
2. Handle the [`route-access-denied`](#route-access-denied) event to determine what to do when a transition is denied.
3. Call [`enableRouteValidation`](#enableroutevalidation).

```javascript
// app/routes/application.js

import { addListener } from '@ember/object/events'
import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import routePermissions from 'app-name/route-permissions'

export default class ApplicationRoute extends Route {
  @service('api') apiService
  @service('permissions') permissionsService
  
  async beforeModel () {
    const permissions = await this.apiService.request('/permissions')
    
    this.permissionsService.setPermissions(permissions)
    this.permissionsService.setRoutePermissions(routePermissions)
    
    addListener(this.permissionsService, 'route-access-denied', () => {
      // Handle the 'route-access-denied' event.
      // E.g. redirect to a generic error route.
      this.transitionTo('error', { error: 'route-access-denied' })
    })

    this.permissionsService.enableRouteValidation()
  }
}
```

Now each transition will be validated based on the required permissions per route. If a transition is not allowed the [`route-access-denied`](#route-access-denied) event will be triggered.

Since the required permissions per route are now set, we can start checking if routes can be accessed. In the example below, we use the [`can-access-route`](#can-access-route) helper to do so.

```handlebars
{{! app/templates/components/menu.hbs }}

{{#if (can-access-route "users.index")}}
  <li>
    {{#link-to "users.index"}}
      Users
    {{/link-to}}
  </li>
{{/if}}
```

> **NOTE:** If you need to validate if a route can be accessed inside a JavaScript file, you can use the [`canAccessRoute`](#canaccessroute) method on the `permissions` service instead.

## Public API

### Permissions Service

#### Methods

##### setPermissions

Allows you to set the permissions for the current user session.

###### Arguments

An array of permissions.

###### Returns

/

###### Example

```javascript
permissionsService.setPermissions([
  'view-users',
  'create-users',
  'edit-users'
])
```

##### setRoutePermissions

Allows you to set the required permissions per route.

###### Arguments

An object of which the keys are route names and the values are arrays of required permissions.

###### Returns

/

###### Example

```javascript
permissionsService.setRoutePermissions({
  'users.index': ['view-users'],
  'users.create': ['create-users'],
  'users.edit': ['edit-users']
})
```

##### hasPermissions

Checks if all the provided permissions are available for the current user session.

###### Arguments

Separate permissions OR an array of permissions.

###### Returns

Returns `true` if all the provided permissions are available for the current user session, `false` if otherwise.

###### Example

```javascript
// As separate permissions.
permissionsService.hasPermissions(
  'view-users',
  'create-users',
  'edit-users'
)

// As an array of permissions.
permissionsService.hasPermissions([
  'view-users',
  'create-users',
  'edit-users'
])
```

##### canAccessRoute

Checks if the provided route can be accessed.

###### Arguments

A route's name.

###### Returns

Returns `true` if the provided route can be accessed, `false` if otherwise.

###### Example

```javascript
permissionsService.canAccessRoute('users.index')
```

##### enableRouteValidation

This will tell the service that it should start validating each transition and confirm that it's allowed based on the required permissions per route. If a transition is not allowed the [`route-access-denied`](#route-access-denied) event will be triggered.

###### Arguments

/

###### Returns

/

###### Example

```javascript
permissionsService.enableRouteValidation()
```

#### Events

##### route-access-denied

Triggered when a transition occurs that is not allowed.

###### Parameters

The denied transition.

###### Example

```javascript
addListener(permissionsService, 'route-access-denied', ( /* deniedTransition */ ) => {
  // Handle the 'route-access-denied' event.
  // E.g. redirect to a generic error route.
  routerService.transitionTo('error', { error: 'route-access-denied' })
})
```

--------------------------------------------------------------------------------

### Helpers

#### has-permissions

Checks if all the provided permissions are available for the current user session.

###### Arguments

Separate permissions.

###### Returns

Returns `true` if all the provided permissions are available for the current user session, `false` if otherwise.

###### Example

```handlebars
{{has-permissions "view-users" "create-users" "edit-users"}}
```

#### can-access-route

Checks if the provided route can be accessed.

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
