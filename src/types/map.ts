export interface MapLayer {
  id: string
  worldId: string
  parentMapId: string | null
  name: string
  description: string
  imageId: string
  imageWidth: number
  imageHeight: number
  /** Pixels per real-world unit. Null means no scale has been set. */
  scalePixelsPerUnit: number | null
  /** Label for the unit, e.g. "km", "miles", "leagues". */
  scaleUnit: string | null
  createdAt: number
  updatedAt: number
}

export type LocationIconType =
  | 'city'
  | 'town'
  | 'dungeon'
  | 'landmark'
  | 'building'
  | 'region'
  | 'custom'

export interface LocationMarker {
  id: string
  worldId: string
  mapLayerId: string
  linkedMapLayerId: string | null
  name: string
  description: string
  x: number
  y: number
  iconType: LocationIconType
  tags: string[]
  createdAt: number
  updatedAt: number
}
