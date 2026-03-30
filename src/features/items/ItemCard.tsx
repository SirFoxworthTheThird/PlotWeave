import { useNavigate, useParams } from 'react-router-dom'
import { Package } from 'lucide-react'
import type { Item } from '@/types'
import { PortraitImage } from '@/components/PortraitImage'

export function ItemCard({ item }: { item: Item }) {
  const navigate = useNavigate()
  const { worldId } = useParams<{ worldId: string }>()

  return (
    <div
      onClick={() => navigate(`/worlds/${worldId}/items/${item.id}`)}
      className="group flex cursor-pointer items-start gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 transition-colors hover:border-[hsl(var(--ring))] hover:bg-[hsl(var(--accent))]"
    >
      <PortraitImage
        imageId={item.imageId}
        alt={item.name}
        className="h-12 w-12 rounded-md object-cover"
        fallbackClassName="h-12 w-12 rounded-md"
        fallbackIcon={Package}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[hsl(var(--foreground))]">{item.name}</p>
        {item.iconType && (
          <p className="text-xs capitalize text-[hsl(var(--muted-foreground))]">{item.iconType}</p>
        )}
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-[hsl(var(--muted-foreground))]">{item.description}</p>
        )}
      </div>
    </div>
  )
}
