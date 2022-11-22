import { registerDestructor } from '@ember/destroyable';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { currentURL, visit } from '@ember/test-helpers';
import { PERMISSION, ROUTE } from 'dummy/tests/config';
import { setupApplicationTest } from 'dummy/tests/helpers';
import { module, test } from 'qunit';

module('Acceptance | route validation', function (hooks) {
  setupApplicationTest(hooks);

  test('it only triggers the `route-access-denied` event when `enableRouteValidation` was called', async function (assert) {
    const permissionsService = this.owner.lookup('service:permissions');
    const Router = this.owner.resolveRegistration('router:main');

    Router.map(function () {
      this.route(ROUTE.FOO);
      this.route(ROUTE.BAR);
    });

    let deniedTransition = null;

    const handler = (transition) => (deniedTransition = transition);

    permissionsService.on('route-access-denied', handler);

    permissionsService.setRoutePermissions({
      [ROUTE.FOO]: [PERMISSION.FOO],
    });

    await visit(ROUTE.FOO);
    assert.strictEqual(deniedTransition, null);

    await visit(ROUTE.BAR);
    permissionsService.setPermissions([PERMISSION.FOO]);
    permissionsService.enableRouteValidation();

    await visit(ROUTE.FOO);
    assert.strictEqual(deniedTransition, null);

    await visit(ROUTE.BAR);
    permissionsService.setPermissions([]);

    await visit(ROUTE.FOO);
    assert.strictEqual(deniedTransition.to.name, ROUTE.FOO);

    permissionsService.off('route-access-denied', handler);
  });

  test('it validates the initial transition', async function (assert) {
    const Router = this.owner.resolveRegistration('router:main');

    Router.map(function () {
      this.route(ROUTE.FOO);
      this.route('access-denied');
    });

    class ApplicationRoute extends Route {
      @service('permissions') permissionsService;
      @service('router') routerService;

      beforeModel(transition) {
        this.permissionsService.setRoutePermissions({
          [ROUTE.FOO]: [PERMISSION.FOO],
        });

        const handler = () => {
          this.routerService.replaceWith('access-denied');
        };

        this.permissionsService.on('route-access-denied', handler);

        registerDestructor(this, () => {
          this.permissionsService.off('route-access-denied', handler);
        });

        this.permissionsService.enableRouteValidation(transition);
      }
    }

    this.owner.register('route:application', ApplicationRoute);

    await visit(ROUTE.FOO);

    assert.strictEqual(currentURL(), '/access-denied');
  });
});
