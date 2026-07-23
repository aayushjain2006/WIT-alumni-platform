import { Calendar, MapPin, Users, Clock, ExternalLink, CheckCircle, DollarSign, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { VisuallyHidden } from "../ui/visually-hidden"

interface EventDetailsProps {
  event: {
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
    agenda?: Array<{
      time: string
      activity: string
    }>
    isRegistered?: boolean
    registrationDeadline?: string
    ticketPrice?: number
  }
  isOpen: boolean
  onClose: () => void
}

export function EventDetails({ event, isOpen, onClose }: EventDetailsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTypeColor = (type: string) => {
    const colors = {
      networking: "bg-blue-100 text-blue-800",
      webinar: "bg-purple-100 text-purple-800",
      workshop: "bg-green-100 text-green-800",
      social: "bg-orange-100 text-orange-800",
      fundraising: "bg-red-100 text-red-800"
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const attendancePercentage = event.maxAttendees 
    ? (event.currentAttendees / event.maxAttendees) * 100 
    : 0

  const isFull = event.maxAttendees && event.currentAttendees >= event.maxAttendees
  const isPastRegistrationDeadline = event.registrationDeadline && 
    new Date(event.registrationDeadline) < new Date()

  const handleRegister = () => {
    // In a real app, this would handle registration logic
    alert(`Registering for ${event.title}...`)
  }

  const handleUnregister = () => {
    // In a real app, this would handle unregistration logic
    alert(`Unregistering from ${event.title}...`)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              View detailed information about {event.title}, including agenda, speakers, and registration options.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          {event.image && (
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <h2 className="flex-1">{event.title}</h2>
                  <Badge className={getTypeColor(event.type)}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>

              {/* Registration Button */}
              <div className="flex flex-col gap-2 lg:w-auto">
                {event.isRegistered ? (
                  <Button variant="outline" onClick={handleUnregister} className="w-full lg:w-auto">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registered
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRegister} 
                    disabled={isFull || isPastRegistrationDeadline}
                    className="w-full lg:w-auto"
                  >
                    {isFull ? "Event Full" : "Register Now"}
                    {event.ticketPrice && ` - $${event.ticketPrice}`}
                  </Button>
                )}
                {event.registrationDeadline && !isPastRegistrationDeadline && (
                  <p className="text-sm text-muted-foreground text-center lg:text-right">
                    Registration closes {formatDate(event.registrationDeadline)}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Event Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{formatDate(event.date)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(event.time)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{event.location}</p>
                          <p className="text-sm text-muted-foreground">{event.address}</p>
                          {event.isVirtual && (
                            <Badge variant="outline" className="mt-1">Virtual Event</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{event.currentAttendees} attending</p>
                          {event.maxAttendees && (
                            <p className="text-sm text-muted-foreground">
                              {event.maxAttendees} maximum capacity
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Organized by</p>
                          <p className="text-sm text-muted-foreground">{event.organizer}</p>
                        </div>
                      </div>
                    </div>

                    {event.ticketPrice && (
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">${event.ticketPrice} per ticket</p>
                          <p className="text-sm text-muted-foreground">Payment required upon registration</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Agenda */}
                {event.agenda && event.agenda.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Agenda</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {event.agenda.map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                              {index < event.agenda!.length - 1 && (
                                <div className="w-px bg-border flex-1 mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <Badge variant="outline" className="w-fit">
                                  {item.time}
                                </Badge>
                                <span className="font-medium">{item.activity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Featured Speakers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {event.speakers.map((speaker, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(speaker)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{speaker}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Category */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="w-fit">
                      {event.category}
                    </Badge>
                  </CardContent>
                </Card>

                {/* Attendance Progress */}
                {event.maxAttendees && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Registered</span>
                          <span className="font-medium">
                            {event.currentAttendees} / {event.maxAttendees}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(attendancePercentage)}% capacity
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}