import { useState } from "react"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign,
  Mail,
  Download,
  Edit,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  MessageSquare
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ScrollArea } from "../ui/scroll-area"

interface EventDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: any
}

export function EventDetailsDialog({ open, onOpenChange, event }: EventDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!event) return null

  // Mock attendee data
  const mockAttendees = [
    {
      id: "att-1",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      role: "Alumni",
      registrationDate: "2024-02-01T10:00:00Z",
      attended: event.status === "completed",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "att-2",
      name: "Michael Rodriguez",
      email: "michael.r@email.com",
      role: "Student",
      registrationDate: "2024-02-03T14:30:00Z",
      attended: event.status === "completed",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "att-3",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      role: "Alumni",
      registrationDate: "2024-02-05T09:15:00Z",
      attended: event.status === "completed",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ]

  const mockAnalytics = {
    dailyRegistrations: [
      { date: "2024-02-01", count: 12 },
      { date: "2024-02-02", count: 8 },
      { date: "2024-02-03", count: 15 },
      { date: "2024-02-04", count: 21 },
      { date: "2024-02-05", count: 18 }
    ],
    demographicBreakdown: {
      alumni: 156,
      students: 89,
      faculty: 23,
      staff: 12
    },
    engagementMetrics: {
      emailOpenRate: 78,
      registrationPageViews: 1245,
      socialShares: 34,
      emailClickRate: 42
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const calculateProgress = (registered: number, capacity: number) => {
    return capacity > 0 ? (registered / capacity) * 100 : 0
  }

  const calculateAttendanceRate = (attended: number, registered: number) => {
    return registered > 0 ? Math.round((attended / registered) * 100) : 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[600px]">
                <TabsContent value="overview" className="space-y-6 pr-4">
                  {/* Event Header */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2>{event.title}</h2>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                            {event.featured && (
                              <Badge variant="secondary">Featured</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-4">{event.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                {new Date(event.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {event.ticketPrice > 0 ? `$${event.ticketPrice}` : "Free"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{event.registered}</p>
                          <p className="text-sm text-muted-foreground">Registered</p>
                          <Progress value={calculateProgress(event.registered, event.capacity)} className="mt-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round(calculateProgress(event.registered, event.capacity))}% of capacity
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{event.capacity}</p>
                          <p className="text-sm text-muted-foreground">Capacity</p>
                          <p className="text-sm mt-2">
                            {event.capacity - event.registered} spots remaining
                          </p>
                        </div>
                        <div className="text-center">
                          {event.status === "completed" ? (
                            <>
                              <p className="text-2xl font-bold">{event.attended}</p>
                              <p className="text-sm text-muted-foreground">Attended</p>
                              <p className="text-sm mt-2 text-green-600">
                                {calculateAttendanceRate(event.attended, event.registered)}% attendance rate
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-2xl font-bold">TBD</p>
                              <p className="text-sm text-muted-foreground">Attendance</p>
                              <p className="text-sm mt-2 text-muted-foreground">
                                After event completion
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Organizer Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Event Organizer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                          <AvatarFallback>
                            {event.organizer.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.organizer.name}</h4>
                          <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Event Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Event Type</p>
                          <p>{event.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p>{event.category}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created Date</p>
                          <p>{formatDate(event.createdDate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Registration Deadline</p>
                          <p>{formatDate(event.registrationDeadline)}</p>
                        </div>
                      </div>
                      
                      {event.tags && event.tags.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attendees" className="space-y-6 pr-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Event Attendees</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {event.registered} registered
                          </Badge>
                          {event.status === "completed" && (
                            <Badge className="bg-green-100 text-green-800">
                              {event.attended} attended
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Attendee</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Registered</TableHead>
                            {event.status === "completed" && (
                              <TableHead>Attended</TableHead>
                            )}
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockAttendees.map((attendee) => (
                            <TableRow key={attendee.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={attendee.avatar} alt={attendee.name} />
                                    <AvatarFallback>
                                      {attendee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{attendee.name}</p>
                                    <p className="text-sm text-muted-foreground">{attendee.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {attendee.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatShortDate(attendee.registrationDate)}
                              </TableCell>
                              {event.status === "completed" && (
                                <TableCell>
                                  {attendee.attended ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  )}
                                </TableCell>
                              )}
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6 pr-4">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Registration Timeline */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Registration Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockAnalytics.dailyRegistrations.map((day, index) => (
                            <div key={day.date} className="flex items-center justify-between">
                              <span className="text-sm">{formatShortDate(day.date)}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: `${(day.count / 25) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8">{day.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Demographics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Attendee Demographics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(mockAnalytics.demographicBreakdown).map(([role, count]) => (
                            <div key={role} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{role}</span>
                                <span>{count}</span>
                              </div>
                              <Progress 
                                value={(count / event.registered) * 100} 
                                className="h-2" 
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Engagement Metrics */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-base">Engagement Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                              <Eye className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="font-medium">{mockAnalytics.engagementMetrics.registrationPageViews}</p>
                            <p className="text-xs text-muted-foreground">Page Views</p>
                          </div>
                          <div className="text-center">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                              <Mail className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="font-medium">{mockAnalytics.engagementMetrics.emailOpenRate}%</p>
                            <p className="text-xs text-muted-foreground">Email Open Rate</p>
                          </div>
                          <div className="text-center">
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                              <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="font-medium">{mockAnalytics.engagementMetrics.emailClickRate}%</p>
                            <p className="text-xs text-muted-foreground">Email Click Rate</p>
                          </div>
                          <div className="text-center">
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                              <MessageSquare className="h-6 w-6 text-orange-600" />
                            </div>
                            <p className="font-medium">{mockAnalytics.engagementMetrics.socialShares}</p>
                            <p className="text-xs text-muted-foreground">Social Shares</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="communications" className="space-y-6 pr-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Communication Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button className="h-20 flex-col gap-2">
                          <Mail className="h-6 w-6" />
                          <span>Email All Attendees</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <MessageSquare className="h-6 w-6" />
                          <span>Send Announcement</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <Calendar className="h-6 w-6" />
                          <span>Send Reminder</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                          <Download className="h-6 w-6" />
                          <span>Export Attendee List</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Communications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">Registration Confirmation</p>
                            <p className="text-sm text-muted-foreground">
                              Sent to all registered attendees
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              February 1, 2024 • 245 recipients • 78% open rate
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <MessageSquare className="h-4 w-4 text-green-600 mt-1" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">Event Details Announcement</p>
                            <p className="text-sm text-muted-foreground">
                              Updated event information shared
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              January 28, 2024 • 201 recipients • 65% open rate
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}