import { EVENTS } from '@bagaar/ember-permissions/-private/config'
import { assert } from '@ember/debug'
import { addListener, sendEvent } from '@ember/object/events'
import Service, { inject as service } from '@ember/service'

export default class PermissionsService extends Service {
  @service('router') routerService

  initialTransition = null
  isRouteValidationEnabled = false
  permissions = []
  routePermissions = {}

  setPermissions (permissions) {
    assert(
      '`permissions` is required and should be an array.',
      permissions && Array.isArray(permissions)
    )

    this.permissions = permissions

    sendEvent(this, EVENTS.PERMISSIONS_CHANGED)
  }

  setRoutePermissions (routePermissions) {
    assert(
      '`routePermissions` is required and should be an object.',
      routePermissions && typeof routePermissions === 'object'
    )

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
    assert(
      '`routeName` is required and should be a string.',
      routeName && typeof routeName === 'string'
    )

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
