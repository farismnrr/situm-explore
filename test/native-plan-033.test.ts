import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { layoutForWidth, layoutModeForWidth, navigationDestinations, shouldRenderTopbarBrand } from '../mobile/src/ui/layout'
import { canStopGuidance, filterPois, navigationIsOwned, resolveFloorDisplay } from '../mobile/src/map/state'
import { filterRealtimePositions } from '../mobile/src/realtime/state'

test('Plan 033 shared layout mode stays deterministic across reference breakpoints', () => {
  assert.equal(layoutModeForWidth(390), 'phone')
  assert.equal(layoutModeForWidth(700), 'tablet')
  assert.equal(layoutModeForWidth(1050), 'wide')
  assert.equal(layoutModeForWidth(1800), 'veryWide')
  assert.equal(layoutForWidth(390).isPhone, true)
  assert.equal(layoutForWidth(1280).railWidth, 208)
  assert.equal(layoutForWidth(1800).contentPadding, 34)
})

test('Plan 033 shell keeps brand ownership singular across breakpoints', () => {
  assert.equal(shouldRenderTopbarBrand(false), true)
  assert.equal(shouldRenderTopbarBrand(true), false)
})

test('Plan 033 filters real POIs by building, name, category, and normalized query', () => {
  const pois = [{ id: 1, buildingId: 10, name: 'Main Reception', categoryName: 'Lobby' }, { id: 2, buildingId: 10, name: 'Blue Room', categoryName: 'Meeting' }, { id: 3, buildingId: 11, name: 'Main Reception', categoryName: 'Lobby' }]
  assert.deepEqual(filterPois(pois, 10, '  RECEPTION '), [pois[0]])
  assert.deepEqual(filterPois(pois, 10, 'meeting'), [pois[1]])
  assert.deepEqual(filterPois(pois, 10, 'missing'), [])
})

test('Plan 033 resolves selected-place floor from real cartography only', () => {
  const floors = [{ id: 7, buildingId: 10, level: 2, name: 'Second floor' }, { id: 8, buildingId: 10, level: 3, name: '' }]
  assert.equal(resolveFloorDisplay(floors, 7, 10), 'Second floor')
  assert.equal(resolveFloorDisplay(floors, 8, 10), 'Level 3')
  assert.equal(resolveFloorDisplay(floors, 7, 11), null)
})

test('Plan 033 filters Realtime by building and device/position/building/floor search', () => {
  const positions = [{ id: 'p1', deviceId: 'scanner-a', buildingId: 10, floorId: 2 }, { id: 'p2', deviceId: 'scanner-b', buildingId: 11, floorId: 3 }]
  assert.deepEqual(filterRealtimePositions(positions, 10, ''), [positions[0]])
  assert.deepEqual(filterRealtimePositions(positions, null, '  SCANNER-B '), [positions[1]])
  assert.deepEqual(filterRealtimePositions(positions, null, '11 3'), [positions[1]])
  assert.deepEqual(filterRealtimePositions(positions, 10, 'scanner-b'), [])
})

test('Plan 033 exposes stop guidance only for owned navigation', () => {
  assert.equal(navigationIsOwned('active', false), true)
  assert.equal(canStopGuidance('outside-route'), true)
  assert.equal(canStopGuidance('idle'), false)
  assert.equal(canStopGuidance('idle', true), true)
})

test('Plan 033 preserves approved navigation destinations', () => {
  assert.deepEqual(navigationDestinations, ['Explore', 'Realtime', 'Recent', 'Settings'])
})

test('Plan 033 source contracts retain explicit guidance stop and selected accessibility state', () => {
  const mapScreen = readFileSync(new URL('../mobile/src/map/NativeMapScreen.tsx', import.meta.url), 'utf8')
  const realtimeScreen = readFileSync(new URL('../mobile/src/realtime/RealtimeScreen.tsx', import.meta.url), 'utf8')
  assert.match(mapScreen, /Stop guidance/)
  assert.match(mapScreen, /const isGuidanceActive = navigationState === 'active' \|\| navigationState === 'outside-route'/)
  assert.match(mapScreen, /selectedPoi=\{selectedPoi\}/)
  assert.match(realtimeScreen, /accessibilityState=\{\{ selected \}\}/)
  assert.doesNotMatch(mapScreen, /Start positioning/)
})
