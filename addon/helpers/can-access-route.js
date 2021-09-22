import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class CanAccessRouteHelper extends Helper {
  @service('permissions') permissionsService;

  compute([routeName]) {
    return this.permissionsService.canAccessRoute(routeName);
  }
}
