import { PERMISSION, ROUTE } from 'dummy/tests/config';
import { setupTest } from 'dummy/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Service | permissions', function (hooks) {
  setupTest(hooks);

  module('setPermissions', function () {
    test('it validates the arguments', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      assert.throws(() => {
        permissionsService.setPermissions();
      });

      assert.throws(() => {
        permissionsService.setPermissions(null);
      });
    });

    test('it works', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      permissionsService.setPermissions([PERMISSION.FOO]);

      assert.deepEqual(permissionsService.permissions, [PERMISSION.FOO]);
    });
  });

  module('setRoutePermissions', function () {
    test('it validates the arguments', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      assert.throws(() => {
        permissionsService.setRoutePermissions();
      });

      assert.throws(() => {
        permissionsService.setRoutePermissions(null);
      });
    });

    test('it works', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      permissionsService.setRoutePermissions({
        [ROUTE.FOO]: [PERMISSION.FOO],
      });

      assert.deepEqual(permissionsService.routePermissions, {
        [ROUTE.FOO]: [PERMISSION.FOO],
      });
    });
  });

  module('hasPermissions', function () {
    test('it validates the arguments', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      assert.throws(() => {
        permissionsService.hasPermissions();
      });

      assert.throws(() => {
        permissionsService.hasPermissions(null);
      });
    });

    test('it works', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      permissionsService.setPermissions([PERMISSION.FOO]);

      assert.true(permissionsService.hasPermissions([PERMISSION.FOO]));
      assert.false(permissionsService.hasPermissions([PERMISSION.BAR]));
    });
  });

  module('canAccessRoute', function () {
    test('it validates the arguments', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      assert.throws(() => {
        permissionsService.canAccessRoute();
      });

      assert.throws(() => {
        permissionsService.canAccessRoute(null);
      });

      assert.throws(() => {
        permissionsService.canAccessRoute('');
      });
    });

    test('it works', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      permissionsService.setPermissions([PERMISSION.FOO]);
      permissionsService.setRoutePermissions({
        [ROUTE.FOO]: [PERMISSION.FOO],
        [ROUTE.BAR]: [PERMISSION.BAR],
      });

      assert.true(permissionsService.canAccessRoute(ROUTE.FOO));
      assert.false(permissionsService.canAccessRoute(ROUTE.BAR));
    });
  });

  module('getRouteTreePermissions', function () {
    test('it works', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      const ROUTE_FOO_ROUTE_BAR = `${ROUTE.FOO}.${ROUTE.BAR}`;

      permissionsService.setRoutePermissions({
        [ROUTE.FOO]: [PERMISSION.FOO],
        [ROUTE_FOO_ROUTE_BAR]: [PERMISSION.BAR],
      });

      assert.deepEqual(
        permissionsService.getRouteTreePermissions(ROUTE_FOO_ROUTE_BAR),
        [PERMISSION.FOO, PERMISSION.BAR]
      );
    });
  });

  module('validateTransition', function () {
    test('it works', function (assert) {
      const permissionsService = this.owner.lookup('service:permissions');

      let timesCalled = 0;

      function handler() {
        timesCalled += 1;
      }

      permissionsService.setRoutePermissions({
        [ROUTE.FOO]: [PERMISSION.FOO],
      });

      permissionsService.on('route-access-denied', handler);

      permissionsService.validateTransition();
      permissionsService.validateTransition({});
      permissionsService.validateTransition({ to: {} });
      permissionsService.validateTransition({ to: { name: ROUTE.FOO } });

      permissionsService.off('route-access-denied', handler);

      assert.strictEqual(timesCalled, 1);
    });
  });
});
