import { 
  MessageCircle, 
  Calendar, 
  Users, 
  UserPlus, 
  Briefcase, 
  Star, 
  Check, 
  X, 
  MoreHorizontal,
  Clock,
  MapPin,
  Building2,
  TrendingUp
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { cn } from "../ui/utils"

// Simple date formatting function
const formatNotificationTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return "now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString()
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return MessageCircle
    case "connection_request":
    case "connection_accepted":
      return type === "connection_request" ? UserPlus : Users
    case "event":
    case "event_reminder":
      return Calendar
    case "job":
      return Briefcase
    case "system":
      return Star
    default:
      return Star
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "message":
      return "text-blue-600 bg-blue-100"
    case "connection_request":
      return "text-green-600 bg-green-100"
    case "connection_accepted":
      return "text-green-600 bg-green-100"
    case "event":
    case "event_reminder":
      return "text-purple-600 bg-purple-100"
    case "job":
      return "text-orange-600 bg-orange-100"
    case "system":
      return "text-indigo-600 bg-indigo-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
}

interface NotificationItemProps {
  notification: {
    id: string
    type: string
    title: string
    description: string
    timestamp: string
    isRead: boolean
    actionUrl: string
    avatar?: string
    metadata?: any
  }
  onClick: () => void
  onMarkAsRead: () => void
  onDelete: () => void
  isLast?: boolean
}

export function NotificationItem({ 
  notification, 
  onClick, 
  onMarkAsRead, 
  onDelete,
  isLast = false 
}: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type)
  const iconColorClass = getNotificationColor(notification.type)

  const renderNotificationContent = () => {
    const { metadata } = notification

    switch (notification.type) {
      case "message":
        return (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{notification.title}</h4>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {notification.description}
            </p>
            {metadata?.messagePreview && (
              <div className="bg-muted/50 p-2 rounded text-sm italic">
                "{metadata.messagePreview}"
              </div>
            )}
          </div>
        )

      case "connection_request":
        return (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{notification.title}</h4>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {metadata?.title}
            </p>
            {metadata?.message && (
              <div className="bg-muted/50 p-2 rounded text-sm mb-2">
                "{metadata.message}"
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-7">
                Accept
              </Button>
              <Button variant="outline" size="sm" className="h-7">
                Decline
              </Button>
            </div>
          </div>
        )

      case "connection_accepted":
        return (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{notification.title}</h4>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              )}
              <Badge variant="secondary" className="text-xs">Connected</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {metadata?.title}
            </p>
          </div>
        )

      case "event":
      case "event_reminder":
        return (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{notification.title}</h4>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              )}
              {notification.type === "event_reminder" && (
                <Badge variant="default" className="text-xs">Reminder</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {notification.description}
            </p>
            {metadata && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {metadata.eventDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(metadata.eventDate).toLocaleDateString()}
                  </div>
                )}
                {metadata.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {metadata.location}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "job":
        return (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{notification.title}</h4>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              )}
              {metadata?.matchScore && (
                <Badge variant="secondary" className="text-xs">
                  {metadata.matchScore}% match
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {notification.description}
            </p>
            {metadata && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {metadata.company && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {metadata.company}
                  </div>
                )}
                {metadata.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {metadata.location}
                  </div>
                )}
                {metadata.daysLeft && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <Clock className="h-3 w-3" />
                    {metadata.daysLeft} days left
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "system":
        return (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{notification.title}</h4>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {notification.description}
            </p>
            {metadata?.percentageIncrease && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                +{metadata.percentageIncrease}% increase
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{notification.title}</h4>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {notification.description}
            </p>
          </div>
        )
    }
  }

  return (
    <div 
      className={cn(
        "flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors",
        !notification.isRead && "bg-muted/25",
        !isLast && "border-b"
      )}
      onClick={onClick}
    >
      {/* Avatar or Icon */}
      <div className="flex-shrink-0">
        {notification.avatar ? (
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={notification.avatar} alt="User" />
              <AvatarFallback>
                {getInitials(notification.metadata?.sender || notification.metadata?.requester || "U")}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center",
              iconColorClass
            )}>
              <Icon className="h-3 w-3" />
            </div>
          </div>
        ) : (
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            iconColorClass
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Content */}
      {renderNotificationContent()}

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {formatNotificationTime(notification.timestamp)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!notification.isRead && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onMarkAsRead()
              }}>
                <Check className="h-4 w-4 mr-2" />
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}