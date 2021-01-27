import { EVENTS } from '@bagaar/ember-permissions/-private/config';
import { assert } from '@ember/debug';
import { sendEvent } from '@ember/object/events';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import Service, { inject as service } from '@ember/service';

type Permission = string;
type UserPermissions = Permission[];
interface RoutePermissions {
  [routeName: string]: Permission[];
}

export default class PermissionsService extends Service {
  @service('router') declare routerService: RouterService;

  initialTransition: Transition | null = null;
  isRouteValidationEnabled = false;
  permissions: UserPermissions = [];
  routePermissions: RoutePermissions = {};

  setPermissions(permissions: UserPermissions): void {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions)
    );

    this.permissions = permissions;

    sendEvent(this, EVENTS.PERMISSIONS_CHANGED);
  }

  setRoutePermissions(routePermissions: RoutePermissions): void {
    assert(
      '`routePermissions` is required and should be an object.',
      routePermissions && typeof routePermissions === 'object'
    );

    this.routePermissions = routePermissions;

    sendEvent(this, EVENTS.ROUTE_PERMISSIONS_CHANGED);
  }

  cacheInitialTransition(): void {
    this.routerService.on('routeWillChange', (transition: Transition) => {
      this.initialTransition = transition;
    });

    this.routerService.on('routeDidChange', () => {
      this.initialTransition = null;
    });
  }

  hasPermissions(permissions: Permission[]): boolean;
  hasPermissions(...permissions: Permission[]): boolean;
  hasPermissions(...args: Permission[] | [Permission[]]): boolean {
    const permissions = (Array.isArray(args[0])
      ? args[0]
      : args) as Permission[];

    return permissions.every((permission) => {
      return this.permissions.includes(permission);
    });
  }

  canAccessRoute(routeName: string): boolean {
    assert(
      '`routeName` is required and should be a string.',
      routeName && typeof routeName === 'string'
    );

    const routeTreePermissions = this.getRouteTreePermissions(routeName);

    return this.hasPermissions(routeTreePermissions);
  }

  getRouteTreePermissions(routeName: string): Permission[] {
    const routeNameSplitted = routeName.split('.');
    const routeTreePermissions: Permission[] = [];

    for (let index = 0; index < routeNameSplitted.length; index++) {
      const routeNameJoined = routeNameSplitted.slice(0, index + 1).join('.');
      const routePermissions = this.routePermissions[routeNameJoined];

      if (routePermissions) {
        routeTreePermissions.push(...routePermissions);
      }
    }

    return routeTreePermissions;
  }

  enableRouteValidation(): void {
    if (this.isRouteValidationEnabled) {
      return;
    }

    this.isRouteValidationEnabled = true;

    // Validate the initial transition if `enableRouteValidation` was called during it.
    if (
      this.initialTransition &&
      !this.canAccessRoute(this.initialTransition.to.name)
    ) {
      sendEvent(this, 'route-access-denied', [this.initialTransition]);
    }

    this.routerService.on('routeWillChange', (transition: Transition) => {
      if (transition.to && !this.canAccessRoute(transition.to.name)) {
        sendEvent(this, 'route-access-denied', [transition]);
      }
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    permissions: PermissionsService;
  }
}
