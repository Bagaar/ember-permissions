import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import type PermissionsService from '../services/permissions';
import type { Permissions } from '../services/permissions';

export default class HasSomePermissionsHelper extends Helper {
  @service('permissions') declare permissionsService: PermissionsService;

  compute(permissions: Permissions) {
    return this.permissionsService.hasSomePermissions(permissions);
  }
}
