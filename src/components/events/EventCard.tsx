import { Calendar, MapPin, Users, Clock, ExternalLink, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    time: string
    endTime?: string
    location: string
    type: string
    category: string
    maxAttendees?: number
    currentAttendees: number
    isVirtual: boolean
    image?: string
    organizer: string
    isRegistered?: boolean
    ticketPrice?: number
  }
  onClick: () => void
  isPast?: boolean
}

export function EventCard({ event, onClick, isPast = false }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
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
    const key = type?.toLowerCase()
    const colors = {
      networking: "bg-blue-100 text-blue-800",
      webinar: "bg-purple-100 text-purple-800",
      workshop: "bg-green-100 text-green-800",
      social: "bg-orange-100 text-orange-800",
      fundraising: "bg-red-100 text-red-800",
      seminar: "bg-violet-100 text-violet-800",
      career: "bg-cyan-100 text-cyan-800",
      entrepreneurship: "bg-amber-100 text-amber-800",
      reunion: "bg-pink-100 text-pink-800"
    }
    return colors[key as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const attendancePercentage = event.maxAttendees 
    ? (event.currentAttendees / event.maxAttendees) * 100 
    : 0

  const isNearlyFull = attendancePercentage > 90
  const isFull = event.maxAttendees && event.currentAttendees >= event.maxAttendees

  return (
    <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:scale-105 flex flex-col" onClick={onClick}>
      {/* Event Image */}
      <div className={`relative overflow-hidden rounded-t-lg ${event.image ? "h-48" : "h-36 bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20"}`}>
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="h-12 w-12 text-primary/40" />
          </div>
        )}
        {isPast && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white/90">
              Past Event
            </Badge>
          </div>
        )}
        {event.isRegistered && !isPast && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Registered
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-tight">{event.title}</h3>
            <Badge className={getTypeColor(event.type)}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">
              {formatDate(event.date)} • {formatTime(event.time)}
              {event.endTime && ` - ${formatTime(event.endTime)}`}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">{event.location}</span>
            {event.isVirtual && (
              <Badge variant="outline" className="text-xs">Virtual</Badge>
            )}
          </div>

          {/* Attendance */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">
              {event.currentAttendees} attending
              {event.maxAttendees && ` • ${event.maxAttendees} max`}
            </span>
            {isNearlyFull && !isFull && (
              <Badge variant="outline" className="text-xs text-orange-600">
                Nearly Full
              </Badge>
            )}
            {isFull && (
              <Badge variant="outline" className="text-xs text-red-600">
                Full
              </Badge>
            )}
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Organized by {event.organizer}</span>
          </div>

          {/* Price */}
          {event.ticketPrice && (
            <div className="flex items-center justify-between">
              <span className="font-medium">${event.ticketPrice}</span>
            </div>
          )}

          {/* Attendance Progress Bar */}
          {event.maxAttendees && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Attendance</span>
                <span>{Math.round(attendancePercentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    isFull ? 'bg-red-500' : 
                    isNearlyFull ? 'bg-orange-500' : 
                    'bg-primary'
                  }`}
                  style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* View Details Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4 self-end"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}