import { useState } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Briefcase,
  Heart,
  MessageSquare,
  Eye,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  DollarSign,
  BookOpen,
  Award
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface ReportsAnalyticsProps {
  className?: string
}

export function ReportsAnalytics({ className }: ReportsAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for analytics
  const overviewMetrics = {
    totalUsers: { value: 2847, change: 12.5, trend: "up" },
    activeUsers: { value: 1456, change: 8.3, trend: "up" },
    newRegistrations: { value: 156, change: -3.2, trend: "down" },
    userEngagement: { value: 78, change: 5.7, trend: "up" },
    totalDonations: { value: 89750, change: 15.2, trend: "up" },
    averageDonation: { value: 125, change: 2.8, trend: "up" },
    totalEvents: { value: 45, change: 18.9, trend: "up" },
    eventAttendance: { value: 87, change: 4.1, trend: "up" },
    jobPostings: { value: 234, change: 22.3, trend: "up" },
    applicationRate: { value: 67, change: -1.8, trend: "down" },
    alumniStories: { value: 156, change: 28.4, trend: "up" },
    storyEngagement: { value: 4.2, change: 12.1, trend: "up" }
  }

  const userAnalytics = {
    demographics: {
      byRole: [
        { role: "Students", count: 1654, percentage: 58.1 },
        { role: "Alumni", count: 1138, percentage: 40.0 },
        { role: "Faculty", count: 55, percentage: 1.9 }
      ],
      byGradYear: [
        { year: "2024", count: 234, percentage: 20.6 },
        { year: "2023", count: 198, percentage: 17.4 },
        { year: "2022", count: 167, percentage: 14.7 },
        { year: "2021", count: 145, percentage: 12.7 },
        { year: "2020", count: 123, percentage: 10.8 },
        { year: "Other", count: 271, percentage: 23.8 }
      ],
      byMajor: [
        { major: "Computer Science", count: 456, percentage: 40.1 },
        { major: "Business", count: 234, percentage: 20.6 },
        { major: "Engineering", count: 189, percentage: 16.6 },
        { major: "Liberal Arts", count: 134, percentage: 11.8 },
        { major: "Other", count: 125, percentage: 11.0 }
      ]
    },
    activity: {
      dailyActive: [
        { date: "2024-02-10", count: 456 },
        { date: "2024-02-11", count: 423 },
        { date: "2024-02-12", count: 498 },
        { date: "2024-02-13", count: 467 },
        { date: "2024-02-14", count: 512 }
      ],
      topActions: [
        { action: "Profile Views", count: 2341 },
        { action: "Message Sent", count: 1876 },
        { action: "Event Registration", count: 1234 },
        { action: "Job Application", count: 987 },
        { action: "Story Shared", count: 567 }
      ]
    }
  }

  const donationAnalytics = {
    summary: {
      totalAmount: 89750,
      totalDonors: 234,
      averageAmount: 125,
      recurringDonors: 89,
      topCampaign: "Student Emergency Fund"
    },
    campaigns: [
      { name: "Student Emergency Fund", raised: 34500, goal: 50000, donors: 89 },
      { name: "Innovation Lab", raised: 28750, goal: 100000, donors: 67 },
      { name: "Scholarship Program", raised: 26500, goal: 75000, donors: 78 }
    ],
    trends: [
      { month: "Oct", amount: 12500 },
      { month: "Nov", amount: 18750 },
      { month: "Dec", amount: 24300 },
      { month: "Jan", amount: 19800 },
      { month: "Feb", amount: 28400 }
    ]
  }

  const jobAnalytics = {
    summary: {
      totalPostings: 234,
      activePostings: 89,
      totalApplications: 1876,
      avgApplicationsPerJob: 8.0,
      topCategory: "Technology"
    },
    categories: [
      { category: "Technology", postings: 89, applications: 712 },
      { category: "Business", postings: 56, applications: 448 },
      { category: "Finance", postings: 34, applications: 306 },
      { category: "Healthcare", postings: 28, applications: 224 },
      { category: "Education", postings: 27, applications: 186 }
    ],
    trends: {
      postings: [
        { month: "Oct", count: 45 },
        { month: "Nov", count: 52 },
        { month: "Dec", count: 38 },
        { month: "Jan", count: 67 },
        { month: "Feb", count: 32 }
      ],
      applications: [
        { month: "Oct", count: 387 },
        { month: "Nov", count: 445 },
        { month: "Dec", count: 324 },
        { month: "Jan", count: 512 },
        { month: "Feb", count: 208 }
      ]
    }
  }

  const eventAnalytics = {
    summary: {
      totalEvents: 45,
      totalAttendees: 2341,
      averageAttendance: 87,
      upcomingEvents: 12,
      topEventType: "Networking"
    },
    types: [
      { type: "Networking", events: 15, attendance: 1245 },
      { type: "Career", events: 12, attendance: 987 },
      { type: "Social", events: 8, attendance: 654 },
      { type: "Educational", events: 6, attendance: 432 },
      { type: "Alumni", events: 4, attendance: 278 }
    ],
    performance: [
      { name: "Tech Alumni Meetup", attendees: 156, rating: 4.8 },
      { name: "Career Fair 2024", attendees: 234, rating: 4.6 },
      { name: "Annual Gala", attendees: 198, rating: 4.9 },
      { name: "Startup Pitch Night", attendees: 134, rating: 4.7 },
      { name: "Alumni Mixer", attendees: 112, rating: 4.5 }
    ]
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "k"
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <ArrowUp className="h-3 w-3 text-green-600" />
    ) : (
      <ArrowDown className="h-3 w-3 text-red-600" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into platform performance and user engagement
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
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Custom Report
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total Users</span>
              </div>
              <p className="text-xl font-bold">{formatNumber(overviewMetrics.totalUsers.value)}</p>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(overviewMetrics.totalUsers.trend)}`}>
                {getTrendIcon(overviewMetrics.totalUsers.trend)}
                {overviewMetrics.totalUsers.change}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <p className="text-xl font-bold">{formatNumber(overviewMetrics.activeUsers.value)}</p>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(overviewMetrics.activeUsers.trend)}`}>
                {getTrendIcon(overviewMetrics.activeUsers.trend)}
                {overviewMetrics.activeUsers.change}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Donations</span>
              </div>
              <p className="text-xl font-bold">{formatCurrency(overviewMetrics.totalDonations.value)}</p>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(overviewMetrics.totalDonations.trend)}`}>
                {getTrendIcon(overviewMetrics.totalDonations.trend)}
                {overviewMetrics.totalDonations.change}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Events</span>
              </div>
              <p className="text-xl font-bold">{overviewMetrics.totalEvents.value}</p>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(overviewMetrics.totalEvents.trend)}`}>
                {getTrendIcon(overviewMetrics.totalEvents.trend)}
                {overviewMetrics.totalEvents.change}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Job Postings</span>
              </div>
              <p className="text-xl font-bold">{overviewMetrics.jobPostings.value}</p>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(overviewMetrics.jobPostings.trend)}`}>
                {getTrendIcon(overviewMetrics.jobPostings.trend)}
                {overviewMetrics.jobPostings.change}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium">Stories</span>
              </div>
              <p className="text-xl font-bold">{overviewMetrics.alumniStories.value}</p>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(overviewMetrics.alumniStories.trend)}`}>
                {getTrendIcon(overviewMetrics.alumniStories.trend)}
                {overviewMetrics.alumniStories.change}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Platform Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Registrations</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">156 this month</span>
                        <Badge className="bg-green-100 text-green-800">+12%</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Active Users</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">1,456 average</span>
                        <Badge className="bg-green-100 text-green-800">+8%</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Engagement</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">78% rate</span>
                        <Badge className="bg-green-100 text-green-800">+6%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Performing Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Tech Career Fair</p>
                        <p className="text-xs text-muted-foreground">Event</p>
                      </div>
                      <span className="text-sm font-medium">234 attendees</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">My Journey to Google</p>
                        <p className="text-xs text-muted-foreground">Alumni Story</p>
                      </div>
                      <span className="text-sm font-medium">1,234 views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Senior Developer Role</p>
                        <p className="text-xs text-muted-foreground">Job Posting</p>
                      </div>
                      <span className="text-sm font-medium">67 applications</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* User Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">By Role</h4>
                    <div className="space-y-3">
                      {userAnalytics.demographics.byRole.map((item) => (
                        <div key={item.role} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.role}</span>
                            <span>{item.count} ({item.percentage}%)</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">By Major</h4>
                    <div className="space-y-3">
                      {userAnalytics.demographics.byMajor.map((item) => (
                        <div key={item.major} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.major}</span>
                            <span>{item.count} ({item.percentage}%)</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Top Actions (Last 30 Days)</h4>
                    {userAnalytics.activity.topActions.map((action) => (
                      <div key={action.action} className="flex items-center justify-between">
                        <span className="text-sm">{action.action}</span>
                        <span className="text-sm font-medium">{formatNumber(action.count)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Donation Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Donation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatCurrency(donationAnalytics.summary.totalAmount)}</p>
                      <p className="text-sm text-muted-foreground">Total Raised</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{donationAnalytics.summary.totalDonors}</p>
                      <p className="text-sm text-muted-foreground">Total Donors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatCurrency(donationAnalytics.summary.averageAmount)}</p>
                      <p className="text-sm text-muted-foreground">Average Donation</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{donationAnalytics.summary.recurringDonors}</p>
                      <p className="text-sm text-muted-foreground">Recurring Donors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donationAnalytics.campaigns.map((campaign) => (
                      <div key={campaign.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{campaign.name}</span>
                          <span>{formatCurrency(campaign.raised)} / {formatCurrency(campaign.goal)}</span>
                        </div>
                        <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{campaign.donors} donors</span>
                          <span>{Math.round((campaign.raised / campaign.goal) * 100)}% complete</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Job Posting Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Job Posting Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{jobAnalytics.summary.totalPostings}</p>
                      <p className="text-sm text-muted-foreground">Total Postings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{jobAnalytics.summary.activePostings}</p>
                      <p className="text-sm text-muted-foreground">Active Postings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{jobAnalytics.summary.totalApplications}</p>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{jobAnalytics.summary.avgApplicationsPerJob.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">Avg per Job</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobAnalytics.categories.map((category) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{category.category}</p>
                          <p className="text-xs text-muted-foreground">{category.postings} postings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{category.applications}</p>
                          <p className="text-xs text-muted-foreground">applications</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Event Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Event Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{eventAnalytics.summary.totalEvents}</p>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{eventAnalytics.summary.totalAttendees}</p>
                      <p className="text-sm text-muted-foreground">Total Attendees</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{eventAnalytics.summary.averageAttendance}%</p>
                      <p className="text-sm text-muted-foreground">Avg Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{eventAnalytics.summary.upcomingEvents}</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventAnalytics.performance.map((event) => (
                      <div key={event.name} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{event.name}</p>
                          <p className="text-xs text-muted-foreground">{event.attendees} attendees</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{event.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}