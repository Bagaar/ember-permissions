import type PermissionsService from '@bagaar/ember-permissions/services/permissions';
import type { Permissions } from '@bagaar/ember-permissions/services/permissions';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class HasSomePermissionsHelper extends Helper {
  @service('permissions') declare permissionsService: PermissionsService;

  compute(permissions: Permissions) {
    return this.permissionsService.hasSomePermissions(permissions);
  }
}
