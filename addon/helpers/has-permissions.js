import { EVENTS } from '@bagaar/ember-permissions/config'
import Helper from '@ember/component/helper'
import { bind } from '@ember/runloop'
import { inject as service } from '@ember/service'

export default Helper.extend({
  /**
   * Services
   */

  permissionsService: service('permissions'),

  /**
   * Hooks
   */

  init () {
    this._super(...arguments)

    this.recompute = bind(this, this.recompute)

    this.permissionsService.on(EVENTS.PERMISSIONS_CHANGED, this.recompute)
  },

  willDestroy () {
    this._super(...arguments)

    this.permissionsService.off(EVENTS.PERMISSIONS_CHANGED, this.recompute)
  },

  compute (permissions) {
    return this.permissionsService.hasPermissions(permissions)
  }
})
