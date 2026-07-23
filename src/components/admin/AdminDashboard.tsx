import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  BarChart3, 
  Users, 
  Calendar, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  UserPlus, 
  DollarSign,
  Eye,
  Heart,
  Briefcase,
  BookOpen,
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("30d")

  const overviewStats = [
    { 
      label: 'Total Users', 
      value: '2,847', 
      change: '+12%', 
      trend: 'up',
      description: '156 new this month',
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Active Events', 
      value: '15', 
      change: '+3', 
      trend: 'up',
      description: '89% attendance rate',
      icon: Calendar, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      label: 'Job Postings', 
      value: '89', 
      change: '+23%', 
      trend: 'up',
      description: '67% application rate',
      icon: Briefcase, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      label: 'Donations', 
      value: '$12,450', 
      change: '+8%', 
      trend: 'up',
      description: 'Monthly recurring',
      icon: DollarSign, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
  ]

  const engagementStats = [
    {
      title: "Daily Active Users",
      value: 456,
      target: 500,
      percentage: 91,
      trend: "up",
      change: "+12%"
    },
    {
      title: "Event Participation",
      value: 78,
      target: 80,
      percentage: 98,
      trend: "up", 
      change: "+5%"
    },
    {
      title: "Message Response Rate",
      value: 89,
      target: 85,
      percentage: 105,
      trend: "up",
      change: "+8%"
    },
    {
      title: "Alumni Story Shares",
      value: 234,
      target: 200,
      percentage: 117,
      trend: "up",
      change: "+23%"
    }
  ]

  const userBreakdown = [
    { role: 'Students', count: 1654, percentage: 58, trend: '+5%' },
    { role: 'Alumni', count: 1138, percentage: 40, trend: '+12%' },
    { role: 'Admins', count: 55, percentage: 2, trend: '+2%' },
  ]

  const topEvents = [
    {
      name: "Annual Alumni Gala",
      attendees: 245,
      date: "2024-03-15",
      type: "Networking",
      engagement: 94
    },
    {
      name: "Tech Career Fair",
      attendees: 189,
      date: "2024-02-28",
      type: "Career",
      engagement: 87
    },
    {
      name: "Startup Pitch Night",
      attendees: 134,
      date: "2024-02-20",
      type: "Entrepreneurship", 
      engagement: 92
    }
  ]

  const contentStats = [
    {
      type: "Alumni Stories",
      count: 156,
      trend: "+23%",
      engagement: "4.2k likes"
    },
    {
      type: "Job Postings",
      count: 89,
      trend: "+12%",
      engagement: "1.8k applications"
    },
    {
      type: "Events",
      count: 45,
      trend: "+8%",
      engagement: "2.1k registrations"
    },
    {
      type: "News Articles",
      count: 78,
      trend: "+15%",
      engagement: "3.4k views"
    }
  ]

  const pendingApprovals = [
    {
      id: "app-1",
      type: 'Alumni Profile',
      user: {
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        graduationYear: '2019',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      submitted: '2 hours ago',
      status: 'pending',
      priority: 'high'
    },
    {
      id: "app-2",
      type: 'Job Posting',
      user: {
        name: 'TechCorp Inc.',
        email: 'hr@techcorp.com',
        title: 'Software Engineer Position',
        avatar: null
      },
      submitted: '1 day ago',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: "app-3",
      type: 'Event Creation',
      user: {
        name: 'Michael Rodriguez',
        email: 'michael.r@email.com',
        title: 'Alumni Networking Event',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      submitted: '3 hours ago',
      status: 'pending',
      priority: 'low'
    }
  ]

  const recentActivity = [
    {
      action: 'New alumni profile approved',
      user: 'Emily Davis',
      details: 'Computer Science • Class of 2023',
      time: '5 minutes ago',
      status: 'success',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      action: 'Event registration milestone',
      user: 'Tech Alumni Meetup',
      details: '100+ registrations achieved',
      time: '1 hour ago',
      status: 'success',
      avatar: null
    },
    {
      action: 'Content reported',
      user: 'Job posting flagged',
      details: 'Misleading salary information',
      time: '2 hours ago',
      status: 'warning',
      avatar: null
    },
    {
      action: 'Major donation received',
      user: 'Marcus Johnson',
      details: '$5,000 to Emergency Fund',
      time: '3 hours ago',
      status: 'success',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor platform performance and manage the alumni community
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown
          
          return (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Engagement Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Engagement Metrics
                  </CardTitle>
                  <CardDescription>
                    Key performance indicators for the last {timeRange}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {engagementStats.map((stat, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{stat.title}</span>
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <ArrowUp className="h-3 w-3" />
                            {stat.change}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{stat.value}</span>
                            <span className="text-muted-foreground">Target: {stat.target}</span>
                          </div>
                          <Progress value={stat.percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {stat.percentage}% of target achieved
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userBreakdown.map((user, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{user.role}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">{user.trend}</span>
                          <span className="text-sm text-muted-foreground">
                            {user.count} ({user.percentage}%)
                          </span>
                        </div>
                      </div>
                      <Progress value={user.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <UserPlus className="h-5 w-5" />
                      <span className="text-xs">Add User</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs">Create Event</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-xs">Broadcast</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-xs">Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.slice(0, 4).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                        {activity.details && (
                          <p className="text-xs text-muted-foreground">{activity.details}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Top Performing Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{event.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {event.attendees} attendees
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{event.engagement}%</p>
                        <p className="text-xs text-muted-foreground">engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Content Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentStats.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{content.type}</h4>
                        <p className="text-xs text-muted-foreground">{content.engagement}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{content.count}</p>
                        <p className="text-xs text-green-600">{content.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>
                    Items requiring admin review and approval
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {pendingApprovals.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.user.avatar} alt={item.user.name} />
                        <AvatarFallback>
                          {item.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <span className="text-sm font-medium">{item.type}</span>
                        </div>
                        <p className="font-medium">{item.user.name}</p>
                        <p className="text-sm text-muted-foreground">{item.user.email}</p>
                        {item.user.title && (
                          <p className="text-sm text-muted-foreground">{item.user.title}</p>
                        )}
                        {item.user.graduationYear && (
                          <p className="text-sm text-muted-foreground">Class of {item.user.graduationYear}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted {item.submitted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Contact User</DropdownMenuItem>
                          <DropdownMenuItem>Request Changes</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activity Log
              </CardTitle>
              <CardDescription>
                Real-time platform activity and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.avatar} alt={activity.user} />
                          <AvatarFallback>
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {getStatusIcon(activity.status)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                      {activity.details && (
                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        activity.status === 'success' ? 'bg-green-50 text-green-700' :
                        activity.status === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}