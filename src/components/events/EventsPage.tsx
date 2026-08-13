import { useState, useMemo, useEffect } from "react"
import { Calendar, MapPin, Users, Clock, Filter, Search, Plus, Bell, Sparkles, ArrowRight, Globe, TrendingUp } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { useAuth } from "../../contexts/AuthContext"
import { EventCard } from "./EventCard"
import { EventDetails } from "./EventDetails"
import { CreateEventDialog } from "./CreateEventDialog"
import { AnnouncementsSection } from "./AnnouncementsSection"
import { useApi } from "../../hooks/useApi"
import { VisuallyHidden } from "../ui/visually-hidden"

interface EventsPageProps {
  className?: string
}

interface ViewEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  endTime?: string
  location: string
  address: string
  type: string
  category: string
  maxAttendees?: number
  currentAttendees: number
  isVirtual: boolean
  image?: string
  organizer: string
  speakers?: string[]
  agenda?: Array<{ time: string; activity: string; speaker?: string }>
  isRegistered?: boolean
  registrationDeadline?: string
  ticketPrice?: number
  tags?: string[]
}

// Map backend Event shape -> shape the EventCard / EventDetails expect
const mapApiEvent = (e: any): ViewEvent => ({
  id: e._id || e.id,
  title: e.title,
  description: e.description,
  date: e.date,
  time: e.time,
  endTime: e.endTime,
  location: e.location || "Online",
  address: e.address || "",
  type: e.type,
  category: e.category,
  maxAttendees: e.capacity,
  currentAttendees: e.registeredCount ?? e.registeredUsers?.length ?? 0,
  isVirtual: e.isVirtual,
  image: e.image,
  organizer: e.organizer?.firstName
    ? `${e.organizer.firstName} ${e.organizer.lastName || ""}`.trim()
    : typeof e.organizer === "string"
      ? e.organizer
      : "WIT Alumni Relations",
  speakers: e.speakers,
  agenda: e.agenda,
  isRegistered: e.isRegistered,
  registrationDeadline: e.registrationDeadline,
  ticketPrice: e.ticketPrice,
  tags: e.tags,
})

