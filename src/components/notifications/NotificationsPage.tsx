import { useState, useMemo } from "react"
import { Bell, Check, X, Filter, Search, Settings, MessageCircle, Calendar, Users, UserPlus, Briefcase, Star } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { useAuth } from "../../contexts/AuthContext"
import { useNotifications } from "../../contexts/NotificationContext"
import { NotificationItem } from "./NotificationItem"



const notificationTypes = {
  all: { label: "All", icon: Bell },
  message: { label: "Messages", icon: MessageCircle },
  connection_request: { label: "Connections", icon: UserPlus },
  connection_accepted: { label: "Connections", icon: Users },
  event: { label: "Events", icon: Calendar },
  event_reminder: { label: "Events", icon: Calendar },
  job: { label: "Jobs", icon: Briefcase },
  system: { label: "System", icon: Star }
}

interface NotificationsPageProps {
  className?: string
}

export function NotificationsPage({ className }: NotificationsPageProps) {
  const { user } = useAuth()
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getNotificationsByType 
  } = useNotifications()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(notification => notification.type === selectedType)
    }

    // Filter by unread status
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.isRead)
    }

    return filtered
  }, [searchQuery, selectedType, showUnreadOnly])

  // Statistics
  const totalNotifications = notifications.length
  const todayCount = notifications.filter(n => {
    const notificationDate = new Date(n.timestamp)
    const today = new Date()
    return notificationDate.toDateString() === today.toDateString()
  }).length

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId)
  }

  const handleNotificationClick = (notification: any) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
    // In a real app, navigate to the action URL
    console.log(`Navigating to ${notification.actionUrl}`)
  }

  return (
    <div className={className}>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with messages, events, and opportunities
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
                  <DropdownMenuItem>Email Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Privacy Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">{totalNotifications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unread</p>
                    <p className="font-medium">{unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today</p>
                    <p className="font-medium">{todayCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      {notificationTypes[selectedType as keyof typeof notificationTypes]?.label || "Filter"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(notificationTypes).map(([key, type]) => {
                      const Icon = type.icon
                      return (
                        <DropdownMenuItem
                          key={key}
                          onClick={() => setSelectedType(key)}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant={showUnreadOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                >
                  Unread only
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="flex-1 min-h-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                {selectedType !== "all" && ` • ${notificationTypes[selectedType as keyof typeof notificationTypes]?.label}`}
                {showUnreadOnly && " • Unread only"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {filteredNotifications.length > 0 ? (
              <div>
                {filteredNotifications.map((notification, index) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    onDelete={() => handleDeleteNotification(notification.id)}
                    isLast={index === filteredNotifications.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedType !== "all" || showUnreadOnly 
                      ? "Try adjusting your filters or search criteria."
                      : "You're all caught up! New notifications will appear here."
                    }
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}