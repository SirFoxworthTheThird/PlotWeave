export interface CharacterMovement {
  id: string
  worldId: string
  characterId: string
  chapterId: string
  waypoints: string[]  // ordered locationMarkerIds
  createdAt: number
  updatedAt: number
}