export function EventsPage({ className }: EventsPageProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<ViewEvent | null>(null)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")

  const { data: apiEvents, request: fetchEvents, isLoading } = useApi<any[]>()

  useEffect(() => {
    fetchEvents('get', '/events')
  }, [fetchEvents])

  const eventsList = useMemo<ViewEvent[]>(
    () => (apiEvents || []).map(mapApiEvent),
    [apiEvents]
  )

  // Get unique values for filter options
  const categories = [...new Set(eventsList.map(event => event.category))].filter(Boolean)
  const types = [...new Set(eventsList.map(event => event.type))].filter(Boolean)

  // Filter events
  const filteredEvents = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    let filtered = eventsList.filter(event => {
      const matchesSearch =
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
      const matchesType = selectedType === "all" || event.type === selectedType

      const eventDate = event.date ? new Date(event.date).toISOString().split('T')[0] : today
      const isUpcoming = eventDate >= today
      const matchesTab = activeTab === "upcoming" ? isUpcoming : !isUpcoming

      return matchesSearch && matchesCategory && matchesType && matchesTab
    })

    // Sort by date
    filtered.sort((a, b) => {
      if (activeTab === "upcoming") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedType, activeTab, eventsList])

  // Next upcoming event (nearest date) for the featured hero
  const featuredEvent = useMemo(() => {
    const upcoming = eventsList
      .filter(e => new Date(e.date).getTime() >= new Date().setHours(0, 0, 0, 0))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return upcoming[0] || eventsList[0] || null
  }, [eventsList])

  // Stats for the top strip
  const stats = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const upcomingCount = eventsList.filter(e => new Date(e.date).toISOString().split('T')[0] >= today).length
    const totalAttendees = eventsList.reduce((sum, e) => sum + (e.currentAttendees || 0), 0)
    const maxCapacity = eventsList.reduce((sum, e) => sum + (e.maxAttendees || 0), 0)
    const uniqueCategories = new Set(eventsList.map(e => e.category)).size
    return {
      total: eventsList.length,
      upcoming: upcomingCount,
      capacity: maxCapacity,
      categories: uniqueCategories,
      attendees: totalAttendees
    }
  }, [eventsList])

  const activeFiltersCount = [selectedCategory, selectedType].filter(f => f !== "all").length

  const canCreateEvents = user?.role === 'admin' || user?.role === 'alumni'

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl">Events & Announcements</h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
              Stay connected with our community through events, workshops, and important updates.
            </p>
          </div>
          {canCreateEvents && (
            <Button onClick={() => setShowCreateEvent(true)} className="w-full sm:w-auto h-11 sm:h-12">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      {/* Stats strip - fills empty space with useful info */}
      {eventsList.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-6 sm:mb-8 lg:mb-10">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold leading-none">{stats.total}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total Events</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className="rounded-lg bg-blue-500/10 p-2.5">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold leading-none">{stats.upcoming}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className="rounded-lg bg-green-500/10 p-2.5">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold leading-none">{stats.capacity.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Seats Available</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className="rounded-lg bg-purple-500/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold leading-none">{stats.categories}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Categories</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Featured event hero */}
      {featuredEvent && activeTab === "upcoming" && (
        <Card className="mb-6 sm:mb-8 lg:mb-10 overflow-hidden border-0">
          <div className="relative">
            {featuredEvent.image && (
              <div className="absolute inset-0">
                <img
                  src={featuredEvent.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
              </div>
            )}
            <CardContent className="relative p-6 sm:p-10 lg:p-14">
              <div className="max-w-2xl space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured Event
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm">
                    {featuredEvent.type}
                  </Badge>
                  {featuredEvent.isVirtual && (
                    <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm">
                      <Globe className="h-3 w-3 mr-1" />
                      Virtual
                    </Badge>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {featuredEvent.title}
                </h2>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm sm:text-base text-white/90">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatEventDate(featuredEvent.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {featuredEvent.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {featuredEvent.currentAttendees} attending
                    {featuredEvent.maxAttendees ? ` / ${featuredEvent.maxAttendees}` : ""}
                  </span>
                </div>

                <p className="text-white/80 leading-relaxed line-clamp-3">
                  {featuredEvent.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    className="bg-white text-black hover:bg-white/90 h-11 px-6"
                    onClick={() => setSelectedEvent(featuredEvent)}
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  {featuredEvent.maxAttendees && featuredEvent.currentAttendees >= featuredEvent.maxAttendees && (
                    <Badge variant="secondary" className="self-center bg-red-600 text-white border-0">
                      Event Full
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      )}

      {/* Announcements */}
      <AnnouncementsSection className="mb-6 sm:mb-8 lg:mb-10" />

      {/* Search and Filters */}
      <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 h-12 sm:h-14 text-base"
          />
        </div>

        {/* Quick Filters and Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Events</SheetTitle>
                  <SheetDescription>
                    Use these filters to find events that match your interests.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block">Event Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedType("all")
                    }}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Type: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
              <button
                onClick={() => setSelectedType("all")}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Events Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 sm:space-y-8">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 space-y-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto" />
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredEvents.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">No upcoming events found</h3>
                    <p className="text-muted-foreground">
                      {eventsList.length === 0
                        ? "Be the first to create an event for the alumni community."
                        : "Try adjusting your search criteria or check back later for new events."}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {(searchQuery || activeFiltersCount > 0) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("all")
                          setSelectedType("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                    {canCreateEvents && (
                      <Button onClick={() => setShowCreateEvent(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6 sm:space-y-8">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 space-y-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto" />
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredEvents.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                  isPast={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">No past events found</h3>
                    <p className="text-muted-foreground">
                      Past events will appear here once they have concluded.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Create Event Dialog */}
      {showCreateEvent && (
        <CreateEventDialog
          isOpen={showCreateEvent}
          onClose={() => setShowCreateEvent(false)}
        />
      )}
    </div>
  )
}
