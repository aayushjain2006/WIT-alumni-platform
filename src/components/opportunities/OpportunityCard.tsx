import { useState } from "react"
import { 
  MapPin, 
  Clock, 
  Building2, 
  Users, 
  Bookmark, 
  ExternalLink, 
  Star,
  Calendar,
  Trophy,
  Heart,
  MessageCircle,
  Eye
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { cn } from "../ui/utils"
import { useAuth } from "../../contexts/AuthContext"

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

interface OpportunityCardProps {
  opportunity: any
  type: 'job' | 'internship' | 'mentorship'
  featured?: boolean
  className?: string
}

export function OpportunityCard({ 
  opportunity, 
  type, 
  featured = false, 
  className 
}: OpportunityCardProps) {
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(opportunity.isBookmarked || false)
  const [hasApplied, setHasApplied] = useState(false)

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // In real app, this would make an API call
  }

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation()
    setHasApplied(true)
    // In real app, this would open application dialog or redirect
  }

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation()
    // In real app, this would open messaging interface
  }

  const renderJobCard = () => (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={opportunity.companyLogo} alt={opportunity.company} />
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{opportunity.title}</h4>
                {featured && <Badge variant="secondary">Featured</Badge>}
                {opportunity.matchScore && opportunity.matchScore > 90 && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {opportunity.matchScore}% match
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{opportunity.company}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {opportunity.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {opportunity.type}
                </div>
                {opportunity.remote && (
                  <Badge variant="outline" className="text-xs">Remote</Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              "h-8 w-8 p-0",
              isBookmarked && "text-yellow-600"
            )}
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {opportunity.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.skills.slice(0, 4).map((skill: string) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {opportunity.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.skills.length - 4} more
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {opportunity.salary && (
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l-1 18H7L6 3z"/>
                  <path d="M9 7h6"/>
                  <path d="M9 11h4"/>
                </svg>
                {opportunity.salary}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {opportunity.applications} applied
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(opportunity.postedDate)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!hasApplied ? (
              <Button size="sm" onClick={handleApply}>
                Apply Now
              </Button>
            ) : (
              <Button size="sm" variant="secondary" disabled>
                Applied ✓
              </Button>
            )}
          </div>
        </div>

        {/* Posted by */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Avatar className="h-6 w-6">
            <AvatarImage src={opportunity.postedByAvatar} alt={opportunity.postedBy} />
            <AvatarFallback className="text-xs">
              {getInitials(opportunity.postedBy)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Posted by <span className="font-medium">{opportunity.postedBy}</span>
          </span>
          <Button variant="ghost" size="sm" className="ml-auto h-6">
            <MessageCircle className="h-3 w-3 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </>
  )

  const renderInternshipCard = () => (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={opportunity.companyLogo} alt={opportunity.company} />
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{opportunity.title}</h4>
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  Internship
                </Badge>
                {opportunity.paid && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Paid
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{opportunity.company}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {opportunity.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {opportunity.duration}
                </div>
                {opportunity.remote && (
                  <Badge variant="outline" className="text-xs">Remote</Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              "h-8 w-8 p-0",
              isBookmarked && "text-yellow-600"
            )}
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {opportunity.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.skills.slice(0, 4).map((skill: string) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {opportunity.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.skills.length - 4} more
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {opportunity.stipend && (
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l-1 18H7L6 3z"/>
                  <path d="M9 7h6"/>
                  <path d="M9 11h4"/>
                </svg>
                {opportunity.stipend}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {opportunity.applications} applied
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(opportunity.postedDate)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!hasApplied ? (
              <Button size="sm" onClick={handleApply}>
                Apply Now
              </Button>
            ) : (
              <Button size="sm" variant="secondary" disabled>
                Applied ✓
              </Button>
            )}
          </div>
        </div>

        {/* Posted by */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Avatar className="h-6 w-6">
            <AvatarImage src={opportunity.postedByAvatar} alt={opportunity.postedBy} />
            <AvatarFallback className="text-xs">
              {getInitials(opportunity.postedBy)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Posted by <span className="font-medium">{opportunity.postedBy}</span>
          </span>
          <Button variant="ghost" size="sm" className="ml-auto h-6">
            <MessageCircle className="h-3 w-3 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </>
  )

  const renderMentorshipCard = () => (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={opportunity.mentorAvatar} alt={opportunity.mentorName} />
              <AvatarFallback>
                {getInitials(opportunity.mentorName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{opportunity.mentorName}</h4>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Mentor
                </Badge>
                {opportunity.featured && (
                  <Badge variant="default">
                    <Star className="h-3 w-3 mr-1" />
                    Top Mentor
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-2">
                {opportunity.title} at {opportunity.company}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {opportunity.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {opportunity.experience} experience
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {opportunity.mentees} mentees
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
          {opportunity.bio}
        </p>

        {/* Expertise Areas */}
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.expertise.slice(0, 4).map((area: string) => (
            <Badge key={area} variant="secondary" className="text-xs">
              {area}
            </Badge>
          ))}
          {opportunity.expertise.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.expertise.length - 4} more
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              {opportunity.rating} ({opportunity.reviews} reviews)
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Available {opportunity.availability}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleContact}>
              Request Mentorship
            </Button>
          </div>
        </div>

        {/* Mentorship focus */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Focus areas:</span>
            <span className="font-medium">{opportunity.focusAreas.join(", ")}</span>
          </div>
        </div>
      </CardContent>
    </>
  )

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        featured && "ring-2 ring-primary/20 shadow-sm",
        className
      )}
    >
      {type === 'job' && renderJobCard()}
      {type === 'internship' && renderInternshipCard()}
      {type === 'mentorship' && renderMentorshipCard()}
    </Card>
  )
}