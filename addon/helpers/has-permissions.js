import { EVENTS } from '@bagaar/ember-permissions/-private/config';
import Helper from '@ember/component/helper';
import { action } from '@ember/object';
import { addListener, removeListener } from '@ember/object/events';
import { inject as service } from '@ember/service';

export default class HasPermissionsHelper extends Helper {
  @service('permissions') permissionsService;

  constructor() {
    super(...arguments);

    addListener(
      this.permissionsService,
      EVENTS.PERMISSIONS_CHANGED,
      this.handlePermissionsChanged
    );
  }

  willDestroy() {
    removeListener(
      this.permissionsService,
      EVENTS.PERMISSIONS_CHANGED,
      this.handlePermissionsChanged
    );
  }

  compute(permissions) {
    return this.permissionsService.hasPermissions(permissions);
  }

  @action
  handlePermissionsChanged() {
    this.recompute();
  }
}
