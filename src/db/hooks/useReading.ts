import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import { useActiveEventId } from '@/store'
import { useWorld } from '@/db/hooks/useWorlds'
import {
  firstAppearances, hiddenCount, isRevealed, revealed, sortKeysByEvent,
  type Appearance, type SortKey,
} from '@/lib/spoilers'

/**
 * Reading mode, and what the reader has met so far.
 *
 * The gate is derived rather than stored: an entity is revealed at the earliest
 * event that uses it, which falls straight out of records the app already keeps
 * — cast lists on events, and the per-event snapshots that drive every other
 * view. Nothing had to be authored for a world to become spoiler-safe, which is
 * why the library worlds work without being rebuilt.
 */

export interface ReadingGate {
  /** Whether gating applies at all. */
  active: boolean
  /** The reader's position, or null for "all chapters" (full reveal). */
  cursor: SortKey | null
  /** Chapter number at the cursor, for the banner. */
  chapterNumber: number | null
  isRevealed: (entityId: string) => boolean
  filter: <T extends { id: string }>(records: readonly T[]) => T[]
  hidden: <T extends { id: string }>(records: readonly T[]) => number
}

/** A gate that hides nothing — used while data is loading, and when writing. */
const OPEN_GATE: ReadingGate = {
  active: false,
  cursor: null,
  chapterNumber: null,
  isRevealed: () => true,
  filter: (records) => [...records],
  hidden: () => 0,
}

export function useReadingMode(worldId: string | null): boolean {
  return !!useWorld(worldId)?.readingMode
}

/**
 * Build the reveal gate for a world.
 *
 * Returns an open gate when reading mode is off, so callers can use it
 * unconditionally rather than branching at every list.
 */
export function useReadingGate(worldId: string | null): ReadingGate {
  const readingMode = useReadingMode(worldId)
  const activeEventId = useActiveEventId()

  const data = useLiveQuery(
    async () => {
      if (!worldId || !readingMode) return null
      const [events, chapters, charSnaps, itemPlacements, locSnaps, itemSnaps] = await Promise.all([
        db.events.where('worldId').equals(worldId).toArray(),
        db.chapters.where('worldId').equals(worldId).toArray(),
        db.characterSnapshots.where('worldId').equals(worldId).toArray(),
        db.itemPlacements.where('worldId').equals(worldId).toArray(),
        db.locationSnapshots.where('worldId').equals(worldId).toArray(),
        db.itemSnapshots.where('worldId').equals(worldId).toArray(),
      ])
      return { events, chapters, charSnaps, itemPlacements, locSnaps, itemSnaps }
    },
    [worldId, readingMode],
    null,
  )

  return useMemo(() => {
    if (!readingMode || !data) return OPEN_GATE

    const chapterNumberById = new Map(data.chapters.map((c) => [c.id, c.number]))
    const sortKeyByEvent = sortKeysByEvent(data.events, chapterNumberById)

    const cursor = activeEventId ? sortKeyByEvent.get(activeEventId) ?? null : null
    const cursorEvent = activeEventId ? data.events.find((e) => e.id === activeEventId) : undefined
    const chapterNumber = cursorEvent ? chapterNumberById.get(cursorEvent.chapterId) ?? null : null

    // Every way an entity can be tied to a moment in the story. A character
    // counts as met when they are on stage or their state is recorded — being
    // *mentioned* deliberately does not reveal them, since a name dropped in
    // dialogue is exactly the kind of foreshadowing a reader should meet in the
    // book rather than in an index.
    const appearances: Appearance[] = []
    for (const ev of data.events) {
      for (const id of ev.involvedCharacterIds) appearances.push({ entityId: id, eventId: ev.id })
      if (ev.povCharacterId) appearances.push({ entityId: ev.povCharacterId, eventId: ev.id })
      for (const id of ev.involvedItemIds) appearances.push({ entityId: id, eventId: ev.id })
      if (ev.locationMarkerId) appearances.push({ entityId: ev.locationMarkerId, eventId: ev.id })
    }
    for (const s of data.charSnaps) {
      appearances.push({ entityId: s.characterId, eventId: s.eventId })
      if (s.currentLocationMarkerId) {
        appearances.push({ entityId: s.currentLocationMarkerId, eventId: s.eventId })
      }
      for (const id of s.inventoryItemIds) appearances.push({ entityId: id, eventId: s.eventId })
    }
    for (const p of data.itemPlacements) appearances.push({ entityId: p.itemId, eventId: p.eventId })
    for (const s of data.itemSnaps) appearances.push({ entityId: s.itemId, eventId: s.eventId })
    for (const s of data.locSnaps) {
      appearances.push({ entityId: s.locationMarkerId, eventId: s.eventId })
    }

    const firstSeen = firstAppearances(appearances, sortKeyByEvent)

    return {
      active: true,
      cursor,
      chapterNumber,
      isRevealed: (entityId: string) => isRevealed(entityId, firstSeen, cursor),
      filter: <T extends { id: string }>(records: readonly T[]) => revealed(records, firstSeen, cursor),
      hidden: <T extends { id: string }>(records: readonly T[]) => hiddenCount(records, firstSeen, cursor),
    }
  }, [readingMode, data, activeEventId])
}
