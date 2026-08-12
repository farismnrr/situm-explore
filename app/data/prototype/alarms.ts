export type AlarmType = 'Assistance request' | 'Danger' | 'Deadman' | 'Geofence max stay'
export type AlarmStatus = 'Open' | 'Resolved'

export interface PrototypeAlarm {
  id: string
  type: AlarmType
  user: string
  location: string
  triggered: string
  status: AlarmStatus
}

export const alarmTypes: Array<'All types' | AlarmType> = [
  'All types',
  'Assistance request',
  'Danger',
  'Deadman',
  'Geofence max stay'
]

export const alarmStatuses: Array<'All statuses' | AlarmStatus> = ['All statuses', 'Open', 'Resolved']

export const prototypeAlarms: PrototypeAlarm[] = [
  { id: 'alarm-001', type: 'Assistance request', user: 'Operator A', location: 'Floor 2 · Training Room', triggered: '8 min ago', status: 'Open' },
  { id: 'alarm-002', type: 'Geofence max stay', user: 'Demo Device 02', location: 'Floor 1 · Meeting Room', triggered: '32 min ago', status: 'Open' },
  { id: 'alarm-003', type: 'Deadman', user: 'Operator B', location: 'Floor 1 · Reception', triggered: 'Yesterday', status: 'Resolved' }
]
