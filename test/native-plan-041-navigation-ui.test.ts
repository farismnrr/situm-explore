import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { fitMapFrame, projectCartesianToFrame, projectCartesianToMap } from '../mobile/src/map/customMapGeometry'
import { calculateIndoorRoute, routeSegmentsForFloor } from '../mobile/src/map/customRoute'
import { formatNavigationDistance, formatNavigationEta } from '../mobile/src/map/state'

test('Plan 041 formats custom route distance and ETA values', () => {
  assert.equal(formatNavigationDistance(0), '0 m')
  assert.equal(formatNavigationDistance(149.6), '150 m')
  assert.equal(formatNavigationDistance(1250), '1.3 km')
  assert.equal(formatNavigationDistance(-1), null)
  assert.equal(formatNavigationEta(61), '2 min')
})

test('Plan 041 projects Situm Cartesian coordinates onto an app-owned map frame', () => {
  const dimensions = { width: 100, length: 50 }
  const frame = fitMapFrame(dimensions, { width: 400, height: 400 })
  assert.deepEqual(frame, { width: 400, height: 200, left: 0, top: 100 })
  assert.deepEqual(projectCartesianToFrame({ x: 0, y: 0 }, dimensions, frame), { x: 0, y: 200 })
  assert.deepEqual(projectCartesianToFrame({ x: 100, y: 50 }, dimensions, frame), { x: 400, y: 0 })
  assert.deepEqual(projectCartesianToMap({ x: 25, y: 10 }, dimensions), { x: 25, y: 40 })
})

test('Plan 041 calculates a route from the real Situm path graph without MapView routing', () => {
  const route = calculateIndoorRoute({ paths: [{
    nodes: [
      { id: 1, floorId: 10, x: 0, y: 0 },
      { id: 2, floorId: 10, x: 10, y: 0 },
      { id: 3, floorId: 20, x: 10, y: 0 },
      { id: 4, floorId: 20, x: 20, y: 0 },
    ],
    links: [
      { source: 1, target: 2, origin: '', tags: [], accessible: true },
      { source: 2, target: 3, origin: '', tags: [], accessible: true },
      { source: 3, target: 4, origin: '', tags: [], accessible: true },
    ],
  }] }, { floorId: 10, x: 1, y: 0 }, { floorId: 20, x: 19, y: 0 })

  assert.ok(route)
  assert.deepEqual(route.points.map(point => point.floorId), [10, 10, 10, 20, 20, 20])
  assert.equal(routeSegmentsForFloor(route, 10).length, 1)
  assert.equal(routeSegmentsForFloor(route, 20).length, 1)
  assert.ok(route.distanceMeters > 20)
})

test('Plan 041 refuses to invent a route when the venue path graph is disconnected', () => {
  const route = calculateIndoorRoute({ paths: [{
    nodes: [
      { id: 1, floorId: 10, x: 0, y: 0 },
      { id: 2, floorId: 10, x: 10, y: 0 },
    ],
    links: [],
  }] }, { floorId: 10, x: 0, y: 0 }, { floorId: 10, x: 10, y: 0 })
  assert.equal(route, null)
})

test('Plan 041 Explore owns the map renderer and keeps Situm visual SDK out of the screen', () => {
  const app = readFileSync(new URL('../mobile/App.tsx', import.meta.url), 'utf8')
  const mapScreen = readFileSync(new URL('../mobile/src/map/NativeMapScreen.tsx', import.meta.url), 'utf8')
  const customMap = readFileSync(new URL('../mobile/src/map/CustomIndoorMap.tsx', import.meta.url), 'utf8')
  assert.match(mapScreen, /<CustomIndoorMap/)
  assert.match(mapScreen, /\/situm\/cartography/)
  assert.match(mapScreen, /\/situm\/paths/)
  assert.match(mapScreen, /calculateIndoorRoute\(paths/)
  assert.match(mapScreen, /accessibilityLabel="Search places"/)
  assert.match(mapScreen, /accessibilityLabel="Directions"/)
  assert.match(mapScreen, /accessibilityLabel="Stop guidance"/)
  assert.match(mapScreen, /Keyboard\.dismiss\(\)/)
  assert.match(app, /hidden=\{exploreFullscreen\}/)
  assert.doesNotMatch(app, /if \(activeTab === 'explore' && exploreFullscreen\) return/)
  assert.doesNotMatch(mapScreen, /\bMapView\b/)
  assert.doesNotMatch(mapScreen, /SitumProvider/)
  assert.doesNotMatch(mapScreen, /navigateToPoi/)
  assert.match(customMap, /react-native-svg/)
  assert.match(customMap, /Floor plan/)
  assert.match(customMap, /routeSegmentsForFloor/)
})
