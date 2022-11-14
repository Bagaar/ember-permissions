import { assert, deprecate } from '@ember/debug';
import { action } from '@ember/object';
import { addListener, removeListener, sendEvent } from '@ember/object/events';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PermissionsService extends Service {
  @service('router') routerService;

  @tracked permissions = [];
  @tracked routePermissions = {};

  initialTransition = null;
  isRouteValidationEnabled = false;

  #routeAccessDeniedHandlers = new Set();

  on(name, target, handler) {
    deprecate(
      '`PermissionsService.on` is deprecated. Please use `PermissionsService.addRouteAccessDeniedHandler` instead.',
      false,
      {
        for: '@bagaar/ember-permissions',
        id: '@bagaar/ember-permissions.permissions-service-on-method',
        since: {
          available: '3.1.0',
          enabled: '3.1.0',
        },
        until: '4.0.0',
      }
    );

    addListener(this, name, target, handler);
  }

  one(name, target, handler) {
    deprecate(
      '`PermissionsService.one` is deprecated. Please use `PermissionsService.addRouteAccessDeniedHandler` instead.',
      false,
      {
        for: '@bagaar/ember-permissions',
        id: '@bagaar/ember-permissions.permissions-service-one-method',
        since: {
          available: '3.1.0',
          enabled: '3.1.0',
        },
        until: '4.0.0',
      }
    );

    addListener(this, name, target, handler, true);
  }

  off(name, target, handler) {
    deprecate(
      '`PermissionsService.off` is deprecated. Please use `PermissionsService.removeRouteAccessDeniedHandler` instead.',
      false,
      {
        for: '@bagaar/ember-permissions',
        id: '@bagaar/ember-permissions.permissions-service-off-method',
        since: {
          available: '3.1.0',
          enabled: '3.1.0',
        },
        until: '4.0.0',
      }
    );

    removeListener(this, name, target, handler);
  }

  trigger(name, ...args) {
    sendEvent(this, name, args);
  }

  addRouteAccessDeniedHandler(handler) {
    this.#routeAccessDeniedHandlers.add(handler);
  }

  removeRouteAccessDeniedHandler(handler) {
    this.#routeAccessDeniedHandlers.delete(handler);
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

  cacheInitialTransition() {
    this.routerService.one('routeWillChange', (transition) => {
      this.initialTransition = transition;
    });

    this.routerService.one('routeDidChange', () => {
      this.initialTransition = null;
    });
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

  enableRouteValidation() {
    if (this.isRouteValidationEnabled === true) {
      return;
    }

    this.isRouteValidationEnabled = true;

    this.validateTransition(this.initialTransition);

    this.routerService.on('routeWillChange', this.validateTransition);
  }

  @action
  validateTransition(transition) {
    const routeName = transition?.to?.name;

    if (routeName && this.canAccessRoute(routeName) === false) {
      this.trigger('route-access-denied', transition);

      this.#routeAccessDeniedHandlers.forEach((handler) => {
        handler(transition);
      });
    }
  }

  willDestroy() {
    if (this.isRouteValidationEnabled === true) {
      this.routerService.off('routeWillChange', this.validateTransition);
    }
  }
}
