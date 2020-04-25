import { EVENTS } from '@bagaar/ember-permissions/config'
import Helper from '@ember/component/helper'
import { addListener, removeListener } from '@ember/object/events'
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

    addListener(
      this.permissionsService,
      EVENTS.PERMISSIONS_CHANGED,
      this.recompute
    )

    addListener(
      this.permissionsService,
      EVENTS.ROUTE_PERMISSIONS_CHANGED,
      this.recompute
    )
  },

  willDestroy () {
    this._super(...arguments)

    removeListener(
      this.permissionsService,
      EVENTS.PERMISSIONS_CHANGED,
      this.recompute
    )

    removeListener(
      this.permissionsService,
      EVENTS.ROUTE_PERMISSIONS_CHANGED,
      this.recompute
    )
  },

  compute ([routeName]) {
    return this.permissionsService.canAccessRoute(routeName)
  }
})
