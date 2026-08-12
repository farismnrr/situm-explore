export type AnalyticsReport = 'visitors' | 'heatmap' | 'stay' | 'positioning' | 'positions' | 'viewer'

export interface AnalyticsBar {
  label: string
  value: number
}

export interface StayRecord {
  zone: string
  sessions: number
  average: string
  maximum: string
}

export interface PositionRecord {
  user: string
  building: string
  floor: string
  timestamp: string
}

export const analyticsTabs: readonly { id: AnalyticsReport; label: string }[] = [
  { id: 'visitors', label: 'Visitors' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'stay', label: 'Geofence stay time' },
  { id: 'positioning', label: 'Positioning time' },
  { id: 'positions', label: 'User positions' },
  { id: 'viewer', label: 'Map viewer usage' }
]

export const visitorBars: readonly AnalyticsBar[] = [
  { label: '08:00', value: 38 }, { label: '10:00', value: 55 }, { label: '12:00', value: 48 },
  { label: '14:00', value: 69 }, { label: '16:00', value: 78 }, { label: '18:00', value: 66 }, { label: '20:00', value: 84 }
]

export const positioningBars: readonly AnalyticsBar[] = [
  { label: 'Faris', value: 72 }, { label: 'Operator', value: 58 }, { label: 'Device 02', value: 64 },
  { label: 'Tracker', value: 48 }, { label: 'Visitor', value: 81 }
]

export const stayRecords: readonly StayRecord[] = [
  { zone: 'Main Workspace', sessions: 94, average: '18m', maximum: '1h 14m' },
  { zone: 'Meeting Room Zone', sessions: 42, average: '26m', maximum: '54m' },
  { zone: 'Training Area', sessions: 36, average: '34m', maximum: '1h 38m' }
]

export const positionRecords: readonly PositionRecord[] = [
  { user: 'Faris M.', building: 'Main Building', floor: 'Floor 1', timestamp: '13:42:08' },
  { user: 'Operator A', building: 'Main Building', floor: 'Floor 1', timestamp: '13:42:04' },
  { user: 'Demo Device 02', building: 'Main Building', floor: 'Floor 2', timestamp: '13:41:58' }
]

export const viewerUsage = [
  { label: 'Sessions', value: '76', note: 'last 24 hours' },
  { label: 'POI selections', value: '184', note: '2.4 per session' },
  { label: 'Directions requested', value: '31', note: '41% of sessions' }
] as const
