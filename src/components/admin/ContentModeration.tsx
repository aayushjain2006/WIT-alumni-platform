import { useState, useMemo } from "react"
import { 
  Shield, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Flag,
  MessageSquare,
  Calendar,
  Briefcase,
  BookOpen,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  User,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Textarea } from "../ui/textarea"
import { useNotifications } from "../../contexts/NotificationContext"
import { ContentReviewDialog } from "./ContentReviewDialog"

const mockPendingContent = [
  {
    id: "content-1",
    type: "alumni_story",
    title: "My Journey from Student to Tech Executive",
    author: {
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "Alumni"
    },
    content: "After graduating with a Computer Science degree in 2019, I started as a junior developer...",
    submittedDate: "2024-02-14T10:00:00Z",
    category: "Career Success",
    status: "pending",
    priority: "medium",
    flags: [],
    engagement: { views: 0, likes: 0, comments: 0 }
  },
  {
    id: "content-2",
    type: "job_posting",
    title: "Senior Software Engineer - Remote",
    author: {
      name: "Michael Rodriguez",
      email: "hr@techcorp.com",
      avatar: null,
      role: "Company"
    },
    content: "We are looking for a Senior Software Engineer to join our growing team...",
    company: "TechCorp Inc.",
    salary: "$120,000 - $150,000",
    location: "Remote",
    submittedDate: "2024-02-13T15:30:00Z",
    category: "Technology",
    status: "pending",
    priority: "high",
    flags: [],
    engagement: { applications: 0, views: 0 }
  },
  {
    id: "content-3",
    type: "event",
    title: "Alumni Networking Happy Hour",
    author: {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      role: "Alumni"
    },
    content: "Join us for an evening of networking and drinks at downtown's hottest venue...",
    eventDate: "2024-03-15T18:00:00Z",
    location: "Downtown Bar & Grill",
    submittedDate: "2024-02-12T09:00:00Z",
    category: "Networking",
    status: "pending",
    priority: "low",
    flags: [],
    engagement: { registrations: 0, views: 0 }
  },
  {
    id: "content-4",
    type: "announcement",
    title: "New Alumni Scholarship Program Launch",
    author: {
      name: "Admin Team",
      email: "admin@university.edu",
      avatar: null,
      role: "Admin"
    },
    content: "We're excited to announce the launch of our new scholarship program for current students...",
    submittedDate: "2024-02-11T14:00:00Z",
    category: "Official",
    status: "pending",
    priority: "high",
    flags: [],
    engagement: { views: 0, reactions: 0 }
  }
]

const mockReportedContent = [
  {
    id: "report-1",
    type: "alumni_story",
    title: "Controversial Career Advice",
    author: {
      name: "Alex Thompson",
      email: "alex.t@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "Alumni"
    },
    reporter: {
      name: "Jennifer Liu",
      email: "jennifer.l@email.com"
    },
    reportReason: "Inappropriate language",
    reportDate: "2024-02-13T11:00:00Z",
    content: "Some controversial advice about workplace dynamics...",
    status: "under_review",
    priority: "high",
    flags: ["inappropriate_language", "controversial"]
  },
  {
    id: "report-2",
    type: "job_posting",
    title: "Marketing Coordinator Position",
    author: {
      name: "Fake Company Inc.",
      email: "fake@company.com",
      avatar: null,
      role: "Company"
    },
    reporter: {
      name: "Lisa Wang",
      email: "lisa.w@email.com"
    },
    reportReason: "Suspicious company information",
    reportDate: "2024-02-12T16:45:00Z",
    content: "Marketing position with unrealistic salary promises...",
    status: "under_review",
    priority: "high",
    flags: ["suspicious", "misleading_information"]
  }
]

interface ContentModerationProps {
  className?: string
}

