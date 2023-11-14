import type PermissionsService from '@bagaar/ember-permissions/services/permissions';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class CanAccessRouteHelper extends Helper {
  @service('permissions') declare permissionsService: PermissionsService;

  compute([routeName]: [string]) {
    return this.permissionsService.canAccessRoute(routeName);
  }
}
