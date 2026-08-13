import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Progress } from '../ui/progress'
import { Users, Briefcase, Calendar, MessageSquare, Award, TrendingUp, Clock, MapPin, PlusCircle, Heart } from 'lucide-react'
import { QuickPostWidget } from '../opportunities/QuickPostWidget'

interface AlumniDashboardProps {
  onNavigate?: (screen: string) => void
}

export function AlumniDashboard({ onNavigate }: AlumniDashboardProps) {
  const quickStats = [
    { label: 'Students Mentored', value: '8', icon: Users, color: 'text-blue-600' },
    { label: 'Job Posts Active', value: '3', icon: Briefcase, color: 'text-green-600' },
    { label: 'Events Attended', value: '12', icon: Calendar, color: 'text-purple-600' },
    { label: 'Network Connections', value: '156', icon: MessageSquare, color: 'text-orange-600' },
  ]

  const menteeRequests = [
    {
      name: 'Emily Davis',
      major: 'Computer Science',
      year: '2026',
      interests: ['Software Development', 'AI/ML', 'Startups'],
      message: 'Hi! I\'m interested in learning about product management in tech companies...',
      image: ''
    },
    {
      name: 'Alex Chen',
      major: 'Business Administration',
      year: '2025',
      interests: ['Entrepreneurship', 'Marketing', 'E-commerce'],
      message: 'Would love to learn about starting a business and scaling it...',
      image: ''
    }
  ]

  const recentActivities = [
    {
      type: 'job_post',
      title: 'Software Engineer position posted',
      description: 'Your job posting has received 23 applications',
      time: '2 hours ago',
      icon: Briefcase
    },
    {
      type: 'mentorship',
      title: 'New mentorship request',
      description: 'Emily Davis wants to connect with you',
      time: '1 day ago',
      icon: Users
    },
    {
      type: 'event',
      title: 'Event reminder',
      description: 'Tech Alumni Meetup is tomorrow',
      time: '1 day ago',
      icon: Calendar
    },
    {
      type: 'donation',
      title: 'Monthly donation processed',
      description: '$100 contributed to scholarship fund',
      time: '3 days ago',
      icon: Heart
    }
  ]

  const activeJobPosts = [
    {
      title: 'Senior Software Engineer',
      company: 'Your Company',
      applications: 45,
      views: 234,
      posted: '1 week ago',
      status: 'Active'
    },
    {
      title: 'Product Manager',
      company: 'Your Company',
      applications: 28,
      views: 189,
      posted: '2 weeks ago',
      status: 'Active'
    }
  ]

  const upcomingEvents = [
    {
      title: 'Alumni Tech Meetup',
      date: 'March 15, 2025',
      time: '6:00 PM',
      location: 'San Francisco, CA',
      role: 'Speaker'
    },
    {
      title: 'Career Fair',
      date: 'March 20, 2025',
      time: '10:00 AM',
      location: 'University Campus',
      role: 'Recruiter'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-violet-700 p-6 sm:p-8 text-primary-foreground shadow-xl shadow-primary/20">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl"></div>
        <div className="relative">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Sarah! 🎓</h1>
          <p className="text-white/80 mb-4">
            Thank you for giving back to the community. Here's your impact summary.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => onNavigate?.('post-opportunity')} className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/10">
              <PlusCircle className="h-4 w-4 mr-2" />
              Post Job Opportunity
            </Button>
            <Button variant="outline" onClick={() => onNavigate?.('connect-alumni')} className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              View Mentees
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mentorship Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Mentorship Requests
              </CardTitle>
              <CardDescription>
                Students seeking your guidance and expertise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {menteeRequests.map((request, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.image} alt={request.name} />
                      <AvatarFallback>
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{request.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {request.major} • Class of {request.year}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {request.interests.map((interest, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    "{request.message}"
                  </p>
                  
                  <div className="flex gap-2">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Activities */}
        <div className="space-y-6">
          {/* Quick Post Widget */}
          <QuickPostWidget />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {event.role}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Details
                  </Button>
                  {index < upcomingEvents.length - 1 && <hr />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Job Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Your Job Posts
            </div>
            <Button onClick={() => onNavigate?.('post-opportunity')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {activeJobPosts.map((job, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{job.title}</h4>
                  <Badge className="bg-green-100 text-green-800">
                    {job.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{job.company}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Applications</p>
                    <p className="font-medium">{job.applications}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-medium">{job.views}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Posted {job.posted}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">View Applications</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Your Alumni Impact</h3>
            <p className="text-muted-foreground">
              Thank you for contributing to the community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">8</p>
              <p className="text-sm text-muted-foreground">Students Mentored</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">$2,400</p>
              <p className="text-sm text-muted-foreground">Total Donations</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">23</p>
              <p className="text-sm text-muted-foreground">Job Opportunities Shared</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}