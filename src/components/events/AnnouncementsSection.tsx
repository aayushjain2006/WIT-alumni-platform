import { Bell, Pin, X, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Alert, AlertDescription } from "../ui/alert"
import { ImageWithFallback } from "../figma/ImageWithFallback"

// Mock announcements data
const mockAnnouncements = [
  {
    id: "1",
    title: "New Alumni Mentorship Program Launch",
    content: "We're excited to announce the launch of our new mentorship program connecting students with experienced alumni. Sign-ups open February 20th.",
    type: "featured",
    date: "2024-02-10",
    author: "Alumni Relations Team",
    isPinned: true,
    link: "#mentorship",
  
  },
  {
    id: "2",
    title: "Campus Career Fair - Register Now",
    content: "Our annual career fair is happening March 5th. Over 50 companies will be attending. Registration is now open for all students and recent graduates.",
    type: "urgent",
    date: "2024-02-08",
    author: "Career Services",
    isPinned: true,
    link: "#career-fair",
  
  },
  {
    id: "3",
    title: "Alumni Directory Update",
    content: "We've added new search filters and enhanced profiles to our alumni directory. Update your profile to connect with more alumni.",
    type: "info",
    date: "2024-02-05",
    author: "Tech Team",
    isPinned: false,
    link: "#directory",
    poster: "https://images.unsplash.com/photo-1710429112585-68a9c850a8a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwYW5ub3VuY2VtZW50JTIwcG9zdGVyfGVufDF8fHx8MTc1ODE1NzAxMXww&ixlib=rb-4.1.0&q=80&w=1080"
  }
]

interface AnnouncementsSectionProps {
  className?: string
}

export function AnnouncementsSection({ className }: AnnouncementsSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const getAnnouncementVariant = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'destructive'
      case 'featured':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return Bell
      case 'featured':
        return Pin
      default:
        return Bell
    }
  }

  const pinnedAnnouncements = mockAnnouncements.filter(ann => ann.isPinned)
  const regularAnnouncements = mockAnnouncements.filter(ann => !ann.isPinned)

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <div className="space-y-3">
              {pinnedAnnouncements.map((announcement) => {
                const IconComponent = getAnnouncementIcon(announcement.type)
                return (
                  <Alert key={announcement.id} variant={getAnnouncementVariant(announcement.type)}>
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-4 w-4 mt-0.5" />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium leading-tight">{announcement.title}</h4>
                          {announcement.isPinned && (
                            <Pin className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        {announcement.poster && (
                          <div className="rounded-lg overflow-hidden max-w-sm">
                            <ImageWithFallback
                              src={announcement.poster}
                              alt={`${announcement.title} poster`}
                              className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        )}
                        <AlertDescription className="text-sm w-full max-w-full min-w-0 flex-1 leading-relaxed px-2">
                          {announcement.content}
                        </AlertDescription>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{announcement.author}</span>
                            <span>•</span>
                            <span>{formatDate(announcement.date)}</span>
                          </div>
                          {announcement.link && (
                            <Button variant="ghost" size="sm" className="h-auto p-1">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Alert>
                )
              })}
            </div>
          )}

          {/* Regular Announcements */}
          {regularAnnouncements.length > 0 && (
            <div className="space-y-3">
              {pinnedAnnouncements.length > 0 && (
                <div className="border-t pt-3">
                  <h5 className="font-medium text-sm text-muted-foreground mb-3">Other Updates</h5>
                </div>
              )}
              {regularAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{announcement.author}</span>
                        <span>•</span>
                        <span>{formatDate(announcement.date)}</span>
                      </div>
                    </div>
                    {announcement.link && (
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {mockAnnouncements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No announcements at this time</p>
            </div>
          )}

          {/* View All Link */}
          {mockAnnouncements.length > 3 && (
            <div className="text-center pt-2 border-t">
              <Button variant="ghost" size="sm">
                View All Announcements
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}