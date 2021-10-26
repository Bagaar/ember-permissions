import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { PERMISSION } from '../../config';

module('Integration | Helper | has-permissions', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders `true` or `false` based on the provided permissions', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setPermissions([PERMISSION.FOO]);

    this.permission = PERMISSION.FOO;

    await render(hbs`{{has-permissions this.permission}}`);

    assert.dom().hasText('true');

    permissionsService.setPermissions([]);

    await settled();

    assert.dom().hasText('false');
  });
});
