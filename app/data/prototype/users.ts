export type DirectoryUserStatus = 'Active' | 'Offline'
export type DirectoryUserRole = 'Admin' | 'User'

export interface PrototypeDirectoryUser {
  id: string
  name: string
  email: string
  role: DirectoryUserRole
  groups: string[]
  status: DirectoryUserStatus
  lastSeen: string
}

export interface PrototypeDirectoryGroup {
  id: string
  name: string
  description: string
  userCount: number
  deviceCount: number
  color: 'info' | 'success' | 'neutral'
}

export const prototypeDirectoryUsers: readonly PrototypeDirectoryUser[] = [
  { id: 'directory-user-001', name: 'Faris Munir', email: 'faris@example.test', role: 'Admin', groups: ['Operations'], status: 'Active', lastSeen: 'Now' },
  { id: 'directory-user-002', name: 'Operator A', email: 'operator.a@example.test', role: 'User', groups: ['Field Team'], status: 'Active', lastSeen: '8 min ago' },
  { id: 'directory-user-003', name: 'Operator B', email: 'operator.b@example.test', role: 'User', groups: ['Field Team'], status: 'Offline', lastSeen: 'Yesterday' }
]

export const prototypeDirectoryGroups: readonly PrototypeDirectoryGroup[] = [
  { id: 'directory-group-001', name: 'Operations', description: 'Dispatch and operations staff', userCount: 3, deviceCount: 4, color: 'info' },
  { id: 'directory-group-002', name: 'Field Team', description: 'On-site operators and responders', userCount: 4, deviceCount: 6, color: 'success' },
  { id: 'directory-group-003', name: 'Demo', description: 'Demo and training resources', userCount: 1, deviceCount: 3, color: 'neutral' }
]
