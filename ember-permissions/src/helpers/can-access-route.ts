import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import type PermissionsService from '../services/permissions';

export default class CanAccessRouteHelper extends Helper {
  @service('permissions') declare permissionsService: PermissionsService;

  compute([routeName]: [string]) {
    return this.permissionsService.canAccessRoute(routeName);
  }
}
