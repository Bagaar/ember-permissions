export function initialize (applicationInstance) {
  const permissionsService = applicationInstance.lookup('service:permissions')

  permissionsService.cacheInitialTransition()
}

export default {
  initialize
}
