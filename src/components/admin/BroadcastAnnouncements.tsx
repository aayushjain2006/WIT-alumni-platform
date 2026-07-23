import { useState } from "react"
import { 
  Megaphone, 
  Send, 
  Users, 
  Mail, 
  MessageSquare, 
  Calendar,
  Eye,
  Clock,
  Target,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { Switch } from "../ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Progress } from "../ui/progress"
import { useNotifications } from "../../contexts/NotificationContext"
import { CreateAnnouncementDialog } from "./CreateAnnouncementDialog"

const mockAnnouncements = [
  {
    id: "ann-1",
    title: "New Alumni Scholarship Program Launch",
    content: "We're excited to announce the launch of our new scholarship program...",
    type: "scholarship",
    priority: "high",
    status: "sent",
    createdDate: "2024-02-10T10:00:00Z",
    sentDate: "2024-02-10T14:00:00Z",
    scheduledDate: null,
    targetAudience: {
      roles: ["student", "alumni"],
      graduationYears: ["2023", "2024", "2025"],
      majors: ["all"],
      totalRecipients: 1890
    },
    engagement: {
      sent: 1890,
      delivered: 1867,
      opened: 1243,
      clicked: 456,
      openRate: 66.6,
      clickRate: 24.4
    }
  },
  {
    id: "ann-2",
    title: "Annual Alumni Gala Registration Now Open",
    content: "Join us for an evening of celebration and networking...",
    type: "event",
    priority: "medium",
    status: "scheduled",
    createdDate: "2024-02-08T09:00:00Z",
    sentDate: null,
    scheduledDate: "2024-02-16T10:00:00Z",
    targetAudience: {
      roles: ["alumni"],
      graduationYears: ["all"],
      majors: ["all"],
      totalRecipients: 1138
    },
    engagement: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0
    }
  },
  {
    id: "ann-3", 
    title: "Platform Maintenance Scheduled",
    content: "Please be aware that the platform will undergo maintenance...",
    type: "system",
    priority: "high",
    status: "draft",
    createdDate: "2024-02-12T16:30:00Z",
    sentDate: null,
    scheduledDate: null,
    targetAudience: {
      roles: ["student", "alumni", "admin"],
      graduationYears: ["all"],
      majors: ["all"],
      totalRecipients: 2847
    },
    engagement: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0
    }
  },
  {
    id: "ann-4",
    title: "Tech Career Fair - Final Call for Registration",
    content: "Don't miss out on this opportunity to connect with top employers...",
    type: "career",
    priority: "high",
    status: "sent",
    createdDate: "2024-02-05T11:00:00Z",
    sentDate: "2024-02-06T08:00:00Z",
    scheduledDate: null,
    targetAudience: {
      roles: ["student"],
      graduationYears: ["2024", "2025"],
      majors: ["Computer Science", "Engineering"],
      totalRecipients: 456
    },
    engagement: {
      sent: 456,
      delivered: 451,
      opened: 378,
      clicked: 189,
      openRate: 83.8,
      clickRate: 50.0
    }
  }
]

interface BroadcastAnnouncementsProps {
  className?: string
}

