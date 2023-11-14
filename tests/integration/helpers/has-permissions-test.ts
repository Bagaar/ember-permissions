import type PermissionsService from '@bagaar/ember-permissions/services/permissions';
import type { Permission } from '@bagaar/ember-permissions/services/permissions';
import { render, settled, type TestContext } from '@ember/test-helpers';
import { PERMISSION } from 'dummy/tests/config';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

interface LocalTestContext extends TestContext {
  permission: Permission;
}

module('Integration | Helper | has-permissions', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders `true` or `false` based on the provided permissions', async function (this: LocalTestContext, assert) {
    const permissionsService = this.owner.lookup(
      'service:permissions',
    ) as PermissionsService;

    permissionsService.setPermissions([PERMISSION.FOO]);

    this.permission = PERMISSION.FOO;

    await render(hbs`{{has-permissions this.permission}}`);

    assert.dom().hasText('true');

    permissionsService.setPermissions([]);

    await settled();

    assert.dom().hasText('false');
  });
});
