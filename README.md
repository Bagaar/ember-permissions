# Bagaar Ember Permissions

![Bagaar Logo](https://bagaar.be/hubfs/logo-bagaar-black.svg)

**`@bagaar/ember-permissions` is built and maintained by [Bagaar](http://bagaar.be).**

[![Build Status](https://travis-ci.org/Bagaar/ember-permissions.svg?branch=master)](https://travis-ci.org/Bagaar/ember-permissions) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Permission management for Ember applications.

## Table of Contents

- [Introduction](#introduction)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
- [Public API](#public-api)
- [License](#license)

## Introduction

`@bagaar/ember-permissions` is an addon that allows you to manage and check permissions for the current session. It also allows you to define required permissions per route so you can protect specific parts of your application. Instead of using a mixin to protect your routes, the addon allows you to define the required permissions per route in a single file. Whenever a transition occurs that is not allowed, a specific event is triggered so you can decide how to handle the denied transition.

## Support

**`@bagaar/ember-permissions` supports Ember v3.6 and up.** The reason for this is because Ember's new [router service](https://emberjs.com/api/ember/3.6/classes/RouterService) is being used. More specifically, the new `routeWillChange` and `routeDidChange` events.

## Installation

```shell
ember install @bagaar/ember-permissions
```

## Public API

### `permissions` Service

#### Methods

##### 1\. `setPermissions`

Allows you to set the permissions for the current session.

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
]);
```

##### 2\. `setRoutePermissions`

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
});
```

##### 3\. `hasPermissions`

Checks if all the provided permissions are available for the current session.

###### Arguments

Separate permissions OR an array of permissions.

###### Returns

Returns `true` if all the provided permissions are available for the current session, `false` if otherwise.

###### Example

```javascript
// As separate permissions.
permissionsService.hasPermissions(
  'view-users',
  'create-users',
  'edit-users'
);

// As an array of permissions.
permissionsService.hasPermissions([
  'view-users',
  'create-users',
  'edit-users'
]);
```

##### 4\. `canAccessRoute`

Checks if the provided route can be accessed.

###### Arguments

A route's name.

###### Returns

Returns `true` if the provided route can be accessed, `false` if otherwise.

###### Example

```javascript
permissionsService.canAccessRoute('users.index');
```

##### 4\. `startWatchingTransitions`

Allows you to manually start watching transitions. "Watching transitions" means that the service will check each transition and see if it's allowed based on the required permissions per route. If a transition is not allowed the `route-access-denied` event will be triggered.

###### Arguments

/

###### Returns

/

###### Example

```javascript
permissionsService.startWatchingTransitions();
```

#### Events

##### 1\. `route-access-denied`

Triggered when a transition occurs that is not allowed.

###### Parameters

The denied transition.

###### Example

```javascript
permissionsService.on('route-access-denied', ( /* deniedTransition */ ) => {
  routerService.replaceWith('error', { error: 'access-denied' });
});
```

--------------------------------------------------------------------------------

### Helpers

#### 1\. `has-permissions`

Checks if all the provided permissions are available for the current session.

###### Arguments

Separate permissions.

###### Returns

Returns `true` if all the provided permissions are available for the current session, `false` if otherwise.

###### Example

```handlebars
{{has-permissions "view-users" "create-users" "edit-users"}}
```

#### 2\. `can-access-route`

Checks if the provided route can be accessed.

###### Arguments

A route's name.

###### Returns

Returns `true` if the provided route can be accessed, `false` if otherwise.

###### Example

```handlebars
{{can-access-route "users.index"}}
```

## Usage

### 1\. Setting and Checking Permissions for the Current Session

First, we need to let the `permissions` service know which permissions are available for the current session. In the example below, we're using an additional service to request the permissions from a server API. Afterwards, we pass along the permissions to the `permissions` service via the `setPermissions` method.

```javascript
// app/routes/application.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  apiService: service('api'),
  permissionsService: service('permissions'),

  async beforeModel() {
    let permissions = await this.apiService.request('/permissions');

    this.permissionsService.setPermissions(permissions);
  }
});
```

Once the permissions are set, we can start checking their presence. In the example below, we use the `has-permissions` helper to conditionally render a button based on the presence of a specific permission.

```handlebars
{{! app/templates/users/index.hbs }}

{{#if (has-permissions "delete-users")}}
  <button onclick={{action deleteUser userRecord}} type="button">
    Delete User
  </button>
{{/if}}
```

> **NOTE:** If you need to check permissions inside a JavaScript file, you can use the `hasPermissions` method on the `permissions` service instead.

### 2\. Setting the Required Permissions per Route, Watching Transitions and Checking Route Access

Start of with defining the required permissions per route. You're free to define them where you want, as long as the format is the same as shown below.

```javascript
// app/route-permissions.js

export default {
  'users.index': ['view-users'],
  'users.create': ['create-users'],
  'users.edit': ['edit-users']
};
```

Next, extend the `application` route from step 1:

1. Use the `setRoutePermissions` method to pass along the required permissions per route to the `permissions` service.
2. Handle the `route-access-denied` event to determine what to do when a transition is denied.
3. Call `startWatchingTransitions` to manually start watching transitions.

```javascript
// app/routes/application.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import routePermissions from 'app-name/route-permissions';

export default Route.extend({
  apiService: service('api'),
  permissionsService: service('permissions'),

  async beforeModel() {
    let permissions = await this.apiService.request('/permissions');

    this.permissionsService.setPermissions(permissions);
    this.permissionsService.setRoutePermissions(routePermissions);

    this.permissionsService.on('route-access-denied', () => {
      this.replaceWith('error', { error: 'route-access-denied' });
    });

    this.permissionsService.startWatchingTransitions();
  }
});
```

Now each transition will be checked to see if it's allowed based on the required permissions per route. If a transition is not allowed the `route-access-denied` event will be triggered.

Since the required permissions per route are set as well, we can start checking if routes can be accessed. In the example below, we use the `can-access-route` helper to do so.

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

> **NOTE:** If you need to check if a route can be accessed inside a JavaScript file, you can use the `canAccessRoute` method on the `permissions` service instead.

## License

This project is licensed under the [MIT License](./LICENSE.md).
