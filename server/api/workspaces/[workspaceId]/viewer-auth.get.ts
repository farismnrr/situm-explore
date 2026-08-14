import { issueWorkspaceViewerJwt } from '../../../utils/viewer-auth'

export default defineEventHandler(async (event) => {
  return issueWorkspaceViewerJwt(event, getRouterParam(event, 'workspaceId') || '')
})