export function ContentModeration({ className }: ContentModerationProps) {
  const { addNotification } = useNotifications()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [selectedContent, setSelectedContent] = useState<any>(null)

  // Combine pending and reported content
  const allContent = [...mockPendingContent, ...mockReportedContent]

  // Filter content
  const filteredContent = useMemo(() => {
    let filtered = allContent

    if (searchQuery) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(content => content.type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(content => content.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(content => content.priority === priorityFilter)
    }

    return filtered
  }, [searchQuery, typeFilter, statusFilter, priorityFilter])

  const stats = {
    total: allContent.length,
    pending: allContent.filter(c => c.status === "pending").length,
    reported: allContent.filter(c => c.status === "under_review").length,
    highPriority: allContent.filter(c => c.priority === "high").length,
    processed: 47 // Mock number for processed content
  }

  const contentTypes = [
    { value: "alumni_story", label: "Alumni Stories", icon: BookOpen },
    { value: "job_posting", label: "Job Postings", icon: Briefcase },
    { value: "event", label: "Events", icon: Calendar },
    { value: "announcement", label: "Announcements", icon: MessageSquare }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "under_review": return "bg-orange-100 text-orange-800"
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
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

  const getTypeIcon = (type: string) => {
    const typeData = contentTypes.find(t => t.value === type)
    const Icon = typeData?.icon || BookOpen
    return <Icon className="h-4 w-4" />
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

  const handleContentAction = (action: string, content: any) => {
    const actionMessages: { [key: string]: string } = {
      approve: "approved",
      reject: "rejected",
      flag: "flagged for review"
    }

    addNotification({
      type: "system",
      title: `Content ${actionMessages[action] || 'processed'}`,
      description: `"${content.title}" has been ${actionMessages[action] || 'processed'}`,
      isRead: false
    })

    switch (action) {
      case "review":
        setSelectedContent(content)
        setShowReviewDialog(true)
        break
      case "approve":
      case "reject":
      case "flag":
        // In real app, would make API call
        console.log(`${action} content:`, content.id)
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
            <h1 className="mb-2">Content Moderation</h1>
            <p className="text-muted-foreground">
              Review and moderate user-generated content across the platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Moderation Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Queue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-lg font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                <Flag className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-lg font-bold">{stats.reported}</p>
              <p className="text-xs text-muted-foreground">Reported</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-lg font-bold">{stats.highPriority}</p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-lg font-bold">{stats.processed}</p>
              <p className="text-xs text-muted-foreground">Processed Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="queue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="queue">Moderation Queue</TabsTrigger>
            <TabsTrigger value="reported">Reported Content</TabsTrigger>
            <TabsTrigger value="history">Review History</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search content by title, author, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Content Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(content.type)}
                              <p className="font-medium truncate">{content.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {content.content}
                            </p>
                            {content.flags && content.flags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {content.flags.map((flag: string) => (
                                  <Badge key={flag} variant="outline" className="text-xs bg-red-50 text-red-700">
                                    {flag.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={content.author.avatar} alt={content.author.name} />
                              <AvatarFallback>
                                {content.author.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{content.author.name}</p>
                              <p className="text-xs text-muted-foreground">{content.author.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {contentTypes.find(t => t.value === content.type)?.label || content.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(content.status)}>
                            {content.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(content.priority)}>
                            {content.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(content.submittedDate)}
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
                              <DropdownMenuItem onClick={() => handleContentAction("review", content)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Review Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleContentAction("approve", content)}>
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleContentAction("reject", content)}>
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleContentAction("flag", content)}>
                                <Flag className="h-4 w-4 mr-2" />
                                Flag for Review
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

          <TabsContent value="reported" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Reported Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReportedContent.map((content) => (
                    <div key={content.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(content.type)}
                            <h4 className="font-medium">{content.title}</h4>
                            <Badge className="bg-red-100 text-red-800">REPORTED</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {content.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Author: {content.author.name}</span>
                            <span>•</span>
                            <span>Reported by: {content.reporter.name}</span>
                            <span>•</span>
                            <span>Reason: {content.reportReason}</span>
                            <span>•</span>
                            <span>{formatDate(content.reportDate)}</span>
                          </div>
                          {content.flags && content.flags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {content.flags.map((flag: string) => (
                                <Badge key={flag} className="bg-red-100 text-red-800 text-xs">
                                  {flag.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleContentAction("review", content)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleContentAction("approve", content)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleContentAction("reject", content)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Moderation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Alumni Story Approved</p>
                        <p className="text-sm text-muted-foreground">"My Career in Data Science" by Lisa Wang</p>
                        <p className="text-xs text-muted-foreground">Approved 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-sm">Job Posting Rejected</p>
                        <p className="text-sm text-muted-foreground">"MLM Opportunity" - Violates posting guidelines</p>
                        <p className="text-xs text-muted-foreground">Rejected 4 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Event Approved</p>
                        <p className="text-sm text-muted-foreground">"Tech Networking Mixer" by David Kim</p>
                        <p className="text-xs text-muted-foreground">Approved 6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Content Review Dialog */}
      <ContentReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        content={selectedContent}
      />
    </div>
  )
}