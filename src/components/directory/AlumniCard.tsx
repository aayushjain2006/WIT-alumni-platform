import { MapPin, Briefcase, GraduationCap, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface AlumniCardProps {
  alumni: {
    id: string
    _id?: string
    firstName?: string
    lastName?: string
    name?: string // fallback
    graduationYear: number
    department?: string
    degree?: string
    jobTitle?: string
    currentRole?: string
    company: string
    location: string
    industry?: string
    skills: string[]
    bio: string
    profileImage?: string
    avatar?: string
  }
  onClick: () => void
}

export function AlumniCard({ alumni, onClick }: AlumniCardProps) {
  const displayName = alumni.firstName ? `${alumni.firstName} ${alumni.lastName}` : alumni.name || ''
  const displayRole = alumni.jobTitle || alumni.currentRole || ''
  const displayAvatar = alumni.profileImage || alumni.avatar || ''
  const displayDegree = alumni.department || alumni.degree || ''
  const displayBio = alumni.bio || ''
  const displaySkills = alumni.skills || []
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" onClick={onClick}>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback className="text-sm sm:text-base font-medium">{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base lg:text-lg truncate leading-tight">{displayName}</h3>
            <p className="text-muted-foreground text-xs sm:text-sm truncate mt-1">{displayRole}</p>
            <p className="text-muted-foreground text-xs sm:text-sm truncate">{alumni.company}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3 sm:space-y-4">
        {/* Location and Graduation */}
        <div className="space-y-2 sm:space-y-2.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">{alumni.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Class of {alumni.graduationYear} • {displayDegree}</span>
          </div>
          {alumni.industry && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{alumni.industry}</span>
            </div>
          )}
        </div>

        {/* Bio Preview */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {displayBio.length > 120 ? `${displayBio.substring(0, 120)}...` : displayBio}
        </p>

        {/* Skills */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {displaySkills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">
                {skill}
              </Badge>
            ))}
            {displaySkills.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{displaySkills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* View Profile Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4 h-9 sm:h-10 text-xs sm:text-sm"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}