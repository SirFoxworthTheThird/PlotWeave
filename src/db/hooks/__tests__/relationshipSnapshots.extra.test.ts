import { describe, it, expect } from 'vitest'
import { selectBestSnapshots } from '@/db/hooks/useRelationshipSnapshots'
import type { RelationshipSnapshot } from '@/types'

// Covers the branch in selectBestSnapshots where activeChapterId is provided
// but is NOT found in the allChapters list (chapters not loaded yet).

const NOW = Date.now()

function makeSnap(overrides: Partial<RelationshipSnapshot> & {
  relationshipId: string; chapterId: string
}): RelationshipSnapshot {
  return {
    id: `snap-${Math.random()}`,
    worldId: 'world-1',
    label: 'Friends',
    strength: 'moderate',
    sentiment: 'positive',
    description: '',
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }
}

const CHAPTERS = [
  { id: 'ch-1', number: 1 },
  { id: 'ch-3', number: 3 },
]

describe('selectBestSnapshots — edge case: chapter not found in allChapters', () => {
  it('falls back to exact-match only when activeChapterId is not in allChapters', () => {
    // 'ch-99' is not in CHAPTERS, so exact-match fallback applies
    const snaps = [
      makeSnap({ relationshipId: 'rel-1', chapterId: 'ch-1', label: 'Earlier' }),
      makeSnap({ relationshipId: 'rel-1', chapterId: 'ch-99', label: 'Exact match on unknown chapter' }),
    ]
    const result = selectBestSnapshots(snaps, 'ch-99', CHAPTERS)
    // Only the exact match for 'ch-99' should be returned
    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('Exact match on unknown chapter')
    expect(result[0].chapterId).toBe('ch-99')
  })

  it('returns empty array when activeChapterId is unknown and no exact match exists', () => {
    const snaps = [
      makeSnap({ relationshipId: 'rel-1', chapterId: 'ch-1', label: 'Earlier' }),
    ]
    // 'ch-99' not in CHAPTERS, and no snap has chapterId === 'ch-99'
    const result = selectBestSnapshots(snaps, 'ch-99', CHAPTERS)
    expect(result).toHaveLength(0)
  })

  it('handles multiple relationships in exact-match fallback mode', () => {
    const snaps = [
      makeSnap({ relationshipId: 'rel-1', chapterId: 'ch-99', label: 'Rel1' }),
      makeSnap({ relationshipId: 'rel-2', chapterId: 'ch-1',  label: 'Rel2 no match' }),
    ]
    const result = selectBestSnapshots(snaps, 'ch-99', CHAPTERS)
    expect(result).toHaveLength(1)
    expect(result[0].relationshipId).toBe('rel-1')
  })
})

describe('selectBestSnapshots — empty all[] fast path', () => {
  it('returns the same empty array reference immediately', () => {
    const empty: RelationshipSnapshot[] = []
    const result = selectBestSnapshots(empty, 'ch-1', CHAPTERS)
    expect(result).toBe(empty) // identity check: same reference returned
  })
})
