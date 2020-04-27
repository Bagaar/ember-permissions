import { addListener } from '@ember/object/events'
import { visit } from '@ember/test-helpers'
import { setupApplicationTest } from 'ember-qunit'
import { module, test } from 'qunit'

const PERMISSION_A = 'PERMISSION_A'
const ROUTE_A = 'ROUTE_A'
const ROUTE_B = 'ROUTE_B'

module('Acceptance | route validation', function (hooks) {
  setupApplicationTest(hooks)

  test('it only triggers the `route-access-denied` event when `enableRouteValidation` is called', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions')
    const Router = this.owner.resolveRegistration('router:main')

    Router.map(function () {
      this.route(ROUTE_A)
      this.route(ROUTE_B)
    })

    let isHandlerCalled = false

    function handler () {
      isHandlerCalled = true
    }

    addListener(permissionsService, 'route-access-denied', this, handler, true)

    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A]
    })

    await visit(ROUTE_A)
    assert.notOk(isHandlerCalled)

    await visit(ROUTE_B)
    permissionsService.setPermissions([PERMISSION_A])
    permissionsService.enableRouteValidation()

    await visit(ROUTE_A)
    assert.notOk(isHandlerCalled)

    await visit(ROUTE_B)
    permissionsService.setPermissions([])

    await visit(ROUTE_A)
    assert.ok(isHandlerCalled)
  })
})
