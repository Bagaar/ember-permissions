import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class HasPermissionsHelper extends Helper {
  @service('permissions') permissionsService;

  compute(permissions) {
    return this.permissionsService.hasPermissions(permissions);
  }
}
