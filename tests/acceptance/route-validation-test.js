import { visit } from '@ember/test-helpers';
import { PERMISSION, ROUTE } from 'dummy/tests/config';
import { setupApplicationTest } from 'dummy/tests/helpers';
import { module, test } from 'qunit';

module('Acceptance | route validation', function (hooks) {
  setupApplicationTest(hooks);

  test('it only calls route-access-denied handlers when route validation is enabled', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');
    const Router = this.owner.resolveRegistration('router:main');

    Router.map(function () {
      this.route(ROUTE.FOO);
      this.route(ROUTE.BAR);
    });

    let isHandlerCalled = false;

    const handler = () => (isHandlerCalled = true);

    permissionsService.addRouteAccessDeniedHandler(handler);

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

    permissionsService.removeRouteAccessDeniedHandler(handler);
  });
});
