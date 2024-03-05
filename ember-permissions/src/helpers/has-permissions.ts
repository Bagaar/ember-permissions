import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import type PermissionsService from '../services/permissions';
import type { Permissions } from '../services/permissions';

export default class HasPermissionsHelper extends Helper {
  @service('permissions') declare permissionsService: PermissionsService;

  compute(permissions: Permissions) {
    return this.permissionsService.hasPermissions(permissions);
  }
}
