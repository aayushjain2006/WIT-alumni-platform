import { useState, useMemo } from "react"
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  PhoneCall
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Progress } from "../ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useAuth } from "../../contexts/AuthContext"
import { ScheduleCallDialog } from "./ScheduleCallDialog"
import { MenteeProfileDialog } from "./MenteeProfileDialog"
import { SetAvailabilityDialog } from "./SetAvailabilityDialog"

const mockMentees = [
  {
    id: "mentee-1",
    name: "Emily Davis",
    email: "emily.davis@university.edu",
    major: "Computer Science",
    year: "2026",
    graduationYear: "2026",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    connectionDate: "2024-01-15T10:00:00Z",
    status: "active",
    interests: ["Software Development", "AI/ML", "Product Management"],
    goals: ["Land a software engineering internship", "Build a strong GitHub portfolio", "Learn about career paths in tech"],
    nextMeeting: "2024-02-18T15:00:00Z",
    totalSessions: 6,
    completedGoals: 2,
    totalGoals: 5,
    lastInteraction: "2024-02-10T14:30:00Z",
    engagement: "high",
    notes: "Very motivated student, great questions about career development"
  },
  {
    id: "mentee-2", 
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    major: "Business Administration",
    year: "2025",
    graduationYear: "2025",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    connectionDate: "2024-02-01T09:00:00Z",
    status: "active",
    interests: ["Entrepreneurship", "Marketing", "E-commerce"],
    goals: ["Start a business", "Build a network", "Learn about funding"],
    nextMeeting: "2024-02-20T10:00:00Z",
    totalSessions: 3,
    completedGoals: 1,
    totalGoals: 4,
    lastInteraction: "2024-02-12T16:00:00Z",
    engagement: "medium",
    notes: "Ambitious entrepreneur, needs guidance on business planning"
  },
  {
    id: "mentee-3",
    name: "Sarah Kim",
    email: "sarah.kim@university.edu", 
    major: "Data Science",
    year: "2024",
    graduationYear: "2024",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    connectionDate: "2023-11-20T11:00:00Z",
    status: "completed",
    interests: ["Machine Learning", "Analytics", "Research"],
    goals: ["Complete thesis project", "Find full-time role", "Publish research"],
    nextMeeting: null,
    totalSessions: 12,
    completedGoals: 4,
    totalGoals: 4,
    lastInteraction: "2024-01-25T13:00:00Z",
    engagement: "high",
    notes: "Successfully graduated and started role at Google. Great success story!"
  },
  {
    id: "mentee-4",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@university.edu",
    major: "Engineering",
    year: "2027",
    graduationYear: "2027",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    connectionDate: "2024-02-05T14:00:00Z",
    status: "pending",
    interests: ["Mechanical Engineering", "Robotics", "Innovation"],
    goals: ["Explore engineering specializations", "Find research opportunities", "Build technical skills"],
    nextMeeting: "2024-02-16T11:00:00Z",
    totalSessions: 1,
    completedGoals: 0,
    totalGoals: 3,
    lastInteraction: "2024-02-05T14:00:00Z",
    engagement: "new",
    notes: "New mentee, first session went well"
  }
]

const mockUpcomingSessions = [
  {
    id: "session-1",
    menteeId: "mentee-4",
    menteeName: "Michael Rodriguez",
    date: "2024-02-16T11:00:00Z",
    duration: 60,
    type: "video",
    topic: "Career Exploration in Engineering",
    status: "confirmed",
    meetingLink: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "session-2", 
    menteeId: "mentee-1",
    menteeName: "Emily Davis",
    date: "2024-02-18T15:00:00Z",
    duration: 45,
    type: "video",
    topic: "Portfolio Review & Interview Prep",
    status: "confirmed",
    meetingLink: "https://zoom.us/j/123456789"
  },
  {
    id: "session-3",
    menteeId: "mentee-2",
    menteeName: "Alex Chen", 
    date: "2024-02-20T10:00:00Z",
    duration: 60,
    type: "phone",
    topic: "Business Plan Discussion",
    status: "pending",
    meetingLink: null
  }
]

const mockAvailability = {
  timezone: "PST",
  weeklyHours: 4,
  preferredTimes: ["Tuesday 2-4 PM", "Thursday 3-5 PM", "Saturday 10-12 PM"],
  maxMentees: 6,
  currentMentees: 4
}

interface MentorshipDashboardProps {
  className?: string
}

