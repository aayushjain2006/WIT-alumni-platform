import { X, MapPin, Briefcase, GraduationCap, ExternalLink, Mail, MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { VisuallyHidden } from "../ui/visually-hidden"

interface AlumniProfileProps {
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
  isOpen: boolean
  onClose: () => void
}

export function AlumniProfile({ alumni, isOpen, onClose }: AlumniProfileProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Alumni Profile</DialogTitle>
            <DialogDescription>
              View detailed information about {alumni.name}, including their background, experience, and contact details.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                <AvatarImage src={alumni.avatar} alt={alumni.name} />
                <AvatarFallback className="text-lg">{getInitials(alumni.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="mb-2">{alumni.name}</h2>
                <p className="text-muted-foreground mb-1">{alumni.currentRole}</p>
                <p className="text-muted-foreground mb-3">{alumni.company}</p>
                
                <div className="flex flex-col sm:flex-row gap-2 items-center justify-center sm:justify-start text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{alumni.location}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm">Class of {alumni.graduationYear}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">{alumni.industry}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:w-auto">
              <Button onClick={() => handleContact('message')} className="w-full sm:w-auto">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" onClick={() => handleContact('email')} className="w-full sm:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              {alumni.linkedIn && (
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <a href={alumni.linkedIn} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{alumni.bio}</p>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alumni.experience.map((exp, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                          {index < alumni.experience.length - 1 && (
                            <div className="w-px bg-border flex-1 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <h4 className="font-medium">{exp.role}</h4>
                          <p className="text-muted-foreground">{exp.company}</p>
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
                    <p className="font-medium">University Name</p>
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
      </DialogContent>
    </Dialog>
  )
}