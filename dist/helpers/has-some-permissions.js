import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { g, i } from 'decorator-transforms/runtime';

class HasSomePermissionsHelper extends Helper {
  static {
    g(this.prototype, "permissionsService", [service('permissions')]);
  }
  #permissionsService = (i(this, "permissionsService"), void 0);
  compute(permissions) {
    return this.permissionsService.hasSomePermissions(permissions);
  }
}

export { HasSomePermissionsHelper as default };
//# sourceMappingURL=has-some-permissions.js.map
