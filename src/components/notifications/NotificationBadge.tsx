import { Badge } from "../ui/badge"
import { cn } from "../ui/utils"

interface NotificationBadgeProps {
  count: number
  className?: string
  showZero?: boolean
  maxCount?: number
}

export function NotificationBadge({ 
  count, 
  className, 
  showZero = false, 
  maxCount = 99 
}: NotificationBadgeProps) {
  if (count === 0 && !showZero) {
    return null
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count

  return (
    <Badge 
      className={cn(
        "h-4 w-4 p-0 flex items-center justify-center text-xs font-medium",
        "bg-red-500 text-white border-red-500 hover:bg-red-600",
        "absolute -top-1 -right-1",
        className
      )}
    >
      {displayCount}
    </Badge>
  )
}