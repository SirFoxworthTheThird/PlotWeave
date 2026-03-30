import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import type { ItemPlacement } from '@/types'
import { generateId } from '@/lib/id'

export function useItemPlacement(itemId: string | null, chapterId: string | null) {
  return useLiveQuery(
    () =>
      itemId && chapterId
        ? db.itemPlacements.where('[itemId+chapterId]').equals([itemId, chapterId]).first()
        : undefined,
    [itemId, chapterId]
  )
}

export function useLocationItemPlacements(locationMarkerId: string | null, chapterId: string | null) {
  return useLiveQuery(
    () =>
      locationMarkerId && chapterId
        ? db.itemPlacements
            .where('locationMarkerId').equals(locationMarkerId)
            .filter((p) => p.chapterId === chapterId)
            .toArray()
        : [],
    [locationMarkerId, chapterId],
    []
  )
}

export function useChapterItemPlacements(chapterId: string | null) {
  return useLiveQuery(
    () =>
      chapterId
        ? db.itemPlacements.where('chapterId').equals(chapterId).toArray()
        : [],
    [chapterId],
    []
  )
}

export function useWorldItemPlacements(worldId: string | null) {
  return useLiveQuery(
    () =>
      worldId
        ? db.itemPlacements.where('worldId').equals(worldId).toArray()
        : [],
    [worldId],
    []
  )
}

/** Place an item at a location for a chapter.
 *  Automatically removes it from any character's inventory in that chapter. */
export async function placeItemAtLocation(
  worldId: string,
  itemId: string,
  chapterId: string,
  locationMarkerId: string,
  notes = '',
): Promise<void> {
  await db.transaction('rw', [db.itemPlacements, db.characterSnapshots], async () => {
    // Remove from any character's inventory in this chapter
    const snapshotsWithItem = await db.characterSnapshots
      .where('chapterId').equals(chapterId)
      .filter((s) => s.inventoryItemIds.includes(itemId))
      .toArray()
    for (const snap of snapshotsWithItem) {
      await db.characterSnapshots.update(snap.id, {
        inventoryItemIds: snap.inventoryItemIds.filter((id) => id !== itemId),
        updatedAt: Date.now(),
      })
    }

    // Upsert the placement
    const existing = await db.itemPlacements
      .where('[itemId+chapterId]').equals([itemId, chapterId]).first()
    const now = Date.now()
    if (existing) {
      await db.itemPlacements.update(existing.id, { locationMarkerId, notes, updatedAt: now })
    } else {
      const placement: ItemPlacement = {
        id: generateId(),
        worldId,
        itemId,
        chapterId,
        locationMarkerId,
        notes,
        createdAt: now,
        updatedAt: now,
      }
      await db.itemPlacements.add(placement)
    }
  })
}

/** Remove an item's location placement (item becomes "nowhere" / untracked). */
export async function removeItemPlacement(itemId: string, chapterId: string): Promise<void> {
  await db.itemPlacements.where('[itemId+chapterId]').equals([itemId, chapterId]).delete()
}
