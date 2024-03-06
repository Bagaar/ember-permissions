/// <reference types="ember-source/types/stable/@ember/routing/router-service" />
/// <reference types="ember-source/types/stable/@ember/service" />
/// <reference types="ember-source/types/stable/@ember/routing/service-ext" />
import type RouterService from '@ember/routing/router-service';
import Service from '@ember/service';
export type CanAccessRouteHandler = (service: PermissionsService) => boolean;
export type Permissions = string[];
export type Transition = ReturnType<RouterService['transitionTo']>;
type RouteAccessDeniedHandler = (deniedTransition: Transition) => void;
type RoutePermissions = {
    [routeName: string]: Permissions | CanAccessRouteHandler;
};
export default class PermissionsService extends Service {
    #private;
    routerService: RouterService;
    permissions: Permissions;
    routePermissions: RoutePermissions;
    addRouteAccessDeniedHandler(handler: RouteAccessDeniedHandler): void;
    removeRouteAccessDeniedHandler(handler: RouteAccessDeniedHandler): void;
    setPermissions(permissions: Permissions): void;
    setRoutePermissions(routePermissions: RoutePermissions): void;
    hasPermissions(permissions: Permissions): boolean;
    hasSomePermissions(permissions: Permissions): boolean;
    canAccessRoute(routeName: string): boolean;
    enableRouteValidation(initialTransition?: Transition): void;
    validateTransition(transition: Transition): void;
    willDestroy(): void;
}
declare module '@ember/service' {
    interface Registry {
        permissions: PermissionsService;
    }
}
export {};
//# sourceMappingURL=permissions.d.ts.map