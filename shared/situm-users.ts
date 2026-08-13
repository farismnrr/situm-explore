export interface SitumUserSummary { id: string, email: string, fullName: string, role: string, buildingIds: number[] }
export interface SitumUsersResponse { users: SitumUserSummary[] }
