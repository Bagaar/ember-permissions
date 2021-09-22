import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const PERMISSION_A = 'PERMISSION_A';
const ROUTE_A = 'ROUTE_A';

module('Integration | Helper | can-access-route', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders `true` or `false` based on the provided (route) permissions', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setPermissions([PERMISSION_A]);
    permissionsService.setRoutePermissions({
      [ROUTE_A]: [PERMISSION_A],
    });

    this.routeName = ROUTE_A;

    await render(hbs`{{can-access-route this.routeName}}`);

    assert.dom().hasText('true');

    permissionsService.setPermissions([]);

    await settled();

    assert.dom().hasText('false');
  });
});
