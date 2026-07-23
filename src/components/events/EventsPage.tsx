import { useState, useMemo, useEffect } from "react"
import { Calendar, MapPin, Users, Clock, Filter, Search, Plus, Bell } from "lucide-react"
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

export function EventsPage({ className }: EventsPageProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")

  const { data: apiEvents, request: fetchEvents, isLoading } = useApi<any[]>()

  useEffect(() => {
    fetchEvents('get', '/events')
  }, [fetchEvents])

  const eventsList = apiEvents || []

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

  const activeFiltersCount = [selectedCategory, selectedType].filter(f => f !== "all").length

  const canCreateEvents = user?.role === 'admin' || user?.role === 'alumni'

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
          {filteredEvents.length > 0 ? (
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
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="mb-2">No upcoming events found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or check back later for new events.
                  </p>
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
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6 sm:space-y-8">
          {filteredEvents.length > 0 ? (
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
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="mb-2">No past events found</h3>
                  <p className="text-muted-foreground">
                    Past events will appear here once they have concluded.
                  </p>
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