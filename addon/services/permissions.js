import { EVENTS } from '@bagaar/ember-permissions/config'
import { addListener, sendEvent } from '@ember/object/events'
import Service, { inject as service } from '@ember/service'

export default class PermissionsService extends Service {
  @service('router') routerService

  initialTransition = null
  isRouteValidationEnabled = false
  permissions = []
  routePermissions = {}

  setPermissions (permissions) {
    this.permissions = permissions

    sendEvent(this, EVENTS.PERMISSIONS_CHANGED)
  }

  setRoutePermissions (routePermissions) {
    this.routePermissions = routePermissions

    sendEvent(this, EVENTS.ROUTE_PERMISSIONS_CHANGED)
  }

  cacheInitialTransition () {
    addListener(
      this.routerService,
      'routeWillChange',
      this,
      transition => {
        this.initialTransition = transition
      },
      true
    )

    addListener(
      this.routerService,
      'routeDidChange',
      this,
      () => {
        this.initialTransition = null
      },
      true
    )
  }

  hasPermissions (...args) {
    const permissions = Array.isArray(args[0]) ? args[0] : args

    return permissions.every(permission => {
      return this.permissions.includes(permission)
    })
  }

  canAccessRoute (routeName) {
    const routeTreePermissions = this.getRouteTreePermissions(routeName)

    return this.hasPermissions(routeTreePermissions)
  }

  getRouteTreePermissions (routeName) {
    const routeNameSplitted = routeName.split('.')
    const routeTreePermissions = []

    for (let index = 0; index < routeNameSplitted.length; index++) {
      const routeNameJoined = routeNameSplitted.slice(0, index + 1).join('.')
      const routePermissions = this.routePermissions[routeNameJoined]

      if (routePermissions) {
        routeTreePermissions.push(...routePermissions)
      }
    }

    return routeTreePermissions
  }

  enableRouteValidation () {
    if (this.isRouteValidationEnabled) {
      return
    }

    this.isRouteValidationEnabled = true

    // Validate the initial transition if `enableRouteValidation` was called during it.
    if (
      this.initialTransition &&
      !this.canAccessRoute(this.initialTransition.to.name)
    ) {
      sendEvent(this, 'route-access-denied', [this.initialTransition])
    }

    addListener(this.routerService, 'routeWillChange', transition => {
      if (transition.to && !this.canAccessRoute(transition.to.name)) {
        sendEvent(this, 'route-access-denied', [transition])
      }
    })
  }
}
