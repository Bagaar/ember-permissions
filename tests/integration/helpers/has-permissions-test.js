import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const PERMISSION_A = 'PERMISSION_A';

module('Integration | Helper | has-permissions', function (hooks) {
  setupRenderingTest(hooks);

  test(`it renders 'true' or 'false' based on the provided permissions`, async function (assert) {
    let permissionsService = this.owner.lookup('service:permissions');

    permissionsService.setPermissions([PERMISSION_A]);

    this.set('permission', PERMISSION_A);

    await render(hbs `{{has-permissions permission}}`);

    assert.equal(this.element.textContent.trim(), 'true');

    permissionsService.setPermissions([]);

    await settled();

    assert.equal(this.element.textContent.trim(), 'false');
  });
});
