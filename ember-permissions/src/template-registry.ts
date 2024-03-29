// helpers
import type CanAccessRoute from './helpers/can-access-route.ts';
import type HasPermissions from './helpers/has-permissions.ts';
import type HasSomePermissions from './helpers/has-some-permissions.ts';

export default interface EmberPermissionsRegistry {
  // helpers
  'can-access-route': typeof CanAccessRoute;
  'has-permissions': typeof HasPermissions;
  'has-some-permissions': typeof HasSomePermissions;
}
