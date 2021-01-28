import ApplicationInstance from '@ember/application/instance';
import PermissionsService from '@bagaar/ember-permissions/services/permissions';

export function initialize(applicationInstance: ApplicationInstance): void {
  const permissionsService: PermissionsService = applicationInstance.lookup(
    'service:permissions'
  );

  permissionsService.cacheInitialTransition();
}

export default {
  initialize,
};
