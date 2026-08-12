import { cartographyBuildings } from './cartography'

export interface PrototypeMapBuilding {
  label: string
  floors: readonly string[]
}

/** Synthetic alternatives used by the map workspace until building integration. */
export const mapBuildings: readonly PrototypeMapBuilding[] = cartographyBuildings.map(building => ({
  label: building.name,
  floors: building.floors.map(floor => floor.name)
}))
