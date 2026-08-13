export interface SitumGroupSummary {
  id: string
  uuid: string
  name: string
  organizationId: string
  parentGroupId: string | null
  iconColour: string | null
  isStaff: boolean | null
}

export interface SitumAlarmStatusChange {
  state: string
  createdAt: string
}

export interface SitumAlarm {
  uuid: string
  x: number
  y: number
  lat: number
  lng: number
  buildingId: number
  floorId: number
  outside: boolean
  inside: boolean
  createdAt: string
  updatedAt: string
  type: string
  statusChanges: SitumAlarmStatusChange[]
  active: boolean
  currentState: string
  customFields: Record<string, unknown>
}

export interface SitumGroupsResponse { groups: SitumGroupSummary[] }
export interface SitumAlarmsResponse { alarms: SitumAlarm[] }
export interface SitumAlarmResponse { alarm: SitumAlarm }
