import { useState, useMemo } from "react"
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Users,
  MapPin,
  Clock,
  Eye,
  Copy,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Download,
  Settings
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Progress } from "../ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useNotifications } from "../../contexts/NotificationContext"
import { CreateEventDialog } from "../events/CreateEventDialog"
import { EventDetailsDialog } from "./EventDetailsDialog"

const mockEvents = [
  {
    id: "event-1",
    title: "Annual Alumni Gala",
    description: "Join us for an evening of networking, dinner, and celebration",
    date: "2024-03-15T19:00:00Z",
    endDate: "2024-03-15T23:00:00Z",
    location: "Grand Ballroom, Downtown Hotel",
    type: "Networking",
    category: "Social",
    status: "active",
    capacity: 300,
    registered: 245,
    attended: 0,
    organizer: {
      name: "Sarah Johnson",
      email: "sarah.j@university.edu",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    featured: true,
    ticketPrice: 75,
    createdDate: "2024-01-10T10:00:00Z",
    registrationDeadline: "2024-03-10T23:59:59Z",
    tags: ["Networking", "Gala", "Alumni", "Annual"]
  },
  {
    id: "event-2",
    title: "Tech Career Fair",
    description: "Meet with top employers in the technology industry",
    date: "2024-02-28T10:00:00Z",
    endDate: "2024-02-28T16:00:00Z",
    location: "University Student Center",
    type: "Career",
    category: "Professional",
    status: "completed",
    capacity: 500,
    registered: 389,
    attended: 356,
    organizer: {
      name: "Michael Chen",
      email: "michael.chen@university.edu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    featured: false,
    ticketPrice: 0,
    createdDate: "2023-12-15T14:00:00Z",
    registrationDeadline: "2024-02-25T23:59:59Z",
    tags: ["Career", "Technology", "Job Fair", "Employers"]
  },
  {
    id: "event-3",
    title: "Startup Pitch Night",
    description: "Alumni entrepreneurs pitch their startups to investors",
    date: "2024-02-20T18:00:00Z",
    endDate: "2024-02-20T21:00:00Z",
    location: "Innovation Hub, Building A",
    type: "Entrepreneurship",
    category: "Business",
    status: "completed",
    capacity: 150,
    registered: 134,
    attended: 128,
    organizer: {
      name: "Lisa Wang",
      email: "lisa.wang@university.edu",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    featured: true,
    ticketPrice: 25,
    createdDate: "2024-01-05T09:00:00Z",
    registrationDeadline: "2024-02-18T23:59:59Z",
    tags: ["Startup", "Entrepreneurship", "Pitch", "Investment"]
  },
  {
    id: "event-4",
    title: "Class of 2020 Reunion",
    description: "Reconnect with your classmates and celebrate your journey",
    date: "2024-04-05T17:00:00Z",
    endDate: "2024-04-05T22:00:00Z",
    location: "Alumni House Garden",
    type: "Reunion",
    category: "Social",
    status: "active",
    capacity: 200,
    registered: 156,
    attended: 0,
    organizer: {
      name: "David Rodriguez",
      email: "david.r@university.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    featured: false,
    ticketPrice: 50,
    createdDate: "2024-02-01T11:00:00Z",
    registrationDeadline: "2024-04-01T23:59:59Z",
    tags: ["Reunion", "Class of 2020", "Alumni", "Social"]
  },
  {
    id: "event-5",
    title: "Women in Leadership Workshop",
    description: "Empowering women alumni with leadership skills and networking",
    date: "2024-03-22T13:00:00Z",
    endDate: "2024-03-22T17:00:00Z",
    location: "Conference Room B, Main Campus",
    type: "Workshop",
    category: "Professional",
    status: "draft",
    capacity: 80,
    registered: 0,
    attended: 0,
    organizer: {
      name: "Jennifer Martinez",
      email: "jennifer.m@university.edu",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    featured: false,
    ticketPrice: 0,
    createdDate: "2024-02-12T16:00:00Z",
    registrationDeadline: "2024-03-20T23:59:59Z",
    tags: ["Women", "Leadership", "Workshop", "Professional Development"]
  }
]

interface EventManagementProps {
  className?: string
}

export function EventManagement({ className }: EventManagementProps) {
  const { addNotification } = useNotifications()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = mockEvents

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(event => event.type === typeFilter)
    }

    return filtered
  }, [searchQuery, statusFilter, typeFilter])

  const stats = {
    total: mockEvents.length,
    active: mockEvents.filter(e => e.status === "active").length,
    completed: mockEvents.filter(e => e.status === "completed").length,
    draft: mockEvents.filter(e => e.status === "draft").length,
    totalRegistrations: mockEvents.reduce((sum, e) => sum + e.registered, 0),
    totalAttendance: mockEvents.reduce((sum, e) => sum + e.attended, 0),
    averageAttendance: mockEvents.filter(e => e.attended > 0).length > 0 
      ? Math.round(mockEvents.reduce((sum, e) => sum + (e.attended / e.registered * 100), 0) / mockEvents.filter(e => e.attended > 0).length)
      : 0
  }

  const eventTypes = [...new Set(mockEvents.map(e => e.type))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Networking": return "bg-blue-100 text-blue-800"
      case "Career": return "bg-green-100 text-green-800"
      case "Entrepreneurship": return "bg-purple-100 text-purple-800"
      case "Reunion": return "bg-pink-100 text-pink-800"
      case "Workshop": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const calculateProgress = (registered: number, capacity: number) => {
    return capacity > 0 ? (registered / capacity) * 100 : 0
  }

  const calculateAttendanceRate = (attended: number, registered: number) => {
    return registered > 0 ? Math.round((attended / registered) * 100) : 0
  }

  const handleEventAction = (action: string, event: any) => {
    switch (action) {
      case "view":
        setSelectedEvent(event)
        setShowEventDetails(true)
        break
      case "edit":
        // Open edit dialog
        addNotification({
          type: "system",
          title: "Feature coming soon",
          description: "Event editing functionality is being developed",
          isRead: false
        })
        break
      case "duplicate":
        addNotification({
          type: "system",
          title: "Event duplicated",
          description: `${event.title} has been duplicated successfully`,
          isRead: false
        })
        break
      case "cancel":
        addNotification({
          type: "system",
          title: "Event cancelled",
          description: `${event.title} has been cancelled`,
          isRead: false
        })
        break
      case "delete":
        addNotification({
          type: "system",
          title: "Event deleted",
          description: `${event.title} has been deleted`,
          isRead: false
        })
        break
      default:
        break
    }
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Event Management</h1>
            <p className="text-muted-foreground">
              Create, manage, and track alumni events and activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => setShowCreateEvent(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-lg font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-lg font-bold">{stats.draft}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-lg font-bold">{stats.totalRegistrations}</p>
              <p className="text-xs text-muted-foreground">Registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-lg font-bold">{stats.totalAttendance}</p>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-lg font-bold">{stats.averageAttendance}%</p>
              <p className="text-xs text-muted-foreground">Avg Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">All Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search events by title, location, or organizer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{event.title}</p>
                              {event.featured && (
                                <Badge variant="secondary" className="text-xs">Featured</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getTypeColor(event.type)} variant="outline">
                                {event.type}
                              </Badge>
                              {event.ticketPrice > 0 ? (
                                <span className="text-xs text-muted-foreground">${event.ticketPrice}</span>
                              ) : (
                                <span className="text-xs text-green-600">Free</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(event.date)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.date).toLocaleDateString() === new Date(event.endDate).toLocaleDateString() 
                                ? `${new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(event.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                : `Multi-day event`
                              }
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{event.registered}/{event.capacity}</span>
                              <span>{Math.round(calculateProgress(event.registered, event.capacity))}%</span>
                            </div>
                            <Progress value={calculateProgress(event.registered, event.capacity)} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {event.status === "completed" ? (
                            <div className="text-sm">
                              <p>{event.attended} attended</p>
                              <p className="text-xs text-muted-foreground">
                                {calculateAttendanceRate(event.attended, event.registered)}% rate
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">TBD</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                              <AvatarFallback className="text-xs">
                                {event.organizer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{event.organizer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEventAction("view", event)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEventAction("edit", event)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEventAction("duplicate", event)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {event.status === "active" && (
                                <DropdownMenuItem onClick={() => handleEventAction("cancel", event)}>
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Cancel Event
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleEventAction("delete", event)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Performing Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Performing Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents
                      .filter(e => e.status === "completed")
                      .sort((a, b) => calculateAttendanceRate(b.attended, b.registered) - calculateAttendanceRate(a.attended, a.registered))
                      .slice(0, 5)
                      .map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{event.attended} attended</span>
                              <span>•</span>
                              <span>{formatDate(event.date)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{calculateAttendanceRate(event.attended, event.registered)}%</p>
                            <p className="text-xs text-muted-foreground">attendance</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Event Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventTypes.map((type) => {
                      const eventsOfType = mockEvents.filter(e => e.type === type)
                      const totalRegistrations = eventsOfType.reduce((sum, e) => sum + e.registered, 0)
                      
                      return (
                        <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{type}</h4>
                            <p className="text-xs text-muted-foreground">
                              {eventsOfType.length} events
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{totalRegistrations}</p>
                            <p className="text-xs text-muted-foreground">registrations</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateEventDialog
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
      />

      <EventDetailsDialog
        open={showEventDetails}
        onOpenChange={setShowEventDetails}
        event={selectedEvent}
      />
    </div>
  )
}