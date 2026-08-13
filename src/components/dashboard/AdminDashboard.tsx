import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { BarChart3, Users, Calendar, MessageSquare, Award, TrendingUp, AlertTriangle, CheckCircle, Clock, UserPlus, DollarSign } from 'lucide-react'

export function AdminDashboard() {
  const overviewStats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Active Events', value: '15', change: '+3', icon: Calendar, color: 'text-green-600' },
    { label: 'Job Postings', value: '89', change: '+23%', icon: Award, color: 'text-purple-600' },
    { label: 'Monthly Revenue', value: '$12,450', change: '+8%', icon: DollarSign, color: 'text-orange-600' },
  ]

  const userBreakdown = [
    { role: 'Students', count: 1654, percentage: 58 },
    { role: 'Alumni', count: 1138, percentage: 40 },
    { role: 'Admins', count: 55, percentage: 2 },
  ]

  const pendingApprovals = [
    {
      type: 'User Registration',
      name: 'John Smith',
      role: 'Alumni',
      submitted: '2 hours ago',
      status: 'pending'
    },
    {
      type: 'Job Posting',
      name: 'Software Engineer at TechCorp',
      company: 'TechCorp',
      submitted: '1 day ago',
      status: 'pending'
    },
    {
      type: 'Event Creation',
      name: 'Annual Alumni Gala',
      organizer: 'Sarah Johnson',
      submitted: '3 hours ago',
      status: 'pending'
    }
  ]

  const recentActivity = [
    {
      action: 'New user registered',
      user: 'Emily Davis (Student)',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      action: 'Event created',
      user: 'Tech Alumni Meetup',
      time: '1 hour ago',
      status: 'success'
    },
    {
      action: 'Job posting reported',
      user: 'Marketing Manager position',
      time: '2 hours ago',
      status: 'warning'
    },
    {
      action: 'Donation received',
      user: '$500 from Marcus Johnson',
      time: '3 hours ago',
      status: 'success'
    }
  ]

  const contentModeration = [
    {
      type: 'Job Post',
      title: 'Senior Developer Position',
      reporter: 'Anonymous',
      reason: 'Misleading information',
      time: '1 hour ago'
    },
    {
      type: 'User Profile',
      title: 'Alex Chen Profile',
      reporter: 'Sarah Davis',
      reason: 'Inappropriate content',
      time: '3 hours ago'
    }
  ]

  const engagementMetrics = [
    { metric: 'Daily Active Users', value: 456, target: 500, percentage: 91 },
    { metric: 'Event Attendance Rate', value: 78, target: 80, percentage: 98 },
    { metric: 'Job Application Rate', value: 67, target: 70, percentage: 96 },
    { metric: 'Message Response Rate', value: 89, target: 85, percentage: 105 },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard 📊</h1>
        <p className="text-muted-foreground mb-4">
          Monitor platform performance and manage the alumni community
        </p>
        <div className="flex gap-3">
          <Button>Broadcast Announcement</Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => {
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
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Approvals */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>
                    Items requiring admin approval
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingApprovals.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{item.type}</h4>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {item.submitted}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Pending Items
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100' : 
                      activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <div className={`h-2 w-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-600' : 
                        activity.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* User Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>
                  Breakdown of users by role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userBreakdown.map((user, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{user.role}</span>
                      <span className="text-sm text-muted-foreground">
                        {user.count} ({user.percentage}%)
                      </span>
                    </div>
                    <Progress value={user.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* User Actions */}
            <Card>
              <CardHeader>
                <CardTitle>User Management Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <UserPlus className="h-6 w-6 mb-2" />
                    Add User
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    Bulk Import
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    User Reports
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Content Moderation Queue
              </CardTitle>
              <CardDescription>
                Reported content requiring review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentModeration.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{item.type}</Badge>
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reported by: {item.reporter} • Reason: {item.reason}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Review</Button>
                    <Button size="sm" variant="outline">Dismiss</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                Key performance indicators for platform engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {engagementMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <span className="text-sm text-muted-foreground">
                      {metric.value} / {metric.target}
                    </span>
                  </div>
                  <Progress value={metric.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {metric.percentage}% of target achieved
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}