import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import type { BlobEntry } from '@/types'
import { generateId } from '@/lib/id'

/** Returns a map of blobId → object URL for all blobs in a world. */
export function useWorldBlobUrls(worldId: string | null): Map<string, string> {
  const entries = useLiveQuery(
    () => (worldId ? db.blobs.where('worldId').equals(worldId).toArray() : []),
    [worldId],
    []
  )
  const map = new Map<string, string>()
  for (const e of entries) {
    map.set(e.id, URL.createObjectURL(e.data))
  }
  return map
}

export function useBlobUrl(id: string | null): string | undefined {
  const entry = useLiveQuery(() => (id ? db.blobs.get(id) : undefined), [id])
  if (!entry) return undefined
  return URL.createObjectURL(entry.data)
}

export async function storeBlob(worldId: string, file: File): Promise<BlobEntry> {
  const entry: BlobEntry = {
    id: generateId(),
    worldId,
    mimeType: file.type,
    data: file,
    createdAt: Date.now(),
  }
  await db.blobs.add(entry)
  return entry
}

export async function deleteBlob(id: string) {
  await db.blobs.delete(id)
}

export async function getBlobUrl(id: string): Promise<string | undefined> {
  const entry = await db.blobs.get(id)
  if (!entry) return undefined
  return URL.createObjectURL(entry.data)
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = reject
    img.src = url
  })
}
