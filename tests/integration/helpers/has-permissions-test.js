import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const PERMISSION_A = 'PERMISSION_A';

module('Integration | Helper | has-permissions', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders `true` or `false` based on the provided permissions', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setPermissions([PERMISSION_A]);

    this.permission = PERMISSION_A;

    await render(hbs`{{has-permissions this.permission}}`);

    assert.dom().hasText('true');

    permissionsService.setPermissions([]);

    await settled();

    assert.dom().hasText('false');
  });
});
