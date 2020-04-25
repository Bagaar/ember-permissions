import { EVENTS } from '@bagaar/ember-permissions/config'
import { addListener, sendEvent } from '@ember/object/events'
import Service, { inject as service } from '@ember/service'

export default Service.extend({
  /**
   * Services
   */

  routerService: service('router'),

  /**
   * State
   */

  initialTransition: null,
  isRouteValidationEnabled: false,
  permissions: null,
  routePermissions: null,

  /**
   * Hooks
   */

  init () {
    this._super(...arguments)

    this.setPermissions([])
    this.setRoutePermissions({})
  },

  /**
   * Methods
   */

  setPermissions (permissions) {
    this.set('permissions', permissions)
    sendEvent(this, EVENTS.PERMISSIONS_CHANGED)
  },

  setRoutePermissions (routePermissions) {
    this.set('routePermissions', routePermissions)
    sendEvent(this, EVENTS.ROUTE_PERMISSIONS_CHANGED)
  },

  cacheInitialTransition () {
    addListener(
      this.routerService,
      'routeWillChange',
      this,
      transition => {
        this.set('initialTransition', transition)
      },
      true
    )

    addListener(
      this.routerService,
      'routeDidChange',
      this,
      () => {
        this.set('initialTransition', null)
      },
      true
    )
  },

  hasPermissions (...args) {
    let permissions = Array.isArray(args[0]) ? args[0] : args

    return permissions.every(permission => {
      return this.permissions.includes(permission)
    })
  },

  canAccessRoute (routeName) {
    let routeTreePermissions = this.getRouteTreePermissions(routeName)

    return this.hasPermissions(routeTreePermissions)
  },

  getRouteTreePermissions (routeName) {
    let routeNameSplitted = routeName.split('.')
    let routeTreePermissions = []

    for (let index = 0; index < routeNameSplitted.length; index++) {
      let routeNameJoined = routeNameSplitted.slice(0, index + 1).join('.')
      let routePermissions = this.routePermissions[routeNameJoined]

      if (routePermissions) {
        routeTreePermissions.push(...routePermissions)
      }
    }

    return routeTreePermissions
  },

  enableRouteValidation () {
    if (this.isRouteValidationEnabled) {
      return
    }

    this.set('isRouteValidationEnabled', true)

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
})
