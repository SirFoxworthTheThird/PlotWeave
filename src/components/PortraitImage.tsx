import { useBlobUrl } from '@/db/hooks/useBlobs'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface PortraitImageProps {
  imageId: string | null | undefined
  alt?: string
  className?: string
  fallbackClassName?: string
  fallbackIcon?: LucideIcon
}

export function PortraitImage({ imageId, alt, className, fallbackClassName, fallbackIcon: Icon = User }: PortraitImageProps) {
  const url = useBlobUrl(imageId ?? null)

  if (!url) {
    return (
      <div className={cn('flex items-center justify-center bg-[hsl(var(--muted))]', fallbackClassName ?? className)}>
        <Icon className="h-1/2 w-1/2 text-[hsl(var(--muted-foreground))]" />
      </div>
    )
  }

  return <img src={url} alt={alt ?? ''} className={cn('object-cover', className)} />
}
