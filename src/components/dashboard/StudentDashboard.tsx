import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Progress } from '../ui/progress'
import { useMobile } from '../ui/use-mobile'
import { Users, Briefcase, Calendar, MessageSquare, Award, TrendingUp, Clock, MapPin, ArrowRight, Plus } from 'lucide-react'

interface StudentDashboardProps {
  onNavigate?: (screen: string) => void
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { isMobile } = useMobile()
  const quickStats = [
    { label: 'Alumni Connections', value: '12', icon: Users, color: 'text-blue-600' },
    { label: 'Active Applications', value: '5', icon: Briefcase, color: 'text-green-600' },
    { label: 'Upcoming Events', value: '3', icon: Calendar, color: 'text-purple-600' },
    { label: 'Unread Messages', value: '8', icon: MessageSquare, color: 'text-orange-600' },
  ]

  const recentOpportunities = [
    {
      title: 'Software Engineering Intern',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Internship',
      salary: '$6,000/month',
      posted: '2 days ago',
      applicants: 45
    },
    {
      title: 'Marketing Associate',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$70k - $85k',
      posted: '1 week ago',
      applicants: 23
    },
    {
      title: 'Data Science Intern',
      company: 'Analytics Pro',
      location: 'New York, NY',
      type: 'Internship',
      salary: '$5,500/month',
      posted: '3 days ago',
      applicants: 67
    }
  ]

  const mentorSuggestions = [
    {
      name: 'Sarah Chen',
      title: 'Senior Product Manager at Meta',
      graduationYear: '2018',
      skills: ['Product Management', 'Strategy', 'Leadership'],
      image: ''
    },
    {
      name: 'Marcus Johnson',
      title: 'Founder & CEO at GreenTech',
      graduationYear: '2015',
      skills: ['Entrepreneurship', 'Sustainability', 'Leadership'],
      image: ''
    }
  ]

  const upcomingEvents = [
    {
      title: 'Career Fair 2025',
      date: 'March 15, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Campus Center',
      attendees: 200
    },
    {
      title: 'Alumni Networking Night',
      date: 'March 20, 2025',
      time: '6:00 PM - 9:00 PM',
      location: 'Downtown Convention Center',
      attendees: 150
    }
  ]

  return (
    <div className={`${isMobile ? 'space-y-4 pt-16' : 'space-y-6 sm:space-y-8 lg:space-y-10'}`}>
      {/* Mobile Welcome Section */}
      {isMobile ? (
        <div className="relative overflow-hidden rounded-2xl p-5 mobile-card bg-gradient-to-br from-primary to-violet-700 text-primary-foreground">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-2xl"></div>
          <div className="relative flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold mb-1">Hey John! 👋</h1>
              <p className="text-white/80 text-sm">
                Ready to explore today?
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-3">
            <Button 
              className="mobile-button bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/10"
              onClick={() => onNavigate?.('explore-opportunities')}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </Button>
            <Button 
              variant="outline" 
              className="mobile-button border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => onNavigate?.('connect-alumni')}
            >
              <Users className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-violet-700 p-6 sm:p-8 lg:p-10 text-primary-foreground shadow-xl shadow-primary/20">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl"></div>
          <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent"></div>
          <div className="relative">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">Welcome back, John! 👋</h1>
            <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
              Here's what's happening in your alumni network today
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/10"
                onClick={() => onNavigate?.('explore-opportunities')}
              >
                Explore Opportunities
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                onClick={() => onNavigate?.('connect-alumni')}
              >
                Connect with Alumni
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {isMobile ? (
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="mobile-card border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Opportunities */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                Recent Opportunities
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Latest job postings and internships from alumni
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOpportunities.map((job, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200 space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 text-sm sm:text-base">{job.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2 sm:mb-3">{job.company}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.posted}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right space-y-0 sm:space-y-2">
                    <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                      <Badge variant="outline" className="text-xs">{job.type}</Badge>
                      <p className="text-sm font-medium">{job.salary?.replace(/\$/g, '₹')}</p>
                    </div>
                    <Button size="sm" className="min-w-[80px]">Apply</Button>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => onNavigate?.('explore-opportunities')}
              >
                View All Opportunities
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mentor Suggestions & Events */}
        <div className="space-y-6 lg:space-y-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                Suggested Mentors
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Connect with experienced alumni
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {mentorSuggestions.map((mentor, index) => (
                <div key={index} className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                      <AvatarImage src={mentor.image} alt={mentor.name} />
                      <AvatarFallback className="text-sm font-medium">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">{mentor.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{mentor.title}</p>
                      <p className="text-xs text-muted-foreground">Class of {mentor.graduationYear}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {mentor.skills.slice(0, 2).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full h-10">
                    Request Mentorship
                  </Button>
                  {index < mentorSuggestions.length - 1 && <hr className="border-border/50" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="font-medium text-sm sm:text-base">{event.title}</h4>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      {event.location}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-10">
                    Register
                  </Button>
                  {index < upcomingEvents.length - 1 && <hr className="border-border/50" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Completion */}
      <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h3 className="font-medium text-base sm:text-lg mb-2">Complete Your Profile</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Add more details to get better recommendations
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-3xl sm:text-4xl font-bold text-primary">75%</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={75} className="mb-6 h-3" />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="sm" className="w-full sm:w-auto h-10">Add Skills</Button>
            <Button size="sm" variant="outline" className="w-full sm:w-auto h-10">Upload Resume</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}