export function BroadcastAnnouncements({ className }: BroadcastAnnouncementsProps) {
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState("announcements")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const stats = {
    totalAnnouncements: mockAnnouncements.length,
    sentThisMonth: mockAnnouncements.filter(a => a.status === "sent").length,
    scheduledAnnouncements: mockAnnouncements.filter(a => a.status === "scheduled").length,
    averageOpenRate: mockAnnouncements
      .filter(a => a.status === "sent")
      .reduce((sum, a) => sum + a.engagement.openRate, 0) / mockAnnouncements.filter(a => a.status === "sent").length,
    totalRecipients: mockAnnouncements.reduce((sum, a) => sum + a.targetAudience.totalRecipients, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-100 text-green-800"
      case "scheduled": return "bg-blue-100 text-blue-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event": return "bg-purple-100 text-purple-800"
      case "career": return "bg-blue-100 text-blue-800"
      case "scholarship": return "bg-green-100 text-green-800"
      case "system": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const handleAnnouncementAction = (action: string, announcement: any) => {
    const actionMessages: { [key: string]: string } = {
      send: "sent successfully",
      schedule: "scheduled",
      duplicate: "duplicated",
      delete: "deleted"
    }

    addNotification({
      type: "system",
      title: `Announcement ${actionMessages[action] || 'updated'}`,
      description: `"${announcement.title}" has been ${actionMessages[action] || 'updated'}`,
      isRead: false
    })

    switch (action) {
      case "send":
      case "schedule":
      case "duplicate":
      case "delete":
        // In real app, would make API call
        console.log(`${action} announcement:`, announcement.id)
        break
      default:
        break
    }
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Broadcast Announcements</h1>
            <p className="text-muted-foreground">
              Create and manage platform-wide communications to your alumni community
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Megaphone className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold">{stats.totalAnnouncements}</p>
              <p className="text-xs text-muted-foreground">Total Announcements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Send className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-lg font-bold">{stats.sentThisMonth}</p>
              <p className="text-xs text-muted-foreground">Sent This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-lg font-bold">{stats.scheduledAnnouncements}</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-lg font-bold">{stats.averageOpenRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Avg Open Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-lg font-bold">{stats.totalRecipients.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Reach</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="announcements">All Announcements</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Announcement</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAnnouncements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium truncate">{announcement.title}</p>
                              <Badge className={getPriorityColor(announcement.priority)}>
                                {announcement.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {announcement.content}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(announcement.type)}>
                            {announcement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(announcement.status)}>
                            {announcement.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{announcement.targetAudience.totalRecipients}</p>
                            <p className="text-muted-foreground">
                              {announcement.targetAudience.roles.join(", ")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {announcement.status === "sent" ? (
                            <div className="text-sm">
                              <p>{announcement.engagement.openRate.toFixed(1)}% opened</p>
                              <p className="text-muted-foreground">
                                {announcement.engagement.clickRate.toFixed(1)}% clicked
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {announcement.status === "sent" && announcement.sentDate && (
                              <p>Sent {formatDate(announcement.sentDate)}</p>
                            )}
                            {announcement.status === "scheduled" && announcement.scheduledDate && (
                              <p>Scheduled {formatDate(announcement.scheduledDate)}</p>
                            )}
                            {announcement.status === "draft" && (
                              <p>Created {formatDate(announcement.createdDate)}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {announcement.status === "draft" && (
                                <>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAnnouncementAction("send", announcement)}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Now
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAnnouncementAction("schedule", announcement)}>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Schedule
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => handleAnnouncementAction("duplicate", announcement)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleAnnouncementAction("delete", announcement)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Scheduled Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnnouncements
                    .filter(a => a.status === "scheduled")
                    .map((announcement) => (
                      <div key={announcement.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{announcement.title}</h4>
                            <Badge className={getTypeColor(announcement.type)}>
                              {announcement.type}
                            </Badge>
                            <Badge className={getPriorityColor(announcement.priority)}>
                              {announcement.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {announcement.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{announcement.targetAudience.totalRecipients} recipients</span>
                            <span>•</span>
                            <span>Scheduled for {announcement.scheduledDate && formatDate(announcement.scheduledDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button size="sm" onClick={() => handleAnnouncementAction("send", announcement)}>
                            Send Now
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Announcement Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Event Announcement</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Template for announcing upcoming events and activities
                    </p>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Career Opportunity</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Template for sharing job opportunities and career resources
                    </p>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">System Update</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Template for platform updates and maintenance notifications
                    </p>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Scholarship Alert</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Template for scholarship opportunities and funding announcements
                    </p>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Sent</span>
                      <span className="font-medium">2,346</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Open Rate</span>
                      <span className="font-medium">{stats.averageOpenRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Click Rate</span>
                      <span className="font-medium">37.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Unsubscribe Rate</span>
                      <span className="font-medium">0.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Performing Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle>Best Performing Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnnouncements
                      .filter(a => a.status === "sent")
                      .sort((a, b) => b.engagement.openRate - a.engagement.openRate)
                      .slice(0, 3)
                      .map((announcement) => (
                        <div key={announcement.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm truncate">{announcement.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {announcement.targetAudience.totalRecipients} recipients
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">{announcement.engagement.openRate.toFixed(1)}%</p>
                            <p className="text-xs text-muted-foreground">open rate</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnnouncements
                    .filter(a => a.status === "sent")
                    .map((announcement) => (
                      <div key={announcement.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{announcement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Sent {announcement.sentDate && formatDate(announcement.sentDate)}
                            </p>
                          </div>
                          <Badge className={getTypeColor(announcement.type)}>
                            {announcement.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Delivered</p>
                            <p className="font-medium">{announcement.engagement.delivered}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Opened</p>
                            <p className="font-medium">
                              {announcement.engagement.opened} ({announcement.engagement.openRate.toFixed(1)}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Clicked</p>
                            <p className="font-medium">
                              {announcement.engagement.clicked} ({announcement.engagement.clickRate.toFixed(1)}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Engagement</p>
                            <Progress 
                              value={announcement.engagement.openRate} 
                              className="h-2 mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Announcement Dialog */}
      <CreateAnnouncementDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  )
}