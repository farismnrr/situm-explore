export interface RealtimePosition {
  id: string
  name: string
  kind: 'person' | 'device'
  status: 'online' | 'offline'
  location: string
  floor: string
  lastSeen?: string
  marker: { left: number; top: number; color: 'info' | 'success' }
}

export const realtimePositions: readonly RealtimePosition[] = [
  { id: 'faris-m', name: 'Faris M.', kind: 'person', status: 'online', location: 'Reception corridor', floor: 'Floor 1', marker: { left: 32, top: 30, color: 'info' } },
  { id: 'demo-device-02', name: 'Demo Device 02', kind: 'device', status: 'online', location: 'Training Area', floor: 'Floor 2', marker: { left: 48, top: 40, color: 'info' } },
  { id: 'operator-a', name: 'Operator A', kind: 'person', status: 'online', location: 'Meeting Room A', floor: 'Floor 1', marker: { left: 64, top: 50, color: 'info' } },
  { id: 'tracker-04', name: 'Tracker 04', kind: 'device', status: 'offline', location: 'Last seen 12 min ago', floor: '', lastSeen: '12 min ago', marker: { left: 77, top: 63, color: 'success' } }
]

export const realtimeStats = [
  { label: 'Online', value: '21', note: 'of 24 tracked devices' },
  { label: 'Floor 1', value: '12', note: 'current positions' },
  { label: 'Floor 2', value: '9', note: 'current positions' },
  { label: 'Outside building', value: '3', note: 'last known status' }
] as const
