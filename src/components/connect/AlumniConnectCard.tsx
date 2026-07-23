import { useState } from "react"
import { 
  MessageCircle, 
  Star, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Coffee, 
  Video, 
  Phone,
  Mail,
  Clock,
  Users,
  ExternalLink,
  Heart,
  CheckCircle
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { cn } from "../ui/utils"

// Helper function to format time ago
const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString()
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
}

const getContactIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case 'coffee chat':
      return Coffee
    case 'video call':
      return Video
    case 'phone call':
      return Phone
    case 'email':
      return Mail
    default:
      return MessageCircle
  }
}

interface AlumniConnectCardProps {
  alumni: any
  featured?: boolean
  onConnect: () => void
  className?: string
}

export function AlumniConnectCard({ 
  alumni, 
  featured = false, 
  onConnect,
  className 
}: AlumniConnectCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // In real app, this would make an API call
  }

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation()
    onConnect()
  }

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        featured && "ring-2 ring-primary/20 shadow-sm",
        !alumni.isAvailable && "opacity-75",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={alumni.avatar} alt={alumni.name} />
                <AvatarFallback className="text-lg">
                  {getInitials(alumni.name)}
                </AvatarFallback>
              </Avatar>
              {alumni.isAvailable && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{alumni.name}</h4>
                {featured && <Badge variant="secondary">Featured</Badge>}
                {alumni.isAvailable ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="outline">Busy</Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-2">
                {alumni.title} at {alumni.company}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alumni.location}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Class of {alumni.graduationYear}
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {alumni.major}
                </div>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              "h-8 w-8 p-0",
              isBookmarked && "text-red-600"
            )}
          >
            <Heart className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {alumni.bio}
        </p>

        {/* Expertise Areas */}
        <div className="flex flex-wrap gap-2 mb-4">
          {alumni.expertise.slice(0, 4).map((area: string) => (
            <Badge key={area} variant="secondary" className="text-xs">
              {area}
            </Badge>
          ))}
          {alumni.expertise.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{alumni.expertise.length - 4} more
            </Badge>
          )}
        </div>

        {/* Willing to Help */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Willing to help with:</p>
          <div className="flex flex-wrap gap-1">
            {alumni.willingToHelp.slice(0, 3).map((help: string) => (
              <Badge key={help} variant="outline" className="text-xs">
                {help}
              </Badge>
            ))}
            {alumni.willingToHelp.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{alumni.willingToHelp.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Preferred Contact Methods */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Preferred contact:</p>
          <div className="flex flex-wrap gap-2">
            {alumni.preferredContact.map((method: string) => {
              const Icon = getContactIcon(method)
              return (
                <div key={method} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  {method}
                </div>
              )
            })}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              {alumni.rating}/5.0
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {alumni.connectionsHelped} helped
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {alumni.avgResponseTime}
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              {alumni.responseRate}% response rate
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            {alumni.linkedIn && (
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ExternalLink className="h-3 w-3 mr-1" />
                LinkedIn
              </Button>
            )}
            {alumni.twitter && (
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ExternalLink className="h-3 w-3 mr-1" />
                Twitter
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={handleConnect}
              disabled={!alumni.isAvailable}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {alumni.isAvailable ? "Connect" : "Unavailable"}
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        {!alumni.isAvailable && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground">
              This alumni is currently not accepting new connection requests. You can bookmark them for later.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}