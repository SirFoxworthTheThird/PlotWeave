import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { db } from '@/db/database'
import { createWorld, deleteWorld } from '@/db/hooks/useWorlds'
import { createCharacter, updateCharacter, deleteCharacter } from '@/db/hooks/useCharacters'
import {
  listOperations, operationsForEntity, listTombstones, isDeleted, pruneJournal, clearJournal,
} from '@/db/hooks/useOperations'
import { replay, invertOperation } from '@/lib/operations'
import { getDeviceId } from '@/lib/deviceId'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

afterAll(async () => {
  await db.delete()
})

async function seed() {
  const world = await createWorld({ name: 'Journal World', description: '' })
  return world
}

describe('journalled character writes', () => {
  it('records a create alongside the record, in one transaction', async () => {
    const world = await seed()
    const char = await createCharacter({ worldId: world.id, name: 'Vela', description: '' })

    const ops = await operationsForEntity('character', char.id)
    expect(ops).toHaveLength(1)
    expect(ops[0]).toMatchObject({
      type: 'create',
      entityType: 'character',
      entityId: char.id,
      worldId: world.id,
      baseVersion: 0,
      deviceId: getDeviceId(),
    })
    expect(char.version).toBe(1)
  })

  it('records an update with its base version and changed fields', async () => {
    const world = await seed()
    const char = await createCharacter({ worldId: world.id, name: 'Vela', description: '' })
    await updateCharacter(char.id, { name: 'Vela Reyn' })

    const ops = await operationsForEntity('character', char.id)
    expect(ops.map((o) => o.type)).toEqual(['create', 'update'])
    expect(ops[1].baseVersion).toBe(1)
    expect(ops[1].changedFields).toContain('name')
    expect((await db.characters.get(char.id))?.version).toBe(2)
  })

  it('records a delete with the whole prior record, plus a tombstone', async () => {
    const world = await seed()
    const char = await createCharacter({ worldId: world.id, name: 'Vela', description: '' })
    await deleteCharacter(char.id)

    const ops = await operationsForEntity('character', char.id)
    expect(ops.map((o) => o.type)).toEqual(['create', 'delete'])
    // The payload carries enough to rebuild the record.
    expect(ops[1].payload).toMatchObject({ id: char.id, name: 'Vela' })

    expect(await isDeleted('character', char.id)).toBe(true)
    const stones = await listTombstones(world.id)
    expect(stones).toHaveLength(1)
    expect(stones[0]).toMatchObject({ entityId: char.id, entityType: 'character' })
  })

  it('assigns monotonic sequence numbers per world', async () => {
    const world = await seed()
    const a = await createCharacter({ worldId: world.id, name: 'A', description: '' })
    const b = await createCharacter({ worldId: world.id, name: 'B', description: '' })
    await updateCharacter(a.id, { description: 'x' })

    const seqs = (await listOperations(world.id)).map((o) => o.seq)
    expect(seqs).toEqual([1, 2, 3])
    expect(b.id).not.toBe(a.id)
  })

  it('keeps each world on its own sequence', async () => {
    const w1 = await createWorld({ name: 'One', description: '' })
    const w2 = await createWorld({ name: 'Two', description: '' })
    await createCharacter({ worldId: w1.id, name: 'A', description: '' })
    await createCharacter({ worldId: w2.id, name: 'B', description: '' })

    expect((await listOperations(w1.id)).map((o) => o.seq)).toEqual([1])
    expect((await listOperations(w2.id)).map((o) => o.seq)).toEqual([1])
  })

  it('journals nothing when the target does not exist', async () => {
    const world = await seed()
    await updateCharacter('missing', { name: 'x' })
    await deleteCharacter('missing')
    expect(await listOperations(world.id)).toHaveLength(0)
  })
})

