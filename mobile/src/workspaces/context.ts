import { ApiError } from '../api/errors'
import type { PositioningCredentialResponse, Workspace } from '../api/types'
import type { AuthSession } from '../auth/session'

export type WorkspaceState = 'idle' | 'loading' | 'ready' | 'empty' | 'error'

export class WorkspaceContext {
  readonly auth: AuthSession
  workspaces: Workspace[] = []
  selectedWorkspaceId: string | null = null
  state: WorkspaceState = 'idle'
  error: ApiError | null = null

  constructor(auth: AuthSession) { this.auth = auth }

  get selectedWorkspace() { return this.workspaces.find(workspace => workspace.id === this.selectedWorkspaceId) ?? null }

  async load() {
    this.state = 'loading'
    this.error = null
    try {
      this.workspaces = await this.auth.api.get<Workspace[]>('/api/workspaces')
      if (!this.workspaces.some(workspace => workspace.id === this.selectedWorkspaceId)) this.selectedWorkspaceId = this.workspaces[0]?.id ?? null
      this.state = this.workspaces.length ? 'ready' : 'empty'
      return this.workspaces
    } catch (error) {
      this.state = 'error'
      this.error = error instanceof ApiError ? error : new ApiError('Workspaces are unavailable.', { code: 'NETWORK_ERROR' })
      throw this.error
    }
  }

  select(workspaceId: string) {
    if (!this.workspaces.some(workspace => workspace.id === workspaceId)) throw new ApiError('That workspace is not available to this account.', { code: 'FORBIDDEN' })
    this.selectedWorkspaceId = workspaceId
  }

  async getPositioningCredential() {
    if (!this.selectedWorkspaceId) throw new ApiError('Select a workspace to continue.', { code: 'REQUEST_ERROR' })
    return this.auth.api.get<PositioningCredentialResponse>(`/api/workspaces/${this.selectedWorkspaceId}/mobile-positioning`)
  }
}
