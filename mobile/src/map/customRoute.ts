import type { SitumPath, SitumPathsResponse } from '../../../shared/situm-paths'

export type IndoorRoutePoint = { floorId: number, x: number, y: number, nodeId?: number }
export type IndoorRoute = { points: IndoorRoutePoint[], distanceMeters: number }
export type IndoorPosition = { floorId: number, x: number, y: number }

type GraphNode = IndoorRoutePoint & { key: string }
type Edge = { to: string, weight: number }

const floorTransitionPenaltyMeters = 8

function distance(a: Pick<IndoorRoutePoint, 'x' | 'y'>, b: Pick<IndoorRoutePoint, 'x' | 'y'>) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function edgeWeight(a: IndoorRoutePoint, b: IndoorRoutePoint) {
  return distance(a, b) + (a.floorId === b.floorId ? 0 : floorTransitionPenaltyMeters)
}

function appendPathGraph(path: SitumPath, pathIndex: number, nodes: Map<string, GraphNode>, adjacency: Map<string, Edge[]>) {
  const keysById = new Map<number, string>()
  for (const node of path.nodes) {
    const key = `${pathIndex}:${node.id}`
    keysById.set(node.id, key)
    nodes.set(key, { key, nodeId: node.id, floorId: Number(node.floorId), x: node.x, y: node.y })
    adjacency.set(key, [])
  }
  for (const link of path.links) {
    const sourceKey = keysById.get(link.source)
    const targetKey = keysById.get(link.target)
    if (!sourceKey || !targetKey) continue
    const source = nodes.get(sourceKey)
    const target = nodes.get(targetKey)
    if (!source || !target) continue
    const weight = edgeWeight(source, target)
    // Situm path links describe graph connectivity. We keep traversal symmetric here;
    // direction-specific path policy can be layered on once the venue uses it.
    adjacency.get(sourceKey)?.push({ to: targetKey, weight })
    adjacency.get(targetKey)?.push({ to: sourceKey, weight })
  }
}

function nearestNode(nodes: Iterable<GraphNode>, position: IndoorPosition) {
  let best: GraphNode | null = null
  let bestDistance = Number.POSITIVE_INFINITY
  for (const node of nodes) {
    if (node.floorId !== position.floorId) continue
    const nextDistance = distance(node, position)
    if (nextDistance < bestDistance) {
      best = node
      bestDistance = nextDistance
    }
  }
  return best
}

export function calculateIndoorRoute(pathsResponse: SitumPathsResponse, from: IndoorPosition, to: IndoorPosition): IndoorRoute | null {
  const nodes = new Map<string, GraphNode>()
  const adjacency = new Map<string, Edge[]>()
  pathsResponse.paths.forEach((path, index) => appendPathGraph(path, index, nodes, adjacency))
  if (!nodes.size) return null

  const start = nearestNode(nodes.values(), from)
  const goal = nearestNode(nodes.values(), to)
  if (!start || !goal) return null

  const costs = new Map<string, number>([[start.key, 0]])
  const previous = new Map<string, string>()
  const unvisited = new Set(nodes.keys())

  while (unvisited.size) {
    let currentKey: string | null = null
    let currentCost = Number.POSITIVE_INFINITY
    for (const key of unvisited) {
      const candidate = costs.get(key) ?? Number.POSITIVE_INFINITY
      if (candidate < currentCost) {
        currentKey = key
        currentCost = candidate
      }
    }
    if (!currentKey || !Number.isFinite(currentCost)) break
    if (currentKey === goal.key) break
    unvisited.delete(currentKey)
    for (const edge of adjacency.get(currentKey) ?? []) {
      if (!unvisited.has(edge.to)) continue
      const candidate = currentCost + edge.weight
      if (candidate < (costs.get(edge.to) ?? Number.POSITIVE_INFINITY)) {
        costs.set(edge.to, candidate)
        previous.set(edge.to, currentKey)
      }
    }
  }

  if (start.key !== goal.key && !previous.has(goal.key)) return null
  const keys: string[] = [goal.key]
  while (keys[0] !== start.key) {
    const prior = previous.get(keys[0]!)
    if (!prior) return null
    keys.unshift(prior)
  }
  const graphPoints = keys.map(key => nodes.get(key)).filter((node): node is GraphNode => Boolean(node))
  const points: IndoorRoutePoint[] = [from, ...graphPoints.map(({ floorId, x, y, nodeId }) => ({ floorId, x, y, nodeId })), to]
  return { points, distanceMeters: routeDistance(points) }
}

export function routeDistance(points: IndoorRoutePoint[]) {
  let total = 0
  for (let index = 1; index < points.length; index++) total += edgeWeight(points[index - 1]!, points[index]!)
  return total
}

export function nearestRoutePointIndex(route: IndoorRoute, position: IndoorPosition) {
  let bestIndex = -1
  let bestDistance = Number.POSITIVE_INFINITY
  route.points.forEach((point, index) => {
    if (point.floorId !== position.floorId) return
    const candidate = distance(point, position)
    if (candidate < bestDistance) {
      bestIndex = index
      bestDistance = candidate
    }
  })
  return { index: bestIndex, distanceMeters: bestDistance }
}

export function remainingRouteDistance(route: IndoorRoute, position: IndoorPosition) {
  const nearest = nearestRoutePointIndex(route, position)
  if (nearest.index < 0) return route.distanceMeters
  return distance(position, route.points[nearest.index]!) + routeDistance(route.points.slice(nearest.index))
}

export function nextRouteInstruction(route: IndoorRoute, position: IndoorPosition, floorName: (floorId: number) => string) {
  const nearest = nearestRoutePointIndex(route, position)
  if (nearest.index < 0) return 'Follow the route to your destination'
  const current = route.points[nearest.index]
  const next = route.points[nearest.index + 1]
  const after = route.points[nearest.index + 2]
  if (!current || !next) return 'Arrive at destination'
  if (next.floorId !== current.floorId) return `Change floor to ${floorName(next.floorId)}`
  if (!after || after.floorId !== next.floorId) return 'Continue along the route'

  const first = Math.atan2(next.y - current.y, next.x - current.x)
  const second = Math.atan2(after.y - next.y, after.x - next.x)
  let delta = (second - first) * 180 / Math.PI
  while (delta > 180) delta -= 360
  while (delta < -180) delta += 360
  if (Math.abs(delta) < 30) return 'Continue straight'
  if (delta > 0) return delta > 120 ? 'Turn sharply left' : 'Turn left'
  return delta < -120 ? 'Turn sharply right' : 'Turn right'
}

export function routeSegmentsForFloor(route: IndoorRoute | null, floorId: number) {
  if (!route) return [] as IndoorRoutePoint[][]
  const segments: IndoorRoutePoint[][] = []
  let active: IndoorRoutePoint[] = []
  for (const point of route.points) {
    if (point.floorId === floorId) {
      active.push(point)
    } else if (active.length) {
      segments.push(active)
      active = []
    }
  }
  if (active.length) segments.push(active)
  return segments
}
