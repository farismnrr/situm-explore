export interface SitumRealtimePosition { id: string, time: string, buildingId: number, floorId: number, accuracy: number, lat: number, lng: number, deviceId?: string }
export interface SitumRealtimeResponse { positions: SitumRealtimePosition[] }
