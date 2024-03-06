import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { g, i } from 'decorator-transforms/runtime';

class CanAccessRouteHelper extends Helper {
  static {
    g(this.prototype, "permissionsService", [service('permissions')]);
  }
  #permissionsService = (i(this, "permissionsService"), void 0);
  compute([routeName]) {
    return this.permissionsService.canAccessRoute(routeName);
  }
}

export { CanAccessRouteHelper as default };
//# sourceMappingURL=can-access-route.js.map
