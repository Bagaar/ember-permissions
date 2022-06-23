import { render, settled } from '@ember/test-helpers';
import { PERMISSION, ROUTE } from 'dummy/tests/config';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

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
