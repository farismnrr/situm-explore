export default defineEventHandler(async (event) => {
  await setUserSession(event, { user: { email: 'dev@test.com' } })
  return { success: true }
})
