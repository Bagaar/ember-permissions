import type PermissionsService from '@bagaar/ember-permissions/services/permissions';
import { TestContext } from '@ember/test-helpers';
import { PERMISSION, ROUTE } from 'dummy/tests/config';
import { setupTest } from 'dummy/tests/helpers';
import { module, test } from 'qunit';

interface LocalTestContext extends TestContext {
  permissionsService: PermissionsService;
}

module('Unit | Service | permissions', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: LocalTestContext) {
    this.permissionsService = this.owner.lookup(
      'service:permissions'
    ) as PermissionsService;
  });

  module('setPermissions', function () {
    test('it validates the arguments', function (this: LocalTestContext, assert) {
      assert.throws(() => {
        // @ts-expect-error: Testing runtime validation.
        this.permissionsService.setPermissions();
      });

      assert.throws(() => {
        // @ts-expect-error: Testing runtime validation.
        this.permissionsService.setPermissions(null);
      });
    });

    test('it works', function (this: LocalTestContext, assert) {
      this.permissionsService.setPermissions([PERMISSION.FOO]);

      assert.deepEqual(this.permissionsService.permissions, [PERMISSION.FOO]);
    });
  });

  module('setRoutePermissions', function () {
    test('it validates the arguments', function (this: LocalTestContext, assert) {
      assert.throws(() => {
        // @ts-expect-error: Testing runtime validation.
        this.permissionsService.setRoutePermissions();
      });

      assert.throws(() => {
        // @ts-expect-error: Testing runtime validation.
        this.permissionsService.setRoutePermissions(null);
      });
    });

    test('it works', function (this: LocalTestContext, assert) {
      this.permissionsService.setRoutePermissions({
        [ROUTE.FOO]: [PERMISSION.FOO],
      });

      assert.deepEqual(this.permissionsService.routePermissions, {
        [ROUTE.FOO]: [PERMISSION.FOO],
      });
    });
  });

  module('hasPermissions', function () {
    test('it validates the arguments', function (this: LocalTestContext, assert) {
      assert.throws(() => {
        // @ts-expect-error: Testing runtime validation.
        this.permissionsService.hasPermissions();
      });

      assert.throws(() => {
        // @ts-expect-error: Testing runtime validation.
        this.permissionsService.hasPermissions(null);
      });
    });

    test('it works', function (this: LocalTestContext, assert) {
      this.permissionsService.setPermissions([PERMISSION.FOO]);

      assert.true(this.permissionsService.hasPermissions([PERMISSION.FOO]));
      assert.false(this.permissionsService.hasPermissions([PERMISSION.BAR]));
    });
  });

  module('canAccessRoute', function () {
    test('it validates the arguments', function (this: LocalTestContext, assert) {
      assert.throws(() => {
        // @ts-expect-error: Testing runtime validation.
        this.permissionsService.canAccessRoute();
      });

      assert.throws(() => {
        // @ts-expect-error: Testing runtime validation.
        this.permissionsService.canAccessRoute(null);
      });

      assert.throws(() => {
        this.permissionsService.canAccessRoute('');
      });
    });

    test('it works', function (this: LocalTestContext, assert) {
      this.permissionsService.setPermissions([PERMISSION.FOO]);
      this.permissionsService.setRoutePermissions({
        [ROUTE.FOO]: [PERMISSION.FOO],
        [ROUTE.BAR]: [PERMISSION.BAR],
      });

      assert.true(this.permissionsService.canAccessRoute(ROUTE.FOO));
      assert.false(this.permissionsService.canAccessRoute(ROUTE.BAR));
    });
  });

  module('getRouteTreePermissions', function () {
    test('it works', function (this: LocalTestContext, assert) {
      const ROUTE_FOO_ROUTE_BAR = `${ROUTE.FOO}.${ROUTE.BAR}`;

      this.permissionsService.setRoutePermissions({
        [ROUTE.FOO]: [PERMISSION.FOO],
        [ROUTE_FOO_ROUTE_BAR]: [PERMISSION.BAR],
      });

      assert.deepEqual(
        this.permissionsService.getRouteTreePermissions(ROUTE_FOO_ROUTE_BAR),
        [PERMISSION.FOO, PERMISSION.BAR]
      );
    });
  });

  module('validateTransition', function () {
    test('it works', function (this: LocalTestContext, assert) {
      let timesCalled = 0;

      function handler() {
        timesCalled += 1;
      }

      this.permissionsService.setRoutePermissions({
        [ROUTE.FOO]: [PERMISSION.FOO],
      });

      this.permissionsService.on('route-access-denied', handler);

      // @ts-expect-error: Testing runtime validation.
      this.permissionsService.validateTransition();
      // @ts-expect-error: Testing runtime validation.
      this.permissionsService.validateTransition({});
      // @ts-expect-error: Testing runtime validation.
      this.permissionsService.validateTransition({ to: {} });
      // @ts-expect-error: Mock `RouteInfo`.
      this.permissionsService.validateTransition({ to: { name: ROUTE.FOO } });

      this.permissionsService.off('route-access-denied', handler);

      assert.strictEqual(timesCalled, 1);
    });
  });
});
