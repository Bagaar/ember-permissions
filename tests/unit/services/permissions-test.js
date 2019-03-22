import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

const PERMISSION_A = 'PERMISSION_A'
const PERMISSION_B = 'PERMISSION_B'
const ROUTE_A = 'ROUTE_A'
const ROUTE_B = 'ROUTE_B'

module('Unit | Service | permissions', function (hooks) {
  setupTest(hooks)

  test('setPermissions', function (assert) {
    let permissionsService = this.owner.lookup('service:permissions')
    let isHandlerCalled = false

    function handler () {
      isHandlerCalled = true
    }

    permissionsService.on('permissions-changed', handler)
    permissionsService.setPermissions([PERMISSION_A])
    permissionsService.off('permissions-changed', handler)

    assert.ok(isHandlerCalled)
    assert.deepEqual(permissionsService.permissions, [PERMISSION_A])
  })

  test('setRoutePermissions', function (assert) {
    let permissionsService = this.owner.lookup('service:permissions')
    let isHandlerCalled = false

    function handler () {
      isHandlerCalled = true
    }

    permissionsService.on('route-permissions-changed', handler)
    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A]
    })
    permissionsService.off('route-permissions-changed', handler)

    assert.ok(isHandlerCalled)
    assert.deepEqual(permissionsService.routePermissions, {
      [ROUTE_A]: [PERMISSION_A]
    })
  })

  test('hasPermissions', function (assert) {
    let permissionsService = this.owner.lookup('service:permissions')

    permissionsService.setPermissions([PERMISSION_A])

    assert.ok(permissionsService.hasPermissions(PERMISSION_A))
    assert.ok(permissionsService.hasPermissions([PERMISSION_A]))

    assert.notOk(permissionsService.hasPermissions(PERMISSION_B))
    assert.notOk(permissionsService.hasPermissions([PERMISSION_B]))
  })

  test('canAccessRoute', function (assert) {
    let permissionsService = this.owner.lookup('service:permissions')

    permissionsService.setPermissions([PERMISSION_A])
    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A],
      [ROUTE_B]: [PERMISSION_B]
    })

    assert.ok(permissionsService.canAccessRoute(ROUTE_A))
    assert.notOk(permissionsService.canAccessRoute(ROUTE_B))
  })

  test('getRouteTreePermissions', function (assert) {
    let permissionsService = this.owner.lookup('service:permissions')

    const ROUTE_A_ROUTE_B = `${ROUTE_A}.${ROUTE_B}`

    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A],
      [ROUTE_A_ROUTE_B]: [PERMISSION_B]
    })

    assert.deepEqual(
      permissionsService.getRouteTreePermissions(ROUTE_A_ROUTE_B),
      [PERMISSION_A, PERMISSION_B]
    )
  })
})
