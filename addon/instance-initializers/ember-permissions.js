export function initialize (applicationInstance) {
  let permissionsService = applicationInstance.lookup('service:permissions')

  permissionsService.cacheInitialTransition()
}

export default {
  initialize
}
