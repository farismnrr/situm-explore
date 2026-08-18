import type { default as SitumPlugin, Error as SitumError, Location, LocationStatus } from '@situm/react-native'

export type PositioningState = 'stopped' | 'starting' | 'active' | 'error'
export type PositioningSnapshot = { state: PositioningState, location: Location | null, receivedAt: number | null, workspaceId: string | null, buildingId: number | null, message: string }
type NativePositioning = Pick<typeof SitumPlugin, 'setApiKey' | 'requestLocationUpdates' | 'removeLocationUpdates' | 'positioningIsRunning' | 'onLocationUpdate' | 'onLocationStatus' | 'onLocationError' | 'onLocationStopped'>
const stoppedSnapshot = (): PositioningSnapshot => ({ state: 'stopped', location: null, receivedAt: null, workspaceId: null, buildingId: null, message: 'Location is off.' })
function defaultNative(): NativePositioning {
  // Keep the native-only module out of deterministic Node tests; the app resolves it when constructing its default session.
  return require('@situm/react-native').default as NativePositioning
}

export class ForegroundPositioningSession {
  private readonly native: NativePositioning
  private snapshot: PositioningSnapshot = stoppedSnapshot()
  private workspaceId: string | null = null
  private lifecycle = 'active'
  private generation = 0
  private readonly listeners = new Set<() => void>()
  private readonly locationCallback = (location: Location) => this.onLocation(location)
  private readonly statusCallback = (status: LocationStatus) => this.onStatus(status)
  private readonly errorCallback = (error: SitumError) => this.onError(error)
  private readonly stoppedCallback = () => this.stopFromNative('Location is stopped.')

  constructor(native: NativePositioning = defaultNative()) {
    this.native = native
    this.installNativeListeners()
  }

  getSnapshot = () => this.snapshot
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  installNativeListeners() { this.native.onLocationUpdate(this.locationCallback); this.native.onLocationStatus(this.statusCallback); this.native.onLocationError(this.errorCallback); this.native.onLocationStopped(this.stoppedCallback) }
  setLifecycle(lifecycle: string) { if (this.lifecycle !== lifecycle) { this.lifecycle = lifecycle; if (lifecycle !== 'active') this.stop('background') } }
  setWorkspace(workspaceId: string | null) { if (this.workspaceId !== workspaceId) { this.stop('workspace-switch'); this.workspaceId = workspaceId; this.update({ ...stoppedSnapshot(), workspaceId }) } }

  async start(workspaceId: string, buildingId: number, getCredential: () => Promise<{ apiKey: string }>) {
    if (this.lifecycle !== 'active') return
    if ((this.snapshot.state === 'starting' || this.snapshot.state === 'active') && this.snapshot.workspaceId === workspaceId && this.snapshot.buildingId === buildingId) return
    if (this.snapshot.state === 'error') {
      try { if (this.native.positioningIsRunning()) this.native.removeLocationUpdates() } catch { /* native cleanup is best effort */ }
    }
    this.setWorkspace(workspaceId)
    const generation = ++this.generation
    this.update({ state: 'starting', location: null, receivedAt: null, workspaceId, buildingId, message: 'Requesting the permissions needed for indoor positioning…' })
    try {
      const credential = await getCredential()
      if (generation !== this.generation || this.lifecycle !== 'active' || this.workspaceId !== workspaceId) return
      this.installNativeListeners()
      await this.native.setApiKey(credential.apiKey)
      if (generation !== this.generation || this.lifecycle !== 'active' || this.workspaceId !== workspaceId) return
      this.native.requestLocationUpdates({ buildingIdentifier: buildingId })
    } catch {
      if (generation === this.generation) this.update({ state: 'error', location: null, receivedAt: null, workspaceId, buildingId, message: 'Location permission or a device sensor is unavailable.' })
    }
  }

  stop(_reason: 'explicit' | 'workspace-switch' | 'logout' | 'background' | 'dispose' | 'native' = 'explicit') {
    this.generation++
    try { if (this.native.positioningIsRunning()) this.native.removeLocationUpdates() } catch { /* native cleanup is best effort */ }
    this.update({ ...stoppedSnapshot(), workspaceId: this.workspaceId })
  }

  dispose() { this.stop('dispose'); this.native.onLocationUpdate(() => undefined); this.native.onLocationStatus(() => undefined); this.native.onLocationError(() => undefined); this.native.onLocationStopped(() => undefined); this.listeners.clear() }

  private onLocation(location: Location) { const buildingId = this.snapshot.buildingId; if (this.snapshot.state === 'stopped' || !this.workspaceId || buildingId === null || Number(location.position?.buildingIdentifier) !== buildingId) return; this.update({ ...this.snapshot, state: 'active', location, receivedAt: Date.now(), message: 'Live position received from Situm.' }) }
  private onStatus(status: LocationStatus) { if (status.statusName === 'STOPPED') return this.stopFromNative('Location is stopped.'); if (status.statusName === 'USER_NOT_IN_BUILDING') return this.failFromNative('Situm could not determine a position in the selected building.'); if (this.snapshot.state !== 'stopped') this.update({ ...this.snapshot, state: 'starting', message: 'Situm is determining your indoor position…' }) }
  private onError(_error: SitumError) { if (this.snapshot.state !== 'stopped') this.failFromNative('Situm could not determine a position.') }
  private failFromNative(message: string) { this.generation++; try { if (this.native.positioningIsRunning()) this.native.removeLocationUpdates() } catch { /* native cleanup is best effort */ }; this.update({ ...this.snapshot, state: 'error', location: null, receivedAt: null, message }) }
  private stopFromNative(message: string) { this.generation++; this.update({ ...this.snapshot, state: 'stopped', location: null, receivedAt: null, message }) }
  private update(next: PositioningSnapshot) { this.snapshot = next; this.listeners.forEach(listener => listener()) }
}
