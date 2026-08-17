declare module '@situm/react-native' {
  import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react'
  import type { StyleProp, ViewStyle } from 'react-native'

  export type Location = { position?: { floorIdentifier?: string, buildingIdentifier?: string } }
  export type LocationStatus = { statusName: string }
  export type Error = { code?: string, message?: string }
  export type Route = { poiTo?: unknown }
  export type NavigationProgress = { distanceToGoal: number }
  export type OnPoiSelectedResult = { identifier: string, buildingIdentifier: string }
  export type OnPoiDeselectedResult = { identifier: string, buildingIdentifier: string }
  export type OnFloorChangedResult = { toFloorName: string }
  export type MapViewRef = { selectPoi: (id: number) => void, deselectPoi: () => void, selectFloor: (id: number) => void, navigateToPoi: (params: { identifier: number }) => void, cancelNavigation: () => void }
  export type MapViewProps = {
    configuration: { buildingIdentifier: string, situmApiKey?: string, profile?: string, language?: string }
    style?: StyleProp<ViewStyle>
    onLoad?: (event: unknown) => void
    onLoadError?: (event: unknown) => void
    onPoiSelected?: (event: OnPoiSelectedResult) => void
    onPoiDeselected?: (event: OnPoiDeselectedResult) => void
    onFloorChanged?: (event: OnFloorChangedResult) => void
  }
  export const MapView: ForwardRefExoticComponent<MapViewProps & RefAttributes<MapViewRef>>
  export const SitumProvider: (props: { children?: ReactNode, email?: string, apiKey?: string, token?: string, apiDomain?: string }) => ReactNode
  const SitumPlugin: {
    init: () => void
    setApiKey: (apiKey: string) => Promise<void>
    setUseRemoteConfig: (enabled: boolean) => Promise<void>
    configureUserHelper: (options: { enabled: boolean, colorScheme?: unknown }) => Promise<void>
    requestLocationUpdates: (options?: { buildingIdentifier?: number }) => void
    removeLocationUpdates: () => void
    positioningIsRunning: () => boolean
    navigationIsRunning: () => boolean
    removeNavigationUpdates: () => Promise<void>
    onLocationUpdate: (callback: (location: Location) => void) => void
    onLocationStatus: (callback: (status: LocationStatus) => void) => void
    onLocationError: (callback: (error: Error) => void) => void
    onLocationStopped: (callback: () => void) => void
    onNavigationStart: (callback: (route: Route) => void) => void
    onNavigationProgress: (callback: (progress: NavigationProgress) => void) => void
    onNavigationDestinationReached: (callback: (route: Route) => void) => void
    onNavigationOutOfRoute: (callback: () => void) => void
    onNavigationCancellation: (callback: () => void) => void
    onNavigationError: (callback: (error: unknown) => void) => void
  }
  export default SitumPlugin
}
