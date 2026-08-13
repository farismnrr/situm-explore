export interface SitumCartographyBuilding {
  id: number
  name: string
  description: string
  location: { lat: number; lng: number }
  dimensions: { width: number; length: number }
  rotation: number
}

export interface SitumCartographyFloor {
  id: number
  buildingId: number
  level: number
  name: string
}

export interface SitumCartographyCategory {
  id: number
  name: string
  code: string
  iconUrl: string
  selectedIconUrl: string
}

export interface SitumCartographyPoi {
  id: number
  buildingId: number
  floorId: number
  name: string
  categoryId: number
  categoryName: string
  info: string
  type: string
  location: { lat: number; lng: number; x: number; y: number }
}

export interface SitumCartographyResponse {
  buildings: SitumCartographyBuilding[]
  floors: SitumCartographyFloor[]
  categories: SitumCartographyCategory[]
  pois: SitumCartographyPoi[]
}
