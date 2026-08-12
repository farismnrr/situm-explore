export interface HomeMetric {
  label: string
  value: string
  note: string
  positive?: boolean
}

export interface HomeActivity {
  title: string
  detail: string
  time: string
  tone: 'success' | 'info' | 'neutral' | 'warning'
}

export interface HomeBuilding {
  name: string
  organization: string
  floor: string
  status: string
}

export interface HomeExploreItem {
  icon: string
  title: string
  detail: string
  to: string
}

export interface HomePoi {
  id: string
  name: string
  category: string
  floor: string
  description: string
}

export const homeMetrics: HomeMetric[] = [
  { label: 'Buildings', value: '3', note: '5 floors available' },
  { label: 'Points of interest', value: '42', note: 'across 8 categories' },
  { label: 'Live positions', value: '24', note: '21 currently online', positive: true },
  { label: 'Open alarms', value: '2', note: '1 assistance · 1 stay time' }
]

export const homeBuilding: HomeBuilding = {
  name: 'Main building',
  organization: 'PT Berjaya Inovasi Global',
  floor: 'Floor 1',
  status: 'Map ready'
}

export const homePois: HomePoi[] = [
  { id: 'reception', name: 'Reception', category: 'Services', floor: 'Floor 1', description: 'Visitor services and front desk' },
  { id: 'meeting-room-a', name: 'Meeting Room A', category: 'Rooms', floor: 'Floor 1', description: 'Small meeting room near the workspace corridor' },
  { id: 'training-area', name: 'Training Area', category: 'Workspace', floor: 'Floor 2', description: 'Flexible training and collaboration space' },
  { id: 'lift-lobby', name: 'Lift Lobby', category: 'Access', floor: 'Floor 1', description: 'Lift access between building floors' }
]

export const homeActivity: HomeActivity[] = [
  { title: 'Map viewer ready', detail: 'Building viewer initialized successfully', time: '1m', tone: 'success' },
  { title: 'Realtime refreshed', detail: '24 positions returned', time: '3m', tone: 'info' },
  { title: 'Report loaded', detail: 'Visitors · last 24 hours', time: '18m', tone: 'neutral' },
  { title: 'Geofence alert', detail: 'Meeting room max stay time', time: '32m', tone: 'warning' }
]

export const homeExplore: HomeExploreItem[] = [
  { icon: '◇', title: 'Buildings & floors', detail: 'Browse venue and floor metadata.', to: '/app/buildings' },
  { icon: '●', title: 'POIs', detail: 'Search destinations and categories.', to: '/app/pois' },
  { icon: '◉', title: 'Realtime', detail: 'Track current positions.', to: '/app/realtime' },
  { icon: '↗', title: 'Directions', detail: 'Preview routes and accessibility.', to: '/app/paths' },
  { icon: '▥', title: 'Reports', detail: 'Visitors, heatmaps and stay time.', to: '/app/analytics' },
  { icon: '⚙', title: 'Viewer config', detail: 'Preview map behavior preferences.', to: '/app/settings' }
]
