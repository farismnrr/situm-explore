export function isAsyncDataLoading(status: string) {
  return status === 'idle' || status === 'pending'
}

export function isWorkspaceRequestLoading(workspaceLoaded: boolean, workspaceId: string | null | undefined, status: string) {
  return !workspaceLoaded || Boolean(workspaceId && isAsyncDataLoading(status))
}
