import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { g, i } from 'decorator-transforms/runtime';

class HasPermissionsHelper extends Helper {
  static {
    g(this.prototype, "permissionsService", [service('permissions')]);
  }
  #permissionsService = (i(this, "permissionsService"), void 0);
  compute(permissions) {
    return this.permissionsService.hasPermissions(permissions);
  }
}

export { HasPermissionsHelper as default };
//# sourceMappingURL=has-permissions.js.map
