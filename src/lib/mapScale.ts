export function pixelDist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export function pathPixelLength(points: [number, number][]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += pixelDist(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1])
  }
  return total
}

export function formatDistance(pixels: number, pixelsPerUnit: number, unit: string): string {
  const dist = pixels / pixelsPerUnit
  return `${dist < 10 ? dist.toFixed(1) : Math.round(dist)} ${unit}`
}
