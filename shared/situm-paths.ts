export interface SitumPathNode { id: number, floorId: number, x: number, y: number }
export interface SitumPathLink { source: number, target: number, origin: string, tags: string[], accessible: boolean }
export interface SitumPath { nodes: SitumPathNode[], links: SitumPathLink[] }
export interface SitumPathsResponse { paths: SitumPath[] }
