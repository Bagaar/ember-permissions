import { assert } from '@ember/debug';
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
    addListener(
      this.routerService,
      'routeWillChange',
      this,
      (transition) => {
        this.initialTransition = transition;
      },
      true
    );

    addListener(
      this.routerService,
      'routeDidChange',
      this,
      () => {
        this.initialTransition = null;
      },
      true
    );
  }

  hasPermissions(...args) {
    const permissions = Array.isArray(args[0]) ? args[0] : args;

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

    addListener(this.routerService, 'routeWillChange', this.validateTransition);
  }

  @action
  validateTransition(transition) {
    if (transition && this.canAccessRoute(transition.to.name) === false) {
      sendEvent(this, 'route-access-denied', [transition]);
    }
  }

  willDestroy() {
    if (this.isRouteValidationEnabled === true) {
      removeListener(
        this.routerService,
        'routeWillChange',
        this.validateTransition
      );
    }
  }
}
