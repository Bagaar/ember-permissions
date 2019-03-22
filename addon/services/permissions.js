import { EVENTS } from '@bagaar/ember-permissions/config'
import Evented from '@ember/object/evented'
import Service, { inject as service } from '@ember/service'

export default Service.extend(Evented, {
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
    this.cacheInitialTransition()
  },

  /**
   * Methods
   */

  setPermissions (permissions) {
    this.set('permissions', permissions)
    this.trigger(EVENTS.PERMISSIONS_CHANGED)
  },

  setRoutePermissions (routePermissions) {
    this.set('routePermissions', routePermissions)
    this.trigger(EVENTS.ROUTE_PERMISSIONS_CHANGED)
  },

  cacheInitialTransition () {
    this.routerService.one('routeWillChange', transition => {
      this.set('initialTransition', transition)
    })

    this.routerService.one('routeDidChange', () => {
      this.set('initialTransition', null)
    })
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
      this.trigger('route-access-denied', this.initialTransition)
    }

    this.routerService.on('routeWillChange', transition => {
      if (transition.to && !this.canAccessRoute(transition.to.name)) {
        this.trigger('route-access-denied', transition)
      }
    })
  }
})
