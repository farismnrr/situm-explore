export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo(to.path.startsWith('/app/') || to.path === '/app' ? '/login' : '/')
  }
})
