export type MapDimensions = { width: number, length: number }
export type MapViewport = { width: number, height: number }
export type MapFrame = { width: number, height: number, left: number, top: number }

export function fitMapFrame(dimensions: MapDimensions, viewport: MapViewport): MapFrame {
  if (dimensions.width <= 0 || dimensions.length <= 0 || viewport.width <= 0 || viewport.height <= 0) return { width: 0, height: 0, left: 0, top: 0 }
  const scale = Math.min(viewport.width / dimensions.width, viewport.height / dimensions.length)
  const width = dimensions.width * scale
  const height = dimensions.length * scale
  return { width, height, left: (viewport.width - width) / 2, top: (viewport.height - height) / 2 }
}

export function projectCartesianToFrame(point: { x: number, y: number }, dimensions: MapDimensions, frame: Pick<MapFrame, 'width' | 'height'>) {
  return {
    x: dimensions.width > 0 ? point.x / dimensions.width * frame.width : 0,
    y: dimensions.length > 0 ? (dimensions.length - point.y) / dimensions.length * frame.height : 0,
  }
}

export function projectCartesianToMap(point: { x: number, y: number }, dimensions: MapDimensions) {
  return {
    x: point.x,
    y: dimensions.length - point.y,
  }
}
