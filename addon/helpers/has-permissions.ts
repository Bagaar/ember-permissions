/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EVENTS } from '@bagaar/ember-permissions/-private/config';
import PermissionsService from '@bagaar/ember-permissions/services/permissions';
import Helper from '@ember/component/helper';
import { action } from '@ember/object';
import { addListener, removeListener } from '@ember/object/events';
import { inject as service } from '@ember/service';

export default class HasPermissionsHelper extends Helper {
  @service('permissions') declare permissionsService: PermissionsService;

  constructor(owner: unknown) {
    // @ts-ignore
    super(owner);

    addListener(
      this.permissionsService,
      // @ts-ignore
      EVENTS.PERMISSIONS_CHANGED,
      this.handlePermissionsChanged
    );
  }

  willDestroy(): void {
    removeListener(
      this.permissionsService,
      // @ts-ignore
      EVENTS.PERMISSIONS_CHANGED,
      this.handlePermissionsChanged
    );
  }

  compute(permissions: string[]): boolean {
    return this.permissionsService.hasPermissions(permissions);
  }

  @action
  handlePermissionsChanged(): void {
    this.recompute();
  }
}
