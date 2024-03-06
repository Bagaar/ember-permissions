function hasPermissions(permissions) {
  return service => service.hasPermissions(permissions);
}
function hasSomePermissions(permissions) {
  return service => service.hasSomePermissions(permissions);
}

export { hasPermissions, hasSomePermissions };
//# sourceMappingURL=index.js.map
