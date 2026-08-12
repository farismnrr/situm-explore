export interface DashboardStat {
  label: string
  value: string
  note: string
  positive?: boolean
}

export interface DashboardTrendPoint {
  day: string
  value: number
}

export interface DashboardFloorOccupancy {
  floor: string
  people: number
  capacity: number
}

export interface DashboardAlarm {
  title: string
  detail: string
  time: string
  tone: 'error' | 'warning'
}

export const dashboardStats: DashboardStat[] = [
  { label: 'Visitors today', value: '128', note: '↑ 8.4% vs yesterday', positive: true },
  { label: 'Active devices', value: '24', note: '3 floors represented' },
  { label: 'Avg. stay time', value: '18m', note: 'main workspace geofence' },
  { label: 'Viewer sessions', value: '76', note: 'last 24 hours' }
]

export const dashboardTrend: DashboardTrendPoint[] = [
  { day: 'Mon', value: 42 }, { day: 'Tue', value: 58 }, { day: 'Wed', value: 51 },
  { day: 'Thu', value: 69 }, { day: 'Fri', value: 64 }, { day: 'Sat', value: 82 }, { day: 'Sun', value: 76 }
]

export const dashboardOccupancy: DashboardFloorOccupancy[] = [
  { floor: 'Floor 1', people: 15, capacity: 22 },
  { floor: 'Floor 2', people: 9, capacity: 21 }
]

export const dashboardAlarms: DashboardAlarm[] = [
  { title: 'Assistance request', detail: 'Floor 2 · Training room', time: '8m', tone: 'error' },
  { title: 'Max stay time', detail: 'Floor 1 · Meeting room', time: '32m', tone: 'warning' }
]
