/// <reference types="ember-source/types/stable/@ember/component/helper" />
import Helper from '@ember/component/helper';
import type PermissionsService from '../services/permissions.ts';
import type { Permissions } from '../services/permissions.ts';
export default class HasPermissionsHelper extends Helper {
    permissionsService: PermissionsService;
    compute(permissions: Permissions): boolean;
}
//# sourceMappingURL=has-permissions.d.ts.map