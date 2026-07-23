import { useState } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase,
  Award,
  Activity,
  MessageSquare,
  Heart,
  UserCheck,
  UserX,
  Edit,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: any
}

export function UserProfileDialog({ open, onOpenChange, user }: UserProfileDialogProps) {
  const [activeTab, setActiveTab] = useState("profile")

  if (!user) return null

  const mockActivity = [
    {
      type: "login",
      description: "Logged into platform",
      timestamp: "2024-02-14T14:30:00Z",
      details: "San Francisco, CA"
    },
    {
      type: "mentorship",
      description: "Started mentoring Emily Davis",
      timestamp: "2024-02-13T10:00:00Z",
      details: "Computer Science student"
    },
    {
      type: "donation",
      description: "Made donation to Emergency Fund",
      timestamp: "2024-02-12T16:15:00Z",
      details: "$250 contribution"
    },
    {
      type: "event",
      description: "Attended Tech Alumni Meetup",
      timestamp: "2024-02-10T18:00:00Z",
      details: "Networking event"
    }
  ]

  const mockConnections = [
    {
      id: "conn-1",
      name: "Alex Thompson",
      role: "Student",
      type: "Mentee",
      since: "2024-01-15",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "conn-2",
      name: "Jennifer Liu",
      role: "Alumni",
      type: "Colleague",
      since: "2023-11-20",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "suspended": return "bg-red-100 text-red-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "alumni": return "bg-blue-100 text-blue-800"
      case "student": return "bg-purple-100 text-purple-800"
      case "admin": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login": return <Activity className="h-4 w-4 text-blue-600" />
      case "mentorship": return <UserCheck className="h-4 w-4 text-green-600" />
      case "donation": return <Heart className="h-4 w-4 text-red-600" />
      case "event": return <Calendar className="h-4 w-4 text-purple-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[600px]">
                <TabsContent value="profile" className="space-y-6 pr-4">
                  {/* Header Section */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-lg">
                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h2>{user.name}</h2>
                                {user.verified && (
                                  <CheckCircle className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className={getRoleColor(user.role)}>
                                  {user.role}
                                </Badge>
                                <Badge className={getStatusColor(user.status)}>
                                  {user.status}
                                </Badge>
                              </div>
                              {user.position && user.company && (
                                <p className="text-muted-foreground mb-2">
                                  {user.position} at {user.company}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  {user.major} • Class of {user.graduationYear}
                                </div>
                                {user.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {user.location}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-sm text-muted-foreground">{user.phone}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Joined</p>
                            <p className="text-sm text-muted-foreground">{formatDate(user.joinDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Last Login</p>
                            <p className="text-sm text-muted-foreground">{formatDateTime(user.lastLogin)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Activity Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Platform Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {user.role === "alumni" ? (
                          <>
                            <div className="text-center">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                <UserCheck className="h-6 w-6 text-blue-600" />
                              </div>
                              <p className="font-medium">{user.stats.mentorships}</p>
                              <p className="text-xs text-muted-foreground">Mentorships</p>
                            </div>
                            <div className="text-center">
                              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                                <Heart className="h-6 w-6 text-red-600" />
                              </div>
                              <p className="font-medium">{user.stats.donations}</p>
                              <p className="text-xs text-muted-foreground">Donations</p>
                            </div>
                            <div className="text-center">
                              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                                <Calendar className="h-6 w-6 text-purple-600" />
                              </div>
                              <p className="font-medium">{user.stats.events}</p>
                              <p className="text-xs text-muted-foreground">Events</p>
                            </div>
                            <div className="text-center">
                              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                                <Award className="h-6 w-6 text-green-600" />
                              </div>
                              <p className="font-medium">{user.stats.stories}</p>
                              <p className="text-xs text-muted-foreground">Stories</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-center">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                              </div>
                              <p className="font-medium">{user.stats.applications}</p>
                              <p className="text-xs text-muted-foreground">Applications</p>
                            </div>
                            <div className="text-center">
                              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                                <Calendar className="h-6 w-6 text-purple-600" />
                              </div>
                              <p className="font-medium">{user.stats.events}</p>
                              <p className="text-xs text-muted-foreground">Events</p>
                            </div>
                            <div className="text-center">
                              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                                <UserCheck className="h-6 w-6 text-green-600" />
                              </div>
                              <p className="font-medium">{user.stats.connections}</p>
                              <p className="text-xs text-muted-foreground">Connections</p>
                            </div>
                            <div className="text-center">
                              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                                <MessageSquare className="h-6 w-6 text-orange-600" />
                              </div>
                              <p className="font-medium">89%</p>
                              <p className="text-xs text-muted-foreground">Response Rate</p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6 pr-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockActivity.map((activity, index) => (
                          <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{activity.description}</p>
                              <p className="text-sm text-muted-foreground">{activity.details}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDateTime(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="connections" className="space-y-6 pr-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockConnections.map((connection) => (
                          <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={connection.avatar} alt={connection.name} />
                                <AvatarFallback>
                                  {connection.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{connection.name}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {connection.role}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {connection.type}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Connected since {formatDate(connection.since)}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="admin" className="space-y-6 pr-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Admin Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.status === "pending" && (
                          <>
                            <Button className="justify-start">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve User
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <UserX className="h-4 w-4 mr-2" />
                              Reject Application
                            </Button>
                          </>
                        )}
                        {user.status === "active" && (
                          <Button variant="outline" className="justify-start">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Suspend User
                          </Button>
                        )}
                        {user.status === "suspended" && (
                          <Button className="justify-start">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Reactivate User
                          </Button>
                        )}
                        <Button variant="outline" className="justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Grant Admin Access
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">User ID</p>
                          <p className="font-mono">{user.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Account Created</p>
                          <p>{formatDate(user.joinDate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email Verified</p>
                          <p>{user.verified ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Login Count</p>
                          <p>47 times</p>
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