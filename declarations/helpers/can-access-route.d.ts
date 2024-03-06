/// <reference types="ember-source/types/stable/@ember/component/helper" />
import Helper from '@ember/component/helper';
import type PermissionsService from '../services/permissions.ts';
export default class CanAccessRouteHelper extends Helper {
    permissionsService: PermissionsService;
    compute([routeName]: [string]): boolean;
}
//# sourceMappingURL=can-access-route.d.ts.map