import { useState, useMemo } from "react"
import * as React from "react"
import { Plus, Search, Filter, Edit, Eye, Trash2, Copy, TrendingUp, Users, Calendar, Building2, Star } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Separator } from "../ui/separator"
import { useAuth } from "../../contexts/AuthContext"
import { PostOpportunityDialog } from "./PostOpportunityDialog"

// Mock data for posted opportunities
const mockPostedOpportunities = [
  {
    id: "opp-1",
    type: "job",
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    postedDate: "2024-02-14T10:00:00Z",
    status: "active",
    applicants: 28,
    views: 245,
    featured: true,
    urgent: false,
    salary: { min: "140000", max: "180000", currency: "USD" },
    author: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "opp-2",
    type: "internship",
    title: "Data Science Intern",
    company: "DataFlow Analytics",
    location: "Austin, TX",
    postedDate: "2024-02-12T15:30:00Z",
    status: "active",
    applicants: 42,
    views: 167,
    featured: false,
    urgent: true,
    stipend: "4500",
    duration: "Summer (10-12 weeks)",
    author: "Michael Rodriguez",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "opp-3",
    type: "project",
    title: "AI Healthcare Platform",
    company: "HealthTech Innovations",
    location: "Remote",
    postedDate: "2024-02-10T09:15:00Z",
    status: "active",
    applicants: 15,
    views: 89,
    featured: true,
    urgent: false,
    compensation: "Equity + Learning",
    duration: "3-6 months",
    author: "Lisa Thompson",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "opp-4",
    type: "job",
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    postedDate: "2024-02-08T12:00:00Z",
    status: "paused",
    applicants: 67,
    views: 312,
    featured: false,
    urgent: false,
    salary: { min: "120000", max: "160000", currency: "USD" },
    author: "Alex Kim",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "opp-5",
    type: "internship",
    title: "UX Design Intern",
    company: "Design Studio Pro",
    location: "Los Angeles, CA",
    postedDate: "2024-02-06T14:20:00Z",
    status: "expired",
    applicants: 33,
    views: 198,
    featured: false,
    urgent: false,
    stipend: "3800",
    duration: "Fall (12-16 weeks)",
    author: "Jennifer Wu",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  }
]

const mockAnalytics = {
  totalPosts: 15,
  activeOpportunities: 12,
  totalViews: 1245,
  totalApplications: 185,
  averageApplicationsPerPost: 12.3,
  topPerformingPost: "Senior Software Engineer",
  recentActivity: [
    { type: "application", count: 5, timeframe: "today" },
    { type: "view", count: 23, timeframe: "today" },
    { type: "new_post", count: 2, timeframe: "this week" }
  ]
}

interface PostOpportunitiesPageProps {
  className?: string
}

