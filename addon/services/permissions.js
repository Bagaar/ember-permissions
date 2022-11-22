import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PermissionsService extends Service {
  @service('router') routerService;

  @tracked permissions = [];
  @tracked routePermissions = {};

  #eventHandlers = {
    'route-access-denied': new Set(),
  };

  #isRouteValidationEnabled = false;

  on(eventName, eventHandler) {
    this.#eventHandlers[eventName].add(eventHandler);
  }

  off(eventName, eventHandler) {
    this.#eventHandlers[eventName].delete(eventHandler);
  }

  trigger(eventName, args) {
    this.#eventHandlers[eventName].forEach((eventHandler) => {
      eventHandler(...args);
    });
  }

  setPermissions(permissions) {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions)
    );

    this.permissions = permissions;
  }

  setRoutePermissions(routePermissions) {
    assert(
      '`routePermissions` is required and should be an object.',
      routePermissions && typeof routePermissions === 'object'
    );

    this.routePermissions = routePermissions;
  }

  hasPermissions(permissions) {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions)
    );

    return permissions.every((permission) => {
      return this.permissions.includes(permission);
    });
  }

  canAccessRoute(routeName) {
    assert(
      '`routeName` is required and should be a string.',
      routeName && typeof routeName === 'string'
    );

    const routeTreePermissions = this.getRouteTreePermissions(routeName);

    return this.hasPermissions(routeTreePermissions);
  }

  getRouteTreePermissions(routeName) {
    const routeNameSplitted = routeName.split('.');
    const routeTreePermissions = [];

    for (let index = 0; index < routeNameSplitted.length; index++) {
      const routeNameJoined = routeNameSplitted.slice(0, index + 1).join('.');
      const routePermissions = this.routePermissions[routeNameJoined];

      if (routePermissions) {
        routeTreePermissions.push(...routePermissions);
      }
    }

    return routeTreePermissions;
  }

  enableRouteValidation(initialTransition) {
    if (this.#isRouteValidationEnabled === true) {
      return;
    }

    this.#isRouteValidationEnabled = true;

    this.validateTransition(initialTransition);

    this.routerService.on('routeWillChange', this.validateTransition);
  }

  @action
  validateTransition(transition) {
    const routeName = transition?.to?.name;

    if (routeName && this.canAccessRoute(routeName) === false) {
      this.trigger('route-access-denied', [transition]);
    }
  }

  willDestroy() {
    if (this.#isRouteValidationEnabled === true) {
      this.routerService.off('routeWillChange', this.validateTransition);
    }
  }
}
