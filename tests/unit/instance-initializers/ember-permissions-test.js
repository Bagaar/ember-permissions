import PermissionsService from '@bagaar/ember-permissions/services/permissions'
import Application from '@ember/application'
import { run } from '@ember/runloop'
import { initialize } from 'dummy/instance-initializers/ember-permissions'
import { module, test } from 'qunit'

module('Unit | Instance Initializer | ember-permissions', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {}
    this.TestApplication.instanceInitializer({
      name: 'initializer under test',
      initialize
    })
    this.application = this.TestApplication.create({ autoboot: false })
    this.instance = this.application.buildInstance()
  })
  hooks.afterEach(function () {
    run(this.application, 'destroy')
    run(this.instance, 'destroy')
  })

  test('it works', async function (assert) {
    this.instance.register('service:permissions', PermissionsService)

    await this.instance.boot()

    assert.ok(true)
  })
})
