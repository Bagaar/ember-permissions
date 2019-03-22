import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, settled } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

const PERMISSION_A = 'PERMISSION_A'
const ROUTE_A = 'ROUTE_A'

module('Integration | Helper | can-access-route', function (hooks) {
  setupRenderingTest(hooks)

  test(`it renders 'true' or 'false' based on the provided (route) permissions`, async function (assert) {
    let permissionsService = this.owner.lookup('service:permissions')

    permissionsService.setPermissions([PERMISSION_A])
    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A]
    })

    this.set('routeName', ROUTE_A)

    await render(hbs`{{can-access-route routeName}}`)

    assert.equal(this.element.textContent.trim(), 'true')

    permissionsService.setPermissions([])

    await settled()

    assert.equal(this.element.textContent.trim(), 'false')
  })
})
