// helpers
import type CanAccessRoute from '@bagaar/ember-permissions/helpers/can-access-route';
import type HasPermissions from '@bagaar/ember-permissions/helpers/has-permissions';
import type HasSomePermissions from '@bagaar/ember-permissions/helpers/has-some-permissions';

export default interface BagaarEmberPermissionsRegistry {
  // helpers
  'can-access-route': typeof CanAccessRoute;
  'has-permissions': typeof HasPermissions;
  'has-some-permissions': typeof HasSomePermissions;
}