export function MentorshipDashboard({ className }: MentorshipDashboardProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false)
  const [selectedMentee, setSelectedMentee] = useState<any>(null)

  // Filter mentees
  const filteredMentees = useMemo(() => {
    let filtered = mockMentees

    if (searchQuery) {
      filtered = filtered.filter(mentee =>
        mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentee.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentee.interests.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(mentee => mentee.status === statusFilter)
    }

    return filtered
  }, [searchQuery, statusFilter])

  const stats = {
    totalMentees: mockMentees.length,
    activeMentees: mockMentees.filter(m => m.status === "active").length,
    completedMentorships: mockMentees.filter(m => m.status === "completed").length,
    totalSessions: mockMentees.reduce((sum, m) => sum + m.totalSessions, 0),
    averageEngagement: mockMentees.reduce((sum, m) => {
      const engagement = m.engagement === "high" ? 3 : m.engagement === "medium" ? 2 : 1
      return sum + engagement
    }, 0) / mockMentees.length,
    upcomingSessions: mockUpcomingSessions.length
  }

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "high": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800" 
      case "low": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "paused": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short", 
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0
  }

  const handleScheduleCall = (mentee: any) => {
    setSelectedMentee(mentee)
    setShowScheduleDialog(true)
  }

  const handleViewProfile = (mentee: any) => {
    setSelectedMentee(mentee)
    setShowProfileDialog(true)
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Mentorship Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your mentees, schedule calls, and track mentorship progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowAvailabilityDialog(true)}>
              <Clock className="h-4 w-4 mr-2" />
              Set Availability
            </Button>
            <Button onClick={() => setShowScheduleDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Mentees</p>
                  <p className="font-medium">{stats.totalMentees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="font-medium">{stats.activeMentees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="font-medium">{stats.completedMentorships}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Video className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="font-medium">{stats.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="font-medium">{stats.upcomingSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="font-medium">{(stats.averageEngagement).toFixed(1)}/3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="mentees" className="space-y-6">
          <TabsList>
            <TabsTrigger value="mentees">My Mentees</TabsTrigger>
            <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="mentees" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search mentees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Mentees Grid */}
            <div className="grid gap-6">
              {filteredMentees.map((mentee) => (
                <Card key={mentee.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentee.avatar} alt={mentee.name} />
                          <AvatarFallback>
                            {mentee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="mb-1">{mentee.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {mentee.major} • Class of {mentee.graduationYear}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(mentee.status)}>
                              {mentee.status}
                            </Badge>
                            <Badge className={getEngagementColor(mentee.engagement)}>
                              {mentee.engagement} engagement
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mentee.interests.slice(0, 3).map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                            {mentee.interests.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{mentee.interests.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewProfile(mentee)}>
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleScheduleCall(mentee)}>
                            Schedule Call
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Add Notes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Goal Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={calculateProgress(mentee.completedGoals, mentee.totalGoals)} 
                            className="flex-1"
                          />
                          <span className="text-sm font-medium">
                            {mentee.completedGoals}/{mentee.totalGoals}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                        <p className="font-medium">{mentee.totalSessions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {mentee.nextMeeting ? "Next Meeting" : "Last Interaction"}
                        </p>
                        <p className="font-medium text-sm">
                          {mentee.nextMeeting 
                            ? formatDate(mentee.nextMeeting)
                            : formatDate(mentee.lastInteraction)
                          }
                        </p>
                      </div>
                    </div>

                    {mentee.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Latest Notes</p>
                        <p className="text-sm">{mentee.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleScheduleCall(mentee)}
                        disabled={mentee.status === "completed"}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewProfile(mentee)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMentees.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="mb-2">No mentees found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search criteria or filters."
                      : "You don't have any mentees yet. Students will be able to request mentorship from you through the alumni connect system."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {session.type === "video" ? (
                            <Video className="h-5 w-5 text-blue-600" />
                          ) : (
                            <PhoneCall className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{session.topic}</h4>
                          <p className="text-sm text-muted-foreground">
                            with {session.menteeName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(session.date)} • {session.duration} minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={session.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {session.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          {session.meetingLink ? "Join Call" : "Reschedule"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="mb-4">Current Schedule</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Weekly Hours:</span>
                        <span className="font-medium">{mockAvailability.weeklyHours} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Timezone:</span>
                        <span className="font-medium">{mockAvailability.timezone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max Mentees:</span>
                        <span className="font-medium">{mockAvailability.maxMentees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Mentees:</span>
                        <span className="font-medium">{mockAvailability.currentMentees}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-4">Preferred Times</h4>
                    <div className="space-y-2">
                      {mockAvailability.preferredTimes.map((time, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={() => setShowAvailabilityDialog(true)}>
                  Update Availability
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <ScheduleCallDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        mentee={selectedMentee}
      />

      <MenteeProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        mentee={selectedMentee}
      />

      <SetAvailabilityDialog
        open={showAvailabilityDialog}
        onOpenChange={setShowAvailabilityDialog}
        currentAvailability={mockAvailability}
      />
    </div>
  )
}