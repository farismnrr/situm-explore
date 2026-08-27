export type User = { id: string, email: string }
export type Workspace = { id: string, name: string, createdAt: string, updatedAt: string }
export type WorkspaceConfigSummary = { configured: boolean, readOnlyConfigured: boolean, readWriteConfigured: boolean, situmAccountId: string }
export type MobileLoginResponse = { ok: true, session: string, user: User }
export type MobileLogoutResponse = { ok: true }
export type PositioningCredentialResponse = { configured: true, workspaceId: string, situmAccountId: string, apiKey: string }
