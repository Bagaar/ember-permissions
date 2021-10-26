import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { PERMISSION, ROUTE } from '../../config';

module('Integration | Helper | can-access-route', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders `true` or `false` based on the provided (route) permissions', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setPermissions([PERMISSION.FOO]);
    permissionsService.setRoutePermissions({
      [ROUTE.FOO]: [PERMISSION.FOO],
    });

    this.routeName = ROUTE.FOO;

    await render(hbs`{{can-access-route this.routeName}}`);

    assert.dom().hasText('true');

    permissionsService.setPermissions([]);

    await settled();

    assert.dom().hasText('false');
  });
});
