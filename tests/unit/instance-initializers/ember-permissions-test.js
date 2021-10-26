import Application from '@ember/application';
import { run } from '@ember/runloop';
import config from 'dummy/config/environment';
import { initialize } from 'dummy/instance-initializers/ember-permissions';
import Resolver from 'ember-resolver';
import { module, test } from 'qunit';

module('Unit | Instance Initializer | ember-permissions', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix;
      podModulePrefix = config.podModulePrefix;
      Resolver = Resolver;
    };

    this.TestApplication.instanceInitializer({
      name: 'initializer under test',
      initialize,
    });

    this.application = this.TestApplication.create({ autoboot: false });
    this.instance = this.application.buildInstance();
  });

  hooks.afterEach(function () {
    run(this.instance, 'destroy');
    run(this.application, 'destroy');
  });

  test('it works', async function (assert) {
    await this.instance.boot();

    assert.true(true);
  });
});
