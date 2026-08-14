export function useWorkspaceEndpoint(path: string) {
  const { selectedWorkspaceId } = useWorkspaceContext()
  return computed(() => selectedWorkspaceId.value ? `/api/workspaces/${selectedWorkspaceId.value}${path}` : '')
}
