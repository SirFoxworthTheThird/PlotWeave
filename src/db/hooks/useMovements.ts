import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import type { CharacterMovement } from '@/types'
import { generateId } from '@/lib/id'

export function useChapterMovements(worldId: string | null, chapterId: string | null): CharacterMovement[] {
  return useLiveQuery(
    () =>
      worldId && chapterId
        ? db.characterMovements
            .where('chapterId').equals(chapterId)
            .filter((m) => m.worldId === worldId)
            .toArray()
        : [],
    [worldId, chapterId],
    []
  )
}

export function useCharacterMovement(characterId: string | null, chapterId: string | null): CharacterMovement | undefined {
  return useLiveQuery(
    () =>
      characterId && chapterId
        ? db.characterMovements
            .where('[characterId+chapterId]')
            .equals([characterId, chapterId])
            .first()
        : undefined,
    [characterId, chapterId]
  )
}

/** Appends a waypoint to the movement for a character in a chapter, creating it if needed. */
export async function appendWaypoint(
  worldId: string,
  characterId: string,
  chapterId: string,
  markerId: string,
): Promise<void> {
  const existing = await db.characterMovements
    .where('[characterId+chapterId]')
    .equals([characterId, chapterId])
    .first()

  const now = Date.now()
  if (existing) {
    const last = existing.waypoints[existing.waypoints.length - 1]
    if (last === markerId) return
    await db.characterMovements.update(existing.id, {
      waypoints: [...existing.waypoints, markerId],
      updatedAt: now,
    })
  } else {
    const movement: CharacterMovement = {
      id: generateId(),
      worldId,
      characterId,
      chapterId,
      waypoints: [markerId],
      createdAt: now,
      updatedAt: now,
    }
    await db.characterMovements.add(movement)
  }
}

export async function clearMovement(characterId: string, chapterId: string): Promise<void> {
  await db.characterMovements
    .where('[characterId+chapterId]')
    .equals([characterId, chapterId])
    .delete()
}

export async function removeLastWaypoint(characterId: string, chapterId: string): Promise<void> {
  const existing = await db.characterMovements
    .where('[characterId+chapterId]')
    .equals([characterId, chapterId])
    .first()
  if (!existing || existing.waypoints.length <= 1) {
    await clearMovement(characterId, chapterId)
    return
  }
  await db.characterMovements.update(existing.id, {
    waypoints: existing.waypoints.slice(0, -1),
    updatedAt: Date.now(),
  })
}