describe('replay against the real journal', () => {
  it('rebuilds the current record from its operations alone', async () => {
    const world = await seed()
    const char = await createCharacter({ worldId: world.id, name: 'Vela', description: 'a knight' })
    await updateCharacter(char.id, { name: 'Vela Reyn' })
    await updateCharacter(char.id, { tags: ['exile'] })

    const ops = await operationsForEntity('character', char.id)
    const rebuilt = replay<{ id: string; version: number; name: string; tags: string[] }>(undefined, ops)
    const actual = await db.characters.get(char.id)

    expect(rebuilt?.name).toBe(actual?.name)
    expect(rebuilt?.tags).toEqual(actual?.tags)
    expect(rebuilt?.version).toBe(actual?.version)
  })

  it('replaying the journal twice is safe', async () => {
    const world = await seed()
    const char = await createCharacter({ worldId: world.id, name: 'Vela', description: '' })
    await updateCharacter(char.id, { name: 'Vela Reyn' })

    const ops = await operationsForEntity('character', char.id)
    const once = replay<{ id: string; version: number; name: string }>(undefined, ops)!
    const twice = replay<{ id: string; version: number; name: string }>(once, ops)
    expect(twice).toEqual(once)
  })

  it('an inverted delete restores the record as it was', async () => {
    const world = await seed()
    const char = await createCharacter({ worldId: world.id, name: 'Vela', description: 'a knight' })
    await updateCharacter(char.id, { tags: ['exile'] })
    const before = await db.characters.get(char.id)
    await deleteCharacter(char.id)

    const ops = await operationsForEntity('character', char.id)
    const del = ops.find((o) => o.type === 'delete')!
    const undo = invertOperation(del, undefined, { id: 'undo', seq: 99 })!
    expect(undo.type).toBe('create')
    expect(undo.payload).toMatchObject({ id: char.id, name: 'Vela', tags: ['exile'] })
    expect((undo.payload as { version: number }).version).toBe(before?.version)
  })
})

describe('journal maintenance', () => {
  it('prunes old entries but keeps the newest per entity', async () => {
    const world = await seed()
    const a = await createCharacter({ worldId: world.id, name: 'A', description: '' })
    const b = await createCharacter({ worldId: world.id, name: 'B', description: '' })
    for (let i = 0; i < 6; i++) await updateCharacter(a.id, { description: `v${i}` })

    const before = await listOperations(world.id)
    expect(before.length).toBe(8)

    const removed = await pruneJournal(world.id, 3)
    expect(removed).toBeGreaterThan(0)

    const after = await listOperations(world.id)
    // Both entities still explainable: each retains at least its newest entry.
    const entities = new Set(after.map((o) => o.entityId))
    expect(entities.has(a.id)).toBe(true)
    expect(entities.has(b.id)).toBe(true)
    expect(after.length).toBeLessThan(before.length)
  })

  it('does nothing when the journal is already short', async () => {
    const world = await seed()
    await createCharacter({ worldId: world.id, name: 'A', description: '' })
    expect(await pruneJournal(world.id, 500)).toBe(0)
  })

  it('clearJournal drops operations and tombstones for one world only', async () => {
    const w1 = await createWorld({ name: 'One', description: '' })
    const w2 = await createWorld({ name: 'Two', description: '' })
    const c1 = await createCharacter({ worldId: w1.id, name: 'A', description: '' })
    await createCharacter({ worldId: w2.id, name: 'B', description: '' })
    await deleteCharacter(c1.id)

    await clearJournal(w1.id)
    expect(await listOperations(w1.id)).toHaveLength(0)
    expect(await listTombstones(w1.id)).toHaveLength(0)
    expect(await listOperations(w2.id)).toHaveLength(1)
  })

  it('deleting a world takes its journal with it', async () => {
    const world = await seed()
    const char = await createCharacter({ worldId: world.id, name: 'A', description: '' })
    await deleteCharacter(char.id)
    expect(await db.operations.count()).toBeGreaterThan(0)

    await deleteWorld(world.id)
    expect(await db.operations.count()).toBe(0)
    expect(await db.tombstones.count()).toBe(0)
  })
})

describe('records predating the journal', () => {
  it('treats a missing version as 1 and journals from there', async () => {
    const world = await seed()
    const char = await createCharacter({ worldId: world.id, name: 'Vela', description: '' })
    // Simulate a pre-v52 record (or an older .pwk import) with no version.
    await db.characters.update(char.id, { version: undefined })
    expect((await db.characters.get(char.id))?.version).toBeUndefined()

    await updateCharacter(char.id, { name: 'Vela Reyn' })
    const ops = await operationsForEntity('character', char.id)
    const update = ops.find((o) => o.type === 'update')!
    expect(update.baseVersion).toBe(1)
    expect((await db.characters.get(char.id))?.version).toBe(2)
  })
})