export function PostOpportunitiesPage({ className }: PostOpportunitiesPageProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-posts")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    let filtered = mockPostedOpportunities

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(opp => opp.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(opp => opp.type === typeFilter)
    }

    return filtered
  }, [searchQuery, statusFilter, typeFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "paused": return "bg-yellow-100 text-yellow-800"
      case "expired": return "bg-red-100 text-red-800"
      case "draft": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job": return Building2
      case "internship": return Calendar
      case "project": return Users
      default: return Building2
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const handleStatusChange = (opportunityId: string, newStatus: string) => {
    // In real app, this would make an API call
    console.log(`Changing status of ${opportunityId} to ${newStatus}`)
  }

  const handleDuplicate = (opportunity: any) => {
    // In real app, this would create a copy of the opportunity
    console.log("Duplicating opportunity:", opportunity.id)
  }

  const handleDelete = (opportunityId: string) => {
    // In real app, this would delete the opportunity
    console.log("Deleting opportunity:", opportunityId)
  }

  const renderOpportunityCard = (opportunity: any) => (
    <Card key={opportunity.id} className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              {React.createElement(getTypeIcon(opportunity.type), { className: "h-6 w-6 sm:h-7 sm:w-7 text-primary" })}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h4 className="font-medium text-base sm:text-lg truncate">{opportunity.title}</h4>
                <div className="flex items-center gap-2">
                  {opportunity.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  {opportunity.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">{opportunity.company} • {opportunity.location}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span>Posted {formatDate(opportunity.postedDate)}</span>
                <span className="hidden sm:inline">•</span>
                <span>{opportunity.views} views</span>
                <span className="hidden sm:inline">•</span>
                <span>{opportunity.applicants} applicants</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <Badge className={`${getStatusColor(opportunity.status)} text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5`}>
              {opportunity.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 sm:h-10 sm:w-10">
                  <span className="text-lg">•••</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedOpportunity(opportunity)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicate(opportunity)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {opportunity.status === "active" ? (
                  <DropdownMenuItem onClick={() => handleStatusChange(opportunity.id, "paused")}>
                    Pause Posting
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleStatusChange(opportunity.id, "active")}>
                    Reactivate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => handleDelete(opportunity.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 sm:pt-6 border-t border-border/50">
          <div className="text-center">
            <p className="text-lg sm:text-xl font-medium">{opportunity.views}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Views</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-xl font-medium">{opportunity.applicants}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Applications</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-xl font-medium">
              {opportunity.applicants > 0 ? Math.round((opportunity.applicants / opportunity.views) * 100) : 0}%
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Conversion</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderAnalyticsDashboard = () => (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm sm:text-base text-muted-foreground">Total Posts</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium">{mockAnalytics.totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm sm:text-base text-muted-foreground">Active Posts</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium">{mockAnalytics.activeOpportunities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Eye className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm sm:text-base text-muted-foreground">Total Views</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium">{mockAnalytics.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm sm:text-base text-muted-foreground">Applications</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium">{mockAnalytics.totalApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Opportunity Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="min-w-[200px] px-4 sm:px-6 py-3 sm:py-4">Opportunity</TableHead>
                  <TableHead className="min-w-[100px] px-4 sm:px-6 py-3 sm:py-4">Type</TableHead>
                  <TableHead className="min-w-[100px] px-4 sm:px-6 py-3 sm:py-4">Status</TableHead>
                  <TableHead className="min-w-[80px] px-4 sm:px-6 py-3 sm:py-4">Views</TableHead>
                  <TableHead className="min-w-[100px] px-4 sm:px-6 py-3 sm:py-4">Applications</TableHead>
                  <TableHead className="min-w-[120px] px-4 sm:px-6 py-3 sm:py-4">Conversion Rate</TableHead>
                  <TableHead className="min-w-[120px] px-4 sm:px-6 py-3 sm:py-4">Posted Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map((opportunity) => (
                  <TableRow key={opportunity.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4">
                      <div>
                        <p className="font-medium text-sm sm:text-base">{opportunity.title}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{opportunity.company}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4">
                      <Badge variant="outline" className="text-xs sm:text-sm capitalize">
                        {opportunity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4">
                      <Badge className={`${getStatusColor(opportunity.status)} text-xs sm:text-sm`}>
                        {opportunity.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4 font-medium">
                      {opportunity.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4 font-medium">
                      {opportunity.applicants}
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="font-medium">
                        {opportunity.applicants > 0 ? Math.round((opportunity.applicants / opportunity.views) * 100) : 0}%
                      </span>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-muted-foreground">
                      {formatDate(opportunity.postedDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className={className}>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl">Post Opportunities</h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
              Manage your job postings, internships, and project opportunities
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Opportunity
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 sm:h-14 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="my-posts" className="text-sm sm:text-base h-10 sm:h-12">My Posts</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm sm:text-base h-10 sm:h-12">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="my-posts" className="space-y-6 sm:space-y-8">
            {/* Search and Filters */}
            <Card className="border-2 border-dashed border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search opportunities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 sm:pl-12 h-12 sm:h-14 text-base"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <select
                      className="h-12 sm:h-14 px-4 sm:px-5 rounded-md border border-input bg-background text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="job">Jobs</option>
                      <option value="internship">Internships</option>
                      <option value="project">Projects</option>
                    </select>
                    <select
                      className="h-12 sm:h-14 px-4 sm:px-5 rounded-md border border-input bg-background text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div className="text-sm sm:text-base text-muted-foreground">
                <span className="font-medium">{filteredOpportunities.length}</span> opportunit{filteredOpportunities.length !== 1 ? 'ies' : 'y'} found
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge variant="secondary" className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
                  {filteredOpportunities.filter(o => o.status === 'active').length} active
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
                  {filteredOpportunities.filter(o => o.featured).length} featured
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
                  {filteredOpportunities.filter(o => o.urgent).length} urgent
                </Badge>
              </div>
            </div>

            {/* Opportunities Grid */}
            {filteredOpportunities.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                {filteredOpportunities.map(renderOpportunityCard)}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-8">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                    <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mb-3 text-lg sm:text-xl font-medium">No opportunities found</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6 text-sm sm:text-base leading-relaxed">
                    {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "Start posting opportunities to connect with talented students and build your talent pipeline."}
                  </p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Opportunity
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            {renderAnalyticsDashboard()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Opportunity Dialog */}
      <PostOpportunityDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  )
}