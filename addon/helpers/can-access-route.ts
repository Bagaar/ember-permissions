import type PermissionsService from '@bagaar/ember-permissions/services/permissions';
import type { RouteName } from '@bagaar/ember-permissions/services/permissions';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class CanAccessRouteHelper extends Helper {
  @service('permissions') declare permissionsService: PermissionsService;

  compute([routeName]: [RouteName]) {
    return this.permissionsService.canAccessRoute(routeName);
  }
}
