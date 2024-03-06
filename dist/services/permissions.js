import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { g, i, n } from 'decorator-transforms/runtime';

class PermissionsService extends Service {
  static {
    g(this.prototype, "routerService", [service('router')]);
  }
  #routerService = (i(this, "routerService"), void 0);
  static {
    g(this.prototype, "permissions", [tracked], function () {
      return [];
    });
  }
  #permissions = (i(this, "permissions"), void 0);
  static {
    g(this.prototype, "routePermissions", [tracked], function () {
      return {};
    });
  }
  #routePermissions = (i(this, "routePermissions"), void 0);
  #isRouteValidationEnabled = false;
  #routeAccessDeniedHandlers = new Set();
  addRouteAccessDeniedHandler(handler) {
    this.#routeAccessDeniedHandlers.add(handler);
  }
  removeRouteAccessDeniedHandler(handler) {
    this.#routeAccessDeniedHandlers.delete(handler);
  }
  setPermissions(permissions) {
    assert('`permissions` is required and should be an array.', permissions && Array.isArray(permissions));
    this.permissions = permissions;
  }
  setRoutePermissions(routePermissions) {
    assert('`routePermissions` is required and should be an object.', routePermissions && typeof routePermissions === 'object');
    this.routePermissions = routePermissions;
  }
  hasPermissions(permissions) {
    assert('`permissions` is required and should be an array.', permissions && Array.isArray(permissions));
    return permissions.every(permission => {
      return this.permissions.includes(permission);
    });
  }
  hasSomePermissions(permissions) {
    assert('`permissions` is required and should be an array.', permissions && Array.isArray(permissions));
    return permissions.some(permission => {
      return this.permissions.includes(permission);
    });
  }
  canAccessRoute(routeName) {
    assert('`routeName` is required and should be a string.', routeName && typeof routeName === 'string');
    const routeNameSegments = routeName.split('.');
    for (let index = 0; index < routeNameSegments.length; index++) {
      const permissionsOrHandler = this.routePermissions[routeNameSegments.slice(0, index + 1).join('.')];
      if (Array.isArray(permissionsOrHandler) && this.hasPermissions(permissionsOrHandler) === false) {
        return false;
      } else if (typeof permissionsOrHandler === 'function' && permissionsOrHandler(this) === false) {
        return false;
      }
    }
    return true;
  }
  enableRouteValidation(initialTransition) {
    if (this.#isRouteValidationEnabled === true) {
      return;
    }
    this.#isRouteValidationEnabled = true;
    if (initialTransition) {
      this.validateTransition(initialTransition);
    }
    this.routerService.on('routeWillChange', this.validateTransition);
  }
  validateTransition(transition) {
    const routeName = transition?.to?.name;
    if (routeName && this.canAccessRoute(routeName) === false) {
      this.#routeAccessDeniedHandlers.forEach(handler => handler(transition));
    }
  }
  static {
    n(this.prototype, "validateTransition", [action]);
  }
  willDestroy() {
    if (this.#isRouteValidationEnabled === true) {
      this.routerService.off('routeWillChange', this.validateTransition);
    }
  }
}

export { PermissionsService as default };
//# sourceMappingURL=permissions.js.map
