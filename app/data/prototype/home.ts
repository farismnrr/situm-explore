import { cartographyBuildings, cartographyPois } from './cartography'

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

export type HomePoi = (typeof cartographyPois)[number]

export const homeBuilding: HomeBuilding = {
  name: cartographyBuildings[0]!.name,
  organization: cartographyBuildings[0]!.organization,
  floor: cartographyBuildings[0]!.floors[0]!.name,
  status: 'Map ready'
}

export const homePois = cartographyPois

export const homeExplore: HomeExploreItem[] = [
  { icon: '◇', title: 'Buildings & floors', detail: 'Browse venue and floor metadata.', to: '/app/buildings' },
  { icon: '●', title: 'POIs', detail: 'Search destinations and categories.', to: '/app/pois' },
  { icon: '◉', title: 'Realtime', detail: 'Track current positions.', to: '/app/realtime' },
  { icon: '↗', title: 'Directions', detail: 'Preview routes and accessibility.', to: '/app/paths' },
  { icon: '▥', title: 'Reports', detail: 'Visitors, heatmaps and stay time.', to: '/app/analytics' },
  { icon: '⚙', title: 'Viewer config', detail: 'Preview map behavior preferences.', to: '/app/settings' }
]
