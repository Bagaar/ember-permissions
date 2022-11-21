import { visit } from '@ember/test-helpers';
import { PERMISSION, ROUTE } from 'dummy/tests/config';
import { setupApplicationTest } from 'dummy/tests/helpers';
import { module, test } from 'qunit';

module('Acceptance | route validation', function (hooks) {
  setupApplicationTest(hooks);

  test('it only triggers the `route-access-denied` event when `enableRouteValidation` was called', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');
    const Router = this.owner.resolveRegistration('router:main');

    Router.map(function () {
      this.route(ROUTE.FOO);
      this.route(ROUTE.BAR);
    });

    let deniedTransition = null;

    const handler = (transition) => (deniedTransition = transition);

    permissionsService.on('route-access-denied', handler);

    permissionsService.setRoutePermissions({
      [ROUTE.FOO]: [PERMISSION.FOO],
    });

    await visit(ROUTE.FOO);
    assert.strictEqual(deniedTransition, null);

    await visit(ROUTE.BAR);
    permissionsService.setPermissions([PERMISSION.FOO]);
    permissionsService.enableRouteValidation();

    await visit(ROUTE.FOO);
    assert.strictEqual(deniedTransition, null);

    await visit(ROUTE.BAR);
    permissionsService.setPermissions([]);

    await visit(ROUTE.FOO);
    assert.strictEqual(deniedTransition.to.name, ROUTE.FOO);

    permissionsService.off('route-access-denied', handler);
  });
});
