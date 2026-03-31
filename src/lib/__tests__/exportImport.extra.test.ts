import 'fake-indexeddb/auto'
import { describe, it, expect } from 'vitest'
import { importWorld, type WorldExportFile } from '@/lib/exportImport'
import { db } from '@/db/database'

// ── helpers ───────────────────────────────────────────────────────────────────

function makeExport(overrides: Partial<WorldExportFile> = {}): WorldExportFile {
  return {
    version: 1,
    exportedAt: Date.now(),
    world: { id: 'world-extra', name: 'Extra World', description: '', createdAt: 1000, updatedAt: 1000 },
    mapLayers: [],
    locationMarkers: [],
    characters: [],
    items: [],
    characterSnapshots: [],
    characterMovements: [],
    itemPlacements: [],
    relationships: [],
    timelines: [],
    chapters: [],
    events: [],
    blobs: [],
    ...overrides,
  }
}

function makeFile(data: unknown): File {
  return new File([JSON.stringify(data)], 'export.wbk', { type: 'application/json' })
}

// ── normalizeImport backfill paths ────────────────────────────────────────────

describe('importWorld — normalizeImport backfills', () => {
  it('defaults itemPlacements to [] when absent', async () => {
    await db.delete()
    await db.open()

    const { itemPlacements: _ip, ...without } = makeExport()
    const worldId = await importWorld(makeFile(without))
    expect(worldId).toBe('world-extra')

    const placements = await db.itemPlacements.where('worldId').equals('world-extra').toArray()
    expect(placements).toHaveLength(0)
  })

  it('defaults relationshipSnapshots to [] when absent', async () => {
    await db.delete()
    await db.open()

    const { relationshipSnapshots: _rs, ...without } = makeExport()
    const worldId = await importWorld(makeFile(without))
    expect(worldId).toBe('world-extra')
  })

  it('defaults locationSnapshots to [] when absent', async () => {
    await db.delete()
    await db.open()

    const { locationSnapshots: _ls, ...without } = makeExport()
    const worldId = await importWorld(makeFile(without))
    expect(worldId).toBe('world-extra')

    const snaps = await db.locationSnapshots.where('worldId').equals('world-extra').toArray()
    expect(snaps).toHaveLength(0)
  })

  it('defaults itemSnapshots to [] when absent', async () => {
    await db.delete()
    await db.open()

    const { itemSnapshots: _is, ...without } = makeExport()
    const worldId = await importWorld(makeFile(without))
    expect(worldId).toBe('world-extra')

    const snaps = await db.itemSnapshots.where('worldId').equals('world-extra').toArray()
    expect(snaps).toHaveLength(0)
  })

  it('backfills startChapterId on relationships that lack it', async () => {
    await db.delete()
    await db.open()

    const data = makeExport({
      relationships: [{
        id: 'rel-old',
        worldId: 'world-extra',
        characterAId: 'c1',
        characterBId: 'c2',
        label: 'Old bond',
        strength: 'strong',
        sentiment: 'positive',
        description: '',
        isBidirectional: true,
        createdAt: 1000,
        updatedAt: 1000,
        // deliberately omit startChapterId — simulates pre-feature export
      } as never],
    })
    await importWorld(makeFile(data))

    const stored = await db.relationships.get('rel-old')
    expect(stored).toBeDefined()
    // normalizeImport should have backfilled startChapterId to null
    expect((stored as Record<string, unknown>).startChapterId).toBeNull()
  })

  it('backfills scalePixelsPerUnit and scaleUnit on old map layers', async () => {
    await db.delete()
    await db.open()

    const data = makeExport({
      mapLayers: [{
        id: 'layer-old',
        worldId: 'world-extra',
        parentMapId: null,
        name: 'Old Layer',
        description: '',
        imageId: 'img-1',
        imageWidth: 800,
        imageHeight: 600,
        createdAt: 1000,
        updatedAt: 1000,
        // deliberately omit scalePixelsPerUnit and scaleUnit
      } as never],
    })
    await importWorld(makeFile(data))

    const stored = await db.mapLayers.get('layer-old')
    expect(stored).toBeDefined()
    expect((stored as Record<string, unknown>).scalePixelsPerUnit).toBeNull()
    expect((stored as Record<string, unknown>).scaleUnit).toBeNull()
  })

  it('rejects when itemPlacements is present but not an array', async () => {
    const bad = { ...makeExport(), itemPlacements: 'bad' }
    await expect(importWorld(makeFile(bad))).rejects.toThrow('itemPlacements is not an array')
  })

  it('rejects when relationshipSnapshots is present but not an array', async () => {
    const bad = { ...makeExport(), relationshipSnapshots: 'bad' }
    await expect(importWorld(makeFile(bad))).rejects.toThrow('relationshipSnapshots is not an array')
  })

  it('rejects when locationSnapshots is present but not an array', async () => {
    const bad = { ...makeExport(), locationSnapshots: 'bad' }
    await expect(importWorld(makeFile(bad))).rejects.toThrow('locationSnapshots is not an array')
  })

  it('rejects when itemSnapshots is present but not an array', async () => {
    const bad = { ...makeExport(), itemSnapshots: 'bad' }
    await expect(importWorld(makeFile(bad))).rejects.toThrow('itemSnapshots is not an array')
  })
})

// ── relationshipPositions persisted in localStorage ───────────────────────────

describe('importWorld — relationshipPositions', () => {
  it('stores relationshipPositions in localStorage when present', async () => {
    await db.delete()
    await db.open()

    const positions = { 'rel-1': { x: 100, y: 200 }, 'rel-2': { x: 300, y: 400 } }
    const data = makeExport({ relationshipPositions: positions })
    await importWorld(makeFile(data))

    const stored = localStorage.getItem('wb-rel-pos-world-extra')
    expect(stored).not.toBeNull()
    expect(JSON.parse(stored!)).toEqual(positions)
  })

  it('does not write to localStorage when relationshipPositions is absent', async () => {
    await db.delete()
    await db.open()
    localStorage.removeItem('wb-rel-pos-world-extra')

    await importWorld(makeFile(makeExport()))
    expect(localStorage.getItem('wb-rel-pos-world-extra')).toBeNull()
  })
})

// ── full round-trip with all optional arrays populated ────────────────────────

describe('importWorld — full optional arrays', () => {
  it('imports relationships, timelines, chapters, and events correctly', async () => {
    await db.delete()
    await db.open()

    const data = makeExport({
      timelines: [{
        id: 'tl-1', worldId: 'world-extra', name: 'Main', description: '', color: '#f00', createdAt: 1000,
      }],
      chapters: [{
        id: 'ch-1', worldId: 'world-extra', timelineId: 'tl-1', number: 1,
        title: 'Chapter One', synopsis: '', createdAt: 1000, updatedAt: 1000,
      }],
      events: [{
        id: 'ev-1', worldId: 'world-extra', chapterId: 'ch-1', timelineId: 'tl-1',
        title: 'Battle Begins', description: '', locationMarkerId: null,
        involvedCharacterIds: [], involvedItemIds: [], tags: [], sortOrder: 0,
        createdAt: 1000, updatedAt: 1000,
      }],
    })

    await importWorld(makeFile(data))

    const tl = await db.timelines.get('tl-1')
    expect(tl!.name).toBe('Main')

    const ch = await db.chapters.get('ch-1')
    expect(ch!.title).toBe('Chapter One')

    const ev = await db.events.get('ev-1')
    expect(ev!.title).toBe('Battle Begins')
  })
})
