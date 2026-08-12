export interface PrototypeMapBuilding {
  label: string
  floors: readonly string[]
}

/** Synthetic alternatives used by the map workspace until building integration. */
export const mapBuildings: readonly PrototypeMapBuilding[] = [
  { label: 'Main Building', floors: ['Floor 1', 'Floor 2'] },
  { label: 'Warehouse (synthetic)', floors: ['Ground floor', 'Mezzanine'] },
  { label: 'Demo Venue (synthetic)', floors: ['Lobby', 'Event floor'] }
]
