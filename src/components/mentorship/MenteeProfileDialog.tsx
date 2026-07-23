import { useState } from "react"
import { 
  User, 
  GraduationCap, 
  Target, 
  Calendar, 
  MessageCircle, 
  Star,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  X
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"

interface MenteeProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mentee?: any
}

export function MenteeProfileDialog({ open, onOpenChange, mentee }: MenteeProfileDialogProps) {
  const [newNote, setNewNote] = useState("")

  if (!mentee) return null

  const mockSessionHistory = [
    {
      id: "session-1",
      date: "2024-02-10T15:00:00Z",
      duration: 60,
      topic: "Career Path Discussion",
      type: "video",
      notes: "Discussed different career paths in tech. Emily is particularly interested in product management roles.",
      completed: true,
      rating: 5
    },
    {
      id: "session-2", 
      date: "2024-01-25T14:00:00Z",
      duration: 45,
      topic: "Resume Review",
      type: "video", 
      notes: "Reviewed Emily's resume and provided feedback on formatting and content. Suggested adding more project details.",
      completed: true,
      rating: 4
    },
    {
      id: "session-3",
      date: "2024-01-10T16:00:00Z", 
      duration: 30,
      topic: "Initial Introduction",
      type: "video",
      notes: "Great first meeting. Emily is motivated and has clear goals. Discussed her background and aspirations.",
      completed: true,
      rating: 5
    }
  ]

  const mockGoals = [
    {
      id: "goal-1",
      title: "Land a software engineering internship", 
      description: "Secure a summer internship at a tech company",
      status: "completed",
      progress: 100,
      dueDate: "2024-03-01T00:00:00Z",
      completedDate: "2024-02-15T00:00:00Z"
    },
    {
      id: "goal-2",
      title: "Build a strong GitHub portfolio",
      description: "Create 3-5 meaningful projects showcasing different skills",
      status: "in-progress", 
      progress: 75,
      dueDate: "2024-04-01T00:00:00Z"
    },
    {
      id: "goal-3",
      title: "Learn about product management",
      description: "Understand PM role and responsibilities through research and networking",
      status: "in-progress",
      progress: 40,
      dueDate: "2024-05-01T00:00:00Z"
    },
    {
      id: "goal-4",
      title: "Practice technical interviews",
      description: "Complete 10 practice coding interviews and improve problem-solving skills",
      status: "not-started",
      progress: 0,
      dueDate: "2024-06-01T00:00:00Z"
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric"
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "in-progress": return "bg-blue-100 text-blue-800"
      case "not-started": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "high": return "text-green-600"
      case "medium": return "text-yellow-600"
      case "low": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mentee Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={mentee.avatar} alt={mentee.name} />
                  <AvatarFallback className="text-lg">
                    {mentee.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="mb-2">{mentee.name}</h2>
                      <div className="flex items-center gap-4 text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {mentee.major}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Class of {mentee.graduationYear}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Mentoring since {formatDate(mentee.connectionDate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${mentee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {mentee.status}
                        </Badge>
                        <Badge className={getEngagementColor(mentee.engagement)}>
                          {mentee.engagement} engagement
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mentee.interests.map((interest: string) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">4.8</span>
                        <span className="text-sm text-muted-foreground">avg rating</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{mentee.totalSessions} sessions</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-lg font-medium">{mentee.totalSessions}</p>
                      <p className="text-xs text-muted-foreground">Total Sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium">{mentee.completedGoals}/{mentee.totalGoals}</p>
                      <p className="text-xs text-muted-foreground">Goals Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium">
                        {calculateProgress(mentee.completedGoals, mentee.totalGoals).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Tabs defaultValue="goals" className="space-y-4">
            <TabsList>
              <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
              <TabsTrigger value="sessions">Session History</TabsTrigger>
              <TabsTrigger value="notes">Notes & Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="goals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockGoals.map((goal) => (
                      <div key={goal.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{goal.title}</h4>
                              <Badge className={getGoalStatusColor(goal.status)}>
                                {goal.status.replace('-', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {goal.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Due: {formatDate(goal.dueDate)}</span>
                              {goal.completedDate && (
                                <span>Completed: {formatDate(goal.completedDate)}</span>
                              )}
                            </div>
                          </div>
                          {goal.status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={goal.progress} className="flex-1" />
                          <span className="text-sm font-medium">{goal.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Session History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSessionHistory.map((session, index) => (
                      <div key={session.id}>
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{session.topic}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{formatDateTime(session.date)}</span>
                                  <span>{session.duration} minutes</span>
                                  <span>{session.type}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span>{session.rating}/5</span>
                                  </div>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            </div>
                            {session.notes && (
                              <p className="text-sm text-muted-foreground">
                                {session.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        {index < mockSessionHistory.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Mentorship Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Notes */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Current Assessment</h4>
                    <p className="text-sm">{mentee.notes}</p>
                  </div>

                  {/* Add New Note */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Add New Note</h4>
                    <Textarea
                      placeholder="Add notes about progress, observations, or recommendations..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={4}
                    />
                    <Button size="sm" disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>

                  {/* Previous Notes */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Previous Notes</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">February 10, 2024</span>
                          <span className="text-xs text-muted-foreground">Session #6</span>
                        </div>
                        <p className="text-sm">
                          Emily showed great improvement in articulating her career goals. 
                          She's much more confident about pursuing product management roles.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">January 25, 2024</span>
                          <span className="text-xs text-muted-foreground">Session #5</span>
                        </div>
                        <p className="text-sm">
                          Resume review went well. Emily implemented all previous suggestions 
                          and her resume now effectively highlights her technical projects.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}