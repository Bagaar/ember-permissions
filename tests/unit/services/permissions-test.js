import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

const PERMISSION_A = 'PERMISSION_A';
const PERMISSION_B = 'PERMISSION_B';
const ROUTE_A = 'ROUTE_A';
const ROUTE_B = 'ROUTE_B';

module('Unit | Service | permissions', function (hooks) {
  setupTest(hooks);

  test('setPermissions throws', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    assert.throws(() => {
      permissionsService.setPermissions();
    });

    permissionsService.setPermissions([]);
  });

  test('setPermissions', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setPermissions([PERMISSION_A]);

    assert.deepEqual(permissionsService.permissions, [PERMISSION_A]);
  });

  test('setRoutePermissions throws', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    assert.throws(() => {
      permissionsService.setRoutePermissions();
    });

    assert.throws(() => {
      permissionsService.setRoutePermissions(null);
    });

    permissionsService.setRoutePermissions({});
  });

  test('setRoutePermissions', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A],
    });

    assert.deepEqual(permissionsService.routePermissions, {
      [ROUTE_A]: [PERMISSION_A],
    });
  });

  test('hasPermissions throws', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    assert.throws(() => {
      permissionsService.hasPermissions();
    });

    assert.throws(() => {
      permissionsService.hasPermissions(null);
    });
  });

  test('hasPermissions', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setPermissions([PERMISSION_A]);

    assert.ok(permissionsService.hasPermissions([PERMISSION_A]));
    assert.notOk(permissionsService.hasPermissions([PERMISSION_B]));
  });

  test('canAccessRoute throws', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    assert.throws(() => {
      permissionsService.canAccessRoute();
    });

    assert.throws(() => {
      permissionsService.canAccessRoute('');
    });

    permissionsService.canAccessRoute('route-name');
  });

  test('canAccessRoute', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setPermissions([PERMISSION_A]);
    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A],
      [ROUTE_B]: [PERMISSION_B],
    });

    assert.ok(permissionsService.canAccessRoute(ROUTE_A));
    assert.notOk(permissionsService.canAccessRoute(ROUTE_B));
  });

  test('getRouteTreePermissions', function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    const ROUTE_A_ROUTE_B = `${ROUTE_A}.${ROUTE_B}`;

    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A],
      [ROUTE_A_ROUTE_B]: [PERMISSION_B],
    });

    assert.deepEqual(
      permissionsService.getRouteTreePermissions(ROUTE_A_ROUTE_B),
      [PERMISSION_A, PERMISSION_B]
    );
  });
});
