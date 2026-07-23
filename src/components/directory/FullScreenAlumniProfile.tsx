import { ArrowLeft, MapPin, Briefcase, GraduationCap, ExternalLink, Mail, MessageCircle, Share, Bookmark } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { useMobile } from "../ui/use-mobile"
import { useState } from "react"

interface FullScreenAlumniProfileProps {
  alumni: {
    id: string
    name: string
    email: string
    graduationYear: number
    degree: string
    currentRole: string
    company: string
    location: string
    industry: string
    skills: string[]
    bio: string
    avatar: string
    linkedIn?: string
    experience: Array<{
      company: string
      role: string
      years: string
    }>
  }
  onBack: () => void
}

export function FullScreenAlumniProfile({ alumni, onBack }: FullScreenAlumniProfileProps) {
  const { isMobile } = useMobile()
  const [isBookmarked, setIsBookmarked] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  const handleContact = (type: 'email' | 'message') => {
    if (type === 'email') {
      window.open(`mailto:${alumni.email}`, '_blank')
    } else {
      // In a real app, this would open a messaging interface
      alert(`Starting conversation with ${alumni.name}...`)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${alumni.name} - Alumni Profile`,
        text: `Check out ${alumni.name}'s profile from our alumni network`,
        url: window.location.href
      })
    } else {
      // Fallback for desktop
      navigator.clipboard.writeText(window.location.href)
      alert('Profile link copied to clipboard!')
    }
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="mobile-sticky bg-background/95 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">Alumni Profile</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="p-2">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <Avatar className="h-32 w-32 mx-auto">
              <AvatarImage src={alumni.avatar} alt={alumni.name} />
              <AvatarFallback className="text-2xl">{getInitials(alumni.name)}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{alumni.name}</h2>
              <p className="text-lg text-muted-foreground">{alumni.currentRole}</p>
              <p className="text-base text-muted-foreground">{alumni.company}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{alumni.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                <span>Class of {alumni.graduationYear}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{alumni.industry}</span>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => handleContact('message')} className="mobile-button">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" onClick={() => handleContact('email')} className="mobile-button">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>

          {alumni.linkedIn && (
            <Button variant="outline" asChild className="w-full mobile-button">
              <a href={alumni.linkedIn} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View LinkedIn Profile
              </a>
            </Button>
          )}

          <Separator />

          {/* Mobile About Section */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{alumni.bio}</p>
            </CardContent>
          </Card>

          {/* Mobile Experience Section */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alumni.experience.map((exp, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                      {index < alumni.experience.length - 1 && (
                        <div className="w-px bg-border flex-1 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h4 className="font-medium text-base">{exp.role}</h4>
                      <p className="text-muted-foreground text-sm">{exp.company}</p>
                      <p className="text-muted-foreground text-xs">{exp.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Education Section */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">University Name</p>
                <p className="text-muted-foreground">{alumni.degree}</p>
                <p className="text-muted-foreground text-sm">Graduated {alumni.graduationYear}</p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Skills Section */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {alumni.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Industry Section */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Industry</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="w-fit">
                {alumni.industry}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <div className="border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Directory
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Desktop Profile Header */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col sm:flex-row gap-6 flex-1">
              <Avatar className="h-32 w-32 mx-auto sm:mx-0">
                <AvatarImage src={alumni.avatar} alt={alumni.name} />
                <AvatarFallback className="text-2xl">{getInitials(alumni.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-semibold mb-3">{alumni.name}</h1>
                <p className="text-xl text-muted-foreground mb-2">{alumni.currentRole}</p>
                <p className="text-lg text-muted-foreground mb-4">{alumni.company}</p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{alumni.location}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Class of {alumni.graduationYear}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <span>{alumni.industry}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex flex-col gap-3 sm:w-auto min-w-48">
              <Button onClick={() => handleContact('message')} size="lg">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" onClick={() => handleContact('email')} size="lg">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              {alumni.linkedIn && (
                <Button variant="outline" asChild size="lg">
                  <a href={alumni.linkedIn} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Desktop Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">{alumni.bio}</p>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {alumni.experience.map((exp, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                          {index < alumni.experience.length - 1 && (
                            <div className="w-px bg-border flex-1 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <h4 className="font-medium text-lg">{exp.role}</h4>
                          <p className="text-muted-foreground text-base">{exp.company}</p>
                          <p className="text-muted-foreground text-sm">{exp.years}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-base">University Name</p>
                    <p className="text-muted-foreground">{alumni.degree}</p>
                    <p className="text-muted-foreground text-sm">Graduated {alumni.graduationYear}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {alumni.skills.map(skill => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Industry */}
              <Card>
                <CardHeader>
                  <CardTitle>Industry</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="w-fit">
                    {alumni.industry}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}