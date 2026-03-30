import { X, MapPin, Package, Heart, HeartOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PortraitImage } from '@/components/PortraitImage'
import { useCharacterRelationships } from '@/db/hooks/useRelationships'
import { useItems } from '@/db/hooks/useItems'
import type { Character, CharacterSnapshot, LocationMarker, MapLayer, Relationship } from '@/types'

const SENTIMENT_COLOR: Record<string, string> = {
  positive: '#34d399',
  neutral: '#94a3b8',
  negative: '#f87171',
  complex: '#fbbf24',
}
const STRENGTH_LABEL: Record<string, string> = {
  weak: 'Weak', moderate: 'Moderate', strong: 'Strong', bond: 'Bond',
}

function RelationshipRow({
  rel,
  characterId,
  characters,
}: {
  rel: Relationship
  characterId: string
  characters: Character[]
}) {
  const otherId = rel.characterAId === characterId ? rel.characterBId : rel.characterAId
  const other = characters.find((c) => c.id === otherId)
  if (!other) return null
  const color = SENTIMENT_COLOR[rel.sentiment] ?? '#94a3b8'

  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className="h-2 w-2 rounded-full shrink-0"
        style={{ background: color }}
      />
      <PortraitImage
        imageId={other.portraitImageId}
        className="h-5 w-5 rounded-full object-cover shrink-0"
        fallbackClassName="h-5 w-5 rounded-full shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-[hsl(var(--foreground))]">{other.name}</p>
        <p className="truncate text-[10px] text-[hsl(var(--muted-foreground))]">
          {rel.label} · {STRENGTH_LABEL[rel.strength]}
        </p>
      </div>
    </div>
  )
}

interface CharacterSnapshotPanelProps {
  character: Character
  snapshot: CharacterSnapshot | undefined
  allMarkers: LocationMarker[]
  allLayers: MapLayer[]
  allCharacters: Character[]
  activeChapterTitle: string | null
  worldId: string
  onClose: () => void
}

export function CharacterSnapshotPanel({
  character,
  snapshot,
  allMarkers,
  allLayers,
  allCharacters,
  activeChapterTitle,
  worldId,
  onClose,
}: CharacterSnapshotPanelProps) {
  const relationships = useCharacterRelationships(character.id)
  const items = useItems(worldId)

  const locationMarker = snapshot?.currentLocationMarkerId
    ? allMarkers.find((m) => m.id === snapshot.currentLocationMarkerId)
    : null

  const locationLayer = locationMarker
    ? allLayers.find((l) => l.id === locationMarker.mapLayerId)
    : null

  const inventoryItems = snapshot?.inventoryItemIds
    ? items.filter((it) => snapshot.inventoryItemIds.includes(it.id))
    : []

  return (
    <div className="flex w-72 shrink-0 flex-col border-l border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[hsl(var(--foreground))]">{character.name}</p>
          {activeChapterTitle && (
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Snapshot · {activeChapterTitle}</p>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Portrait */}
        <div className="flex justify-center border-b border-[hsl(var(--border))] p-4">
          <PortraitImage
            imageId={character.portraitImageId}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-[hsl(var(--border))]"
            fallbackClassName="h-24 w-24 rounded-full ring-2 ring-[hsl(var(--border))]"
          />
        </div>

        <div className="flex flex-col gap-4 p-4">
          {/* Alive status */}
          {snapshot && !snapshot.isAlive && (
            <div className="flex items-center gap-1.5 rounded-md bg-red-950/30 px-2 py-1.5">
              <HeartOff className="h-3.5 w-3.5 text-red-400" />
              <span className="text-xs font-medium text-red-400">Deceased</span>
            </div>
          )}
          {snapshot?.isAlive && (
            <div className="flex items-center gap-1.5 rounded-md bg-green-950/30 px-2 py-1.5">
              <Heart className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs font-medium text-green-400">Alive</span>
            </div>
          )}

          {/* Current location */}
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Current Location
            </p>
            {locationMarker ? (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--muted-foreground))]" />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{locationMarker.name}</p>
                  {locationLayer && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{locationLayer.name}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-[hsl(var(--muted-foreground))]">Not placed on map</p>
            )}
          </div>

          {/* Inventory */}
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Inventory
            </p>
            {inventoryItems.length > 0 ? (
              <div className="flex flex-col gap-1">
                {inventoryItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <PortraitImage
                      imageId={item.imageId}
                      fallbackIcon={Package}
                      className="h-5 w-5 rounded object-cover shrink-0"
                      fallbackClassName="h-5 w-5 rounded shrink-0"
                    />
                    <span className="flex-1 truncate text-xs text-[hsl(var(--foreground))]">{item.name}</span>
                    {item.iconType && (
                      <span className="text-[10px] capitalize text-[hsl(var(--muted-foreground))]">{item.iconType}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-[hsl(var(--muted-foreground))]">No items</p>
            )}
            {snapshot?.inventoryNotes && (
              <p className="mt-1.5 text-xs text-[hsl(var(--muted-foreground))]">{snapshot.inventoryNotes}</p>
            )}
          </div>

          {/* Status */}
          {snapshot?.statusNotes && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                Status
              </p>
              <p className="text-xs text-[hsl(var(--foreground))]">{snapshot.statusNotes}</p>
            </div>
          )}

          {/* Relationships */}
          {relationships.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                Relationships
              </p>
              <div className="flex flex-col divide-y divide-[hsl(var(--border))]">
                {relationships.map((rel) => (
                  <RelationshipRow
                    key={rel.id}
                    rel={rel}
                    characterId={character.id}
                    characters={allCharacters}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No snapshot */}
          {!snapshot && (
            <p className="text-xs italic text-[hsl(var(--muted-foreground))]">
              No snapshot for the active chapter.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
