import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import type PermissionsService from '../services/permissions.ts';
import type { Permissions } from '../services/permissions.ts';

export default class HasPermissionsHelper extends Helper {
  @service('permissions') declare permissionsService: PermissionsService;

  compute(permissions: Permissions) {
    return this.permissionsService.hasPermissions(permissions);
  }
}
