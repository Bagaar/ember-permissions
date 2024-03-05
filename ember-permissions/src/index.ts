import type {
  CanAccessRouteHandler,
  Permissions,
} from './services/permissions.ts';

export function hasPermissions(
  permissions: Permissions,
): CanAccessRouteHandler {
  return (service) => service.hasPermissions(permissions);
}

export function hasSomePermissions(
  permissions: Permissions,
): CanAccessRouteHandler {
  return (service) => service.hasSomePermissions(permissions);
}
