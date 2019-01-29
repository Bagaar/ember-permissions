import Helper from '@ember/component/helper';
import { bind } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Helper.extend({
  /**
   * Services
   */

  permissionsService: service('permissions'),

  /**
   * Hooks
   */

  init() {
    this._super(...arguments);

    this.recompute = bind(this, this.recompute);

    this.permissionsService.on('permissions-changed', this.recompute);
    this.permissionsService.on('route-permissions-changed', this.recompute);
  },

  willDestroy() {
    this._super(...arguments);

    this.permissionsService.off('permissions-changed', this.recompute);
    this.permissionsService.off('route-permissions-changed', this.recompute);
  },

  compute([routeName]) {
    return this.permissionsService.canAccessRoute(routeName);
  },
});
