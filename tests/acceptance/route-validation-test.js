import { addListener } from '@ember/object/events';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { PERMISSION, ROUTE } from '../config';

module('Acceptance | route validation', function (hooks) {
  setupApplicationTest(hooks);

  test('it only triggers the `route-access-denied` event when `enableRouteValidation` was called', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');
    const Router = this.owner.resolveRegistration('router:main');

    Router.map(function () {
      this.route(ROUTE.FOO);
      this.route(ROUTE.BAR);
    });

    let isHandlerCalled = false;

    function handler() {
      isHandlerCalled = true;
    }

    addListener(permissionsService, 'route-access-denied', this, handler, true);

    permissionsService.setRoutePermissions({
      [ROUTE.FOO]: [PERMISSION.FOO],
    });

    await visit(ROUTE.FOO);
    assert.false(isHandlerCalled);

    await visit(ROUTE.BAR);
    permissionsService.setPermissions([PERMISSION.FOO]);
    permissionsService.enableRouteValidation();

    await visit(ROUTE.FOO);
    assert.false(isHandlerCalled);

    await visit(ROUTE.BAR);
    permissionsService.setPermissions([]);

    await visit(ROUTE.FOO);
    assert.true(isHandlerCalled);
  });
});
