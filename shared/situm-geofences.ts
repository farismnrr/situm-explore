export interface SitumGeofence {
  id: string
  buildingId: string
  floorId: number
  name: string
  type: string
  info: string
  geometric: [number, number][]
}

export interface SitumGeofencesResponse {
  geofences: SitumGeofence[]
}
