import type PermissionsService from '@bagaar/ember-permissions/services/permissions';
import { render, settled, type TestContext } from '@ember/test-helpers';
import { PERMISSION } from 'test-app/tests/config';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

interface LocalTestContext extends TestContext {
  PERMISSION: typeof PERMISSION;
}

module('Integration | Helper | has-some-permissions', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders `true` or `false` based on the provided permissions', async function (this: LocalTestContext, assert) {
    const permissionsService = this.owner.lookup(
      'service:permissions',
    ) as PermissionsService;

    permissionsService.setPermissions([PERMISSION.FOO]);

    this.PERMISSION = PERMISSION;

    await render(hbs`
      {{has-some-permissions this.PERMISSION.FOO this.PERMISSION.BAR}}
    `);

    assert.dom().hasText('true');

    permissionsService.setPermissions([]);

    await settled();

    assert.dom().hasText('false');
  });
});
