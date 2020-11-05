import { EVENTS } from '@bagaar/ember-permissions/-private/config'
import Helper from '@ember/component/helper'
import { action } from '@ember/object'
import { addListener, removeListener } from '@ember/object/events'
import { inject as service } from '@ember/service'

export default class CanAccessRouteHelper extends Helper {
  @service('permissions') permissionsService

  constructor () {
    super(...arguments)

    addListener(
      this.permissionsService,
      EVENTS.PERMISSIONS_CHANGED,
      this.handlePermissionsChanged
    )

    addListener(
      this.permissionsService,
      EVENTS.ROUTE_PERMISSIONS_CHANGED,
      this.handleRoutePermissionsChanged
    )
  }

  willDestroy () {
    removeListener(
      this.permissionsService,
      EVENTS.PERMISSIONS_CHANGED,
      this.handlePermissionsChanged
    )

    removeListener(
      this.permissionsService,
      EVENTS.ROUTE_PERMISSIONS_CHANGED,
      this.handleRoutePermissionsChanged
    )
  }

  compute ([routeName]) {
    return this.permissionsService.canAccessRoute(routeName)
  }

  @action
  handlePermissionsChanged () {
    this.recompute()
  }

  @action
  handleRoutePermissionsChanged () {
    this.recompute()
  }
}
