export function formatShortNumber(n: number): string {
  if (n < 1000) return String(n)
  const units = ["", "K", "M", "B", "T"]
  const order = Math.min(Math.floor(Math.log10(n) / 3), units.length - 1)
  const num = n / Math.pow(10, order * 3)
  const fixed = num >= 10 || order === 0 ? num.toFixed(0) : num.toFixed(1)
  return `${fixed}${units[order]}`
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diff / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  if (day > 365) return `${Math.floor(day / 365)} years ago`
  if (day > 30) return `${Math.floor(day / 30)} months ago`
  if (day > 0) return `${day} days ago`
  if (hr > 0) return `${hr} hours ago`
  if (min > 0) return `${min} minutes ago`
  return `just now`
}
