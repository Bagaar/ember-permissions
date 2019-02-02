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
setPermissions([
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
setRoutePermissions({
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
hasPermissions('view-users', 'create-users', 'edit-users');

// OR

hasPermissions(['view-users', 'create-users', 'edit-users']);
```

##### 4\. `canAccessRoute`

Checks if the provided route can be accessed.

###### Arguments

A route's name.

###### Returns

Returns `true` if the provided route can be accessed, `false` if otherwise.

###### Example

```javascript
canAccessRoute('users.index');
```

##### 4\. `startWatchingTransitions`

Allows you to manually start watching transitions. "Watching transitions" means that the service will check each transition and see if it's allowed based on the required permissions per route. If a transition is not allowed the `route-access-denied` event will be triggered.

###### Arguments

/

###### Returns

/

###### Example

```javascript
startWatchingTransitions();
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

### 1\. Setting Permissions for the Current Session

```javascript
// app/routes/application.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  apiService: service('api'),
  permissionsService: service('permissions'),

  async beforeModel() {
    let permissions = await this.apiService.request('permissions');

    this.permissionsService.setPermissions(permissions);
  }
});
```

### 2\. Checking Permissions for the Current Session

#### Via the `permissions` Service

```javascript
// app/controllers/users/index.js

import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  permissionsService: service('permissions'),

  showDeleteUserButton: computed(function () {
    return this.permissionsService.hasPermissions('delete-users');
  })
});
```

#### Via the `has-permissions` Helper

```handlebars
{{! app/templates/users/index.hbs }}

{{#if (has-permissions "delete-users")}}
  <button onclick={{action deleteUser userRecord}} type="button">
    Delete User
  </button>
{{/if}}
```

### 3\. Setting the Required Permissions per Route

```javascript
// app/route-permissions.js

export default {
  'users.index': ['view-users'],
  'users.create': ['create-users'],
  'users.edit': ['edit-users']
};
```

```javascript
// app/instance-initializers/route-permissions.js

import routePermissions from 'app-name/route-permissions';

export function initialize(applicationInstance) {
  let permissionsService = applicationInstance.lookup('service:permissions');

  permissionsService.setRoutePermissions(routePermissions);
}

export default {
  initialize
};
```

### 4\. Checking If a Route Can Be Accessed

#### Via the `permissions` Service

```javascript
// app/routes/users/index.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  permissionsService: service('permissions'),

  beforeModel() {
    if (!this.permissionsService.canAccessRoute(this.routeName)) {
      this.replaceWith('error', { error: 'route-access-denied' });
    }
  }
});
```

#### Via the `can-access-route` Helper

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

### 5\. Watching Transitions and Handling the `route-access-denied` Event

```javascript
// app/route-permissions.js

export default {
  'users.index': ['view-users'],
  'users.create': ['create-users'],
  'users.edit': ['edit-users']
};
```

```javascript
// app/instance-initializers/route-permissions.js

import routePermissions from 'app-name/route-permissions';

export function initialize(applicationInstance) {
  let permissionsService = applicationInstance.lookup('service:permissions');
  let routerService = applicationInstance.lookup('service:router');

  permissionsService.setRoutePermissions(routePermissions);
  permissionsService.on('route-access-denied', () => {
    routerService.replaceWith('error', { error: 'route-access-denied' });
  });
}

export default {
  initialize
};
```

```javascript
// app/routes/application.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  apiService: service('api'),
  permissionsService: service('permissions'),

  async beforeModel() {
    let permissions = await this.apiService.request('permissions');

    this.permissionsService.setPermissions(permissions);
    this.permissionsService.startWatchingTransitions();
  }
});
```

## License

This project is licensed under the [MIT License](./LICENSE.md).
