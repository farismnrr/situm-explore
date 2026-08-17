import { ApiError } from '../api/errors'
import * as SecureStore from 'expo-secure-store'
import type { PositioningCredentialResponse, Workspace, WorkspaceConfigSummary } from '../api/types'
import type { AuthSession } from '../auth/session'
import type { NativeDeepLink } from '../navigation/deep-link'

export type WorkspaceState = 'idle' | 'loading' | 'ready' | 'empty' | 'error'
const workspaceStorageKey = 'situm-explore.workspace-id'

export class WorkspaceContext {
  readonly auth: AuthSession
  workspaces: Workspace[] = []
  selectedWorkspaceId: string | null = null
  state: WorkspaceState = 'idle'
  error: ApiError | null = null
  configuration: WorkspaceConfigSummary | null = null
  requestedBuildingId: number | null = null
  private version = 0
  private readonly listeners = new Set<() => void>()

  constructor(auth: AuthSession) { this.auth = auth }

  get selectedWorkspace() { return this.workspaces.find(workspace => workspace.id === this.selectedWorkspaceId) ?? null }
  getSnapshot = () => this.version
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener) }

  private notify() { this.version++; this.listeners.forEach(listener => listener()) }

  private async restoreSelection() {
    try { return await SecureStore.getItemAsync(workspaceStorageKey) } catch { return null }
  }

  private persistSelection(workspaceId: string | null) {
    if (!workspaceId) return
    void SecureStore.setItemAsync(workspaceStorageKey, workspaceId).catch(() => undefined)
  }

  async load() {
    this.state = 'loading'
    this.error = null
    this.notify()
    try {
      const persistedWorkspaceId = await this.restoreSelection()
      this.workspaces = await this.auth.api.get<Workspace[]>('/api/workspaces')
      this.selectedWorkspaceId = this.workspaces.find(workspace => workspace.id === persistedWorkspaceId)?.id ?? this.workspaces[0]?.id ?? null
      this.persistSelection(this.selectedWorkspaceId)
      this.state = this.workspaces.length ? 'ready' : 'empty'
      this.notify()
      return this.workspaces
    } catch (error) {
      this.state = 'error'
      this.error = error instanceof ApiError ? error : new ApiError('Workspaces are unavailable.', { code: 'NETWORK_ERROR' })
      this.notify()
      throw this.error
    }
  }

  select(workspaceId: string) {
    if (!this.workspaces.some(workspace => workspace.id === workspaceId)) throw new ApiError('That workspace is not available to this account.', { code: 'FORBIDDEN' })
    this.selectedWorkspaceId = workspaceId
    this.configuration = null
    this.persistSelection(workspaceId)
    this.notify()
  }

  applyDeepLink(link: NativeDeepLink) {
    if (link.workspaceId) this.select(link.workspaceId)
    this.requestedBuildingId = link.destination === 'map' ? link.buildingId ?? null : null
    this.notify()
  }

  clearRequestedBuilding() {
    this.requestedBuildingId = null
    this.notify()
  }

  async loadConfiguration() {
    if (!this.selectedWorkspaceId) return null
    this.configuration = await this.auth.api.get<WorkspaceConfigSummary>(`/api/workspaces/${this.selectedWorkspaceId}/situm-config`)
    this.notify()
    return this.configuration
  }

  async getPositioningCredential() {
    if (!this.selectedWorkspaceId) throw new ApiError('Select a workspace to continue.', { code: 'REQUEST_ERROR' })
    return this.auth.api.get<PositioningCredentialResponse>(`/api/workspaces/${this.selectedWorkspaceId}/mobile-positioning`)
  }
}
