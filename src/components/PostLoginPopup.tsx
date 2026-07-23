import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { useMobile } from './ui/use-mobile'
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp,
  DollarSign,
  X,
  ArrowRight,
  Star
} from 'lucide-react'

interface PostLoginPopupProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToJobs: () => void
  onNavigateToEvents: () => void
}

const featuredJobs = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '₹120Lpa - ₹180Lpa',
    type: 'Full-time',
    remote: true,
    featured: true
  },
  {
    id: '2',
    title: 'Marketing Manager',
    company: 'StartupX',
    location: 'New York, NY',
    salary: '₹80Lpa - ₹120Lpa',
    type: 'Full-time',
    remote: false,
    featured: true
  }
]

const upcomingEvents = [
  {
    id: '1',
    title: 'Alumni Networking Night',
    date: 'Dec 20, 2024',
    time: '6:00 PM',
    location: 'Alumni Center',
    attendees: 45,
    type: 'Networking'
  },
  {
    id: '2',
    title: 'Career Workshop: Tech Industry',
    date: 'Dec 25, 2024',
    time: '2:00 PM',
    location: 'Online',
    attendees: 120,
    type: 'Workshop'
  }
]

export function PostLoginPopup({ isOpen, onClose, onNavigateToJobs, onNavigateToEvents }: PostLoginPopupProps) {
  const { isMobile } = useMobile()
  const [activeTab, setActiveTab] = useState<'jobs' | 'events'>('jobs')

  // Auto-close after 10 seconds if user doesn't interact
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 10000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  const handleNavigateToJobs = () => {
    onNavigateToJobs()
    onClose()
  }

  const handleNavigateToEvents = () => {
    onNavigateToEvents()
    onClose()
  }

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="mobile-card max-w-sm mx-auto p-0 gap-0 border-0 shadow-xl">
          {/* Mobile Header */}
          <DialogHeader className="p-6 pb-4 text-center relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 p-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
            <DialogTitle className="text-xl font-semibold mb-2">Welcome back!</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Check out what's new in your alumni network
            </p>
          </DialogHeader>

          {/* Mobile Tab Navigation */}
          <div className="flex mx-6 mb-4 bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === 'jobs' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 mobile-button h-10"
              onClick={() => setActiveTab('jobs')}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </Button>
            <Button
              variant={activeTab === 'events' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 mobile-button h-10"
              onClick={() => setActiveTab('events')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </Button>
          </div>

          {/* Mobile Content */}
          <div className="px-6 pb-6">
            {activeTab === 'jobs' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Featured Jobs</h3>
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    {featuredJobs.length} New
                  </Badge>
                </div>
                
                {featuredJobs.map((job) => (
                  <Card key={job.id} className="border-0 bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {job.type}
                            </Badge>
                            {job.remote && (
                              <Badge variant="outline" className="text-xs">Remote</Badge>
                            )}
                            {job.featured && (
                              <Star className="h-3 w-3 fill-primary text-primary" />
                            )}
                          </div>
                          <h4 className="font-medium text-sm mb-1">{job.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{job.company}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-foreground font-medium">
                          <DollarSign className="h-3 w-3 mr-2" />
                          {job.salary}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  className="w-full mobile-button mt-4"
                  onClick={handleNavigateToJobs}
                >
                  View All Jobs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Upcoming Events</h3>
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    {upcomingEvents.length} This Week
                  </Badge>
                </div>
                
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="border-0 bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Badge variant="secondary" className="text-xs mb-2">
                            {event.type}
                          </Badge>
                          <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2" />
                          {event.date} at {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-2" />
                          {event.attendees} attending
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  className="w-full mobile-button mt-4"
                  onClick={handleNavigateToEvents}
                >
                  View All Events
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Footer */}
          <div className="px-6 pb-6 pt-2">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-3">
                Stay connected with your alumni network
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mobile-button"
                onClick={onClose}
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Desktop version
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        {/* Desktop Header */}
        <DialogHeader className="p-8 pb-6 text-center relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-6 top-6 p-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-10 w-10 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-semibold mb-3">Welcome back to AlumniUnite!</DialogTitle>
          <p className="text-muted-foreground max-w-md mx-auto">
            Here's what's happening in your alumni network. Discover new opportunities and connect with fellow alumni.
          </p>
        </DialogHeader>

        {/* Desktop Content */}
        <div className="grid grid-cols-2 gap-8 px-8 pb-8">
          {/* Jobs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Featured Jobs</h3>
                  <p className="text-sm text-muted-foreground">Latest opportunities</p>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                {featuredJobs.length} New
              </Badge>
            </div>

            <div className="space-y-3">
              {featuredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {job.type}
                          </Badge>
                          {job.remote && (
                            <Badge variant="outline" className="text-xs">Remote</Badge>
                          )}
                          {job.featured && (
                            <Star className="h-4 w-4 fill-primary text-primary" />
                          )}
                        </div>
                        <h4 className="font-medium mb-1">{job.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-foreground font-medium">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.salary}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              className="w-full"
              onClick={handleNavigateToJobs}
            >
              Explore All Opportunities
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Events Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Upcoming Events</h3>
                  <p className="text-sm text-muted-foreground">Don't miss out</p>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                {upcomingEvents.length} This Week
              </Badge>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Badge variant="secondary" className="text-xs mb-2">
                          {event.type}
                        </Badge>
                        <h4 className="font-medium mb-1">{event.title}</h4>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees} attending
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              className="w-full"
              onClick={handleNavigateToEvents}
            >
              View All Events
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="border-t px-8 py-6 text-center bg-muted/30">
          <p className="text-sm text-muted-foreground mb-4">
            Stay connected and make the most of your alumni network
          </p>
          <Button 
            variant="outline"
            onClick={onClose}
          >
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}