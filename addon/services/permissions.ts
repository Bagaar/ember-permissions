import { assert } from '@ember/debug';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export type CanAccessRouteHandler = (service: PermissionsService) => boolean;
export type Permission = string;
export type Permissions = Permission[];
export type RouteName = string;
export type Transition = ReturnType<RouterService['transitionTo']>;

type RouteAccessDeniedHandler = (deniedTransition: Transition) => void;
type RoutePermissions = {
  [routeName: RouteName]: Permissions | CanAccessRouteHandler;
};

export default class PermissionsService extends Service {
  @service('router') declare routerService: RouterService;

  @tracked permissions: Permissions = [];
  @tracked routePermissions: RoutePermissions = {};

  #isRouteValidationEnabled = false;
  #routeAccessDeniedHandlers = new Set<RouteAccessDeniedHandler>();

  addRouteAccessDeniedHandler(handler: RouteAccessDeniedHandler) {
    this.#routeAccessDeniedHandlers.add(handler);
  }

  removeRouteAccessDeniedHandler(handler: RouteAccessDeniedHandler) {
    this.#routeAccessDeniedHandlers.delete(handler);
  }

  setPermissions(permissions: Permissions): void {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions),
    );

    this.permissions = permissions;
  }

  setRoutePermissions(routePermissions: RoutePermissions): void {
    assert(
      '`routePermissions` is required and should be an object.',
      routePermissions && typeof routePermissions === 'object',
    );

    this.routePermissions = routePermissions;
  }

  hasPermissions(permissions: Permissions): boolean {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions),
    );

    return permissions.every((permission) => {
      return this.permissions.includes(permission);
    });
  }

  hasSomePermissions(permissions: Permissions): boolean {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions),
    );

    return permissions.some((permission) => {
      return this.permissions.includes(permission);
    });
  }

  canAccessRoute(routeName: RouteName): boolean {
    assert(
      '`routeName` is required and should be a string.',
      routeName && typeof routeName === 'string',
    );

    const routeNameSegments = routeName.split('.');

    for (let index = 0; index < routeNameSegments.length; index++) {
      const permissionsOrHandler =
        this.routePermissions[routeNameSegments.slice(0, index + 1).join('.')];

      if (
        Array.isArray(permissionsOrHandler) &&
        this.hasPermissions(permissionsOrHandler) === false
      ) {
        return false;
      } else if (
        typeof permissionsOrHandler === 'function' &&
        permissionsOrHandler(this) === false
      ) {
        return false;
      }
    }

    return true;
  }

  enableRouteValidation(initialTransition?: Transition): void {
    if (this.#isRouteValidationEnabled === true) {
      return;
    }

    this.#isRouteValidationEnabled = true;

    if (initialTransition) {
      this.validateTransition(initialTransition);
    }

    this.routerService.on('routeWillChange', this.validateTransition);
  }

  @action
  validateTransition(transition: Transition): void {
    const routeName = transition?.to?.name;

    if (routeName && this.canAccessRoute(routeName) === false) {
      this.#routeAccessDeniedHandlers.forEach((handler) => handler(transition));
    }
  }

  willDestroy(): void {
    if (this.#isRouteValidationEnabled === true) {
      this.routerService.off('routeWillChange', this.validateTransition);
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    permissions: PermissionsService;
  }
}
