import type {
  CanAccessRouteHandler,
  Permissions,
} from './services/permissions';

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
