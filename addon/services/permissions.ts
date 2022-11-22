import { assert } from '@ember/debug';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export type Permission = string;
export type Permissions = Permission[];
export type RouteName = string;
export type Transition = ReturnType<RouterService['transitionTo']>;

type EventName = 'route-access-denied';
type EventHandler = Function; // eslint-disable-line @typescript-eslint/ban-types
type EventHandlerArgs = unknown[];
type EventHandlers = { [key in EventName]: Set<EventHandler> };
type RoutePermissions = { [routeName: RouteName]: Permissions };

export default class PermissionsService extends Service {
  @service('router') declare routerService: RouterService;

  @tracked permissions: Permissions = [];
  @tracked routePermissions: RoutePermissions = {};

  #eventHandlers: EventHandlers = {
    'route-access-denied': new Set(),
  };

  #isRouteValidationEnabled = false;

  on(eventName: EventName, eventHandler: EventHandler): void {
    this.#eventHandlers[eventName].add(eventHandler);
  }

  off(eventName: EventName, eventHandler: EventHandler): void {
    this.#eventHandlers[eventName].delete(eventHandler);
  }

  trigger(eventName: EventName, args: EventHandlerArgs): void {
    this.#eventHandlers[eventName].forEach((eventHandler) => {
      eventHandler(...args);
    });
  }

  setPermissions(permissions: Permissions): void {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions)
    );

    this.permissions = permissions;
  }

  setRoutePermissions(routePermissions: RoutePermissions): void {
    assert(
      '`routePermissions` is required and should be an object.',
      routePermissions && typeof routePermissions === 'object'
    );

    this.routePermissions = routePermissions;
  }

  hasPermissions(permissions: Permissions): boolean {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions)
    );

    return permissions.every((permission) => {
      return this.permissions.includes(permission);
    });
  }

  canAccessRoute(routeName: RouteName): boolean {
    assert(
      '`routeName` is required and should be a string.',
      routeName && typeof routeName === 'string'
    );

    const routeTreePermissions = this.getRouteTreePermissions(routeName);

    return this.hasPermissions(routeTreePermissions);
  }

  getRouteTreePermissions(routeName: RouteName): Permissions {
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
      this.trigger('route-access-denied', [transition]);
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
