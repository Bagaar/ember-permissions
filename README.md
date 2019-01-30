# Bagaar Ember Permissions

![Bagaar Logo](https://bagaar.be/hubfs/logo-bagaar-black.svg)

**`@bagaar/ember-permissions` is built and maintained by [Bagaar](http://bagaar.be).**

[![Build Status](https://travis-ci.org/Bagaar/ember-permissions.svg?branch=master)](https://travis-ci.org/Bagaar/ember-permissions) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Permission management for Ember applications.

## Installation

```shell
ember install @bagaar/ember-permissions
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

### 2\. Checking Permissions

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

### 3\. Setting Route Permissions for the Current Session

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

### 4\. Checking Route Permissions

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
