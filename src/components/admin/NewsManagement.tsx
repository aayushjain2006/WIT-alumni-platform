import { useState, useMemo } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  Heart,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  FileText,
  Award,
  Building2,
  GraduationCap,
  SortAsc
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "../ui/dropdown-menu"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../ui/alert-dialog"
import { Checkbox } from "../ui/checkbox"
import { Switch } from "../ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useMobile } from "../ui/use-mobile"
import { toast } from "sonner@2.0.3"
import { CreateNewsDialog } from "../news/CreateNewsDialog"

// Mock news data for admin management
const mockAdminNews = [
  {
    id: "news-1",
    title: "University Announces New $50M Innovation Hub for Students and Alumni",
    excerpt: "The new innovation hub will provide state-of-the-art facilities for entrepreneurship, research, and collaboration...",
    category: "Campus Updates",
    author: "University Communications",
    authorId: "admin-1",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-15T09:00:00Z",
    status: "published",
    featured: true,
    priority: "high",
    views: 2456,
    likes: 156,
    comments: 23,
    shares: 45,
    tags: ["Innovation", "Facilities", "Entrepreneurship", "Alumni"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
    readTime: "3 min read",
    lastModified: "2024-02-15T09:00:00Z",
    modifiedBy: "admin-1",
    reports: 0
  },
  {
    id: "news-2",
    title: "Alumni Spotlight: Sarah Chen '18 Named to Forbes 30 Under 30",
    excerpt: "Computer Science graduate Sarah Chen has been recognized for her groundbreaking work in AI and machine learning at Google.",
    category: "Alumni Success",
    author: "Alumni Relations",
    authorId: "admin-2",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-14T14:30:00Z",
    status: "published",
    featured: true,
    priority: "high",
    views: 3421,
    likes: 234,
    comments: 41,
    shares: 67,
    tags: ["Alumni", "Achievement", "Technology", "Forbes"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop",
    readTime: "2 min read",
    lastModified: "2024-02-14T14:30:00Z",
    modifiedBy: "admin-2",
    reports: 0
  },
  {
    id: "news-3",
    title: "Spring Career Fair Breaks Attendance Records with 200+ Companies",
    excerpt: "This year's Spring Career Fair attracted over 200 companies and 3,000 students, making it the largest career fair in university history.",
    category: "Student Life",
    author: "Career Services",
    authorId: "admin-3",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-13T11:00:00Z",
    status: "published",
    featured: false,
    priority: "medium",
    views: 1876,
    likes: 89,
    comments: 15,
    shares: 23,
    tags: ["Career", "Students", "Recruitment", "Companies"],
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
    readTime: "4 min read",
    lastModified: "2024-02-13T11:00:00Z",
    modifiedBy: "admin-3",
    reports: 0
  },
  {
    id: "news-4",
    title: "Controversial Policy Changes Under Review",
    excerpt: "New academic policies have sparked debate among students and faculty members across campus.",
    category: "Academic",
    author: "News Contributor",
    authorId: "user-123",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-12T16:45:00Z",
    status: "pending",
    featured: false,
    priority: "medium",
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    tags: ["Policy", "Academic", "Review"],
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    readTime: "5 min read",
    lastModified: "2024-02-12T16:45:00Z",
    modifiedBy: "user-123",
    reports: 3
  },
  {
    id: "news-5",
    title: "Draft: Upcoming Research Symposium Announcement",
    excerpt: "Annual research symposium will showcase student and faculty research projects from across all departments.",
    category: "Academic",
    author: "Research Office",
    authorId: "admin-4",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    publishedDate: null,
    status: "draft",
    featured: false,
    priority: "low",
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    tags: ["Research", "Symposium", "Academic"],
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
    readTime: "3 min read",
    lastModified: "2024-02-10T10:00:00Z",
    modifiedBy: "admin-4",
    reports: 0
  }
]

interface NewsManagementProps {
  onBack?: () => void
}

export function NewsManagement({ onBack }: NewsManagementProps) {
  const { isMobile } = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedNews, setSelectedNews] = useState<string[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('list')

  // Filter and sort news
  const filteredNews = useMemo(() => {
    let filtered = mockAdminNews

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(news => news.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(news => news.category === categoryFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(news => news.priority === priorityFilter)
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          const dateA = a.publishedDate || a.lastModified
          const dateB = b.publishedDate || b.lastModified
          return new Date(dateB).getTime() - new Date(dateA).getTime()
        })
        break
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = a.publishedDate || a.lastModified
          const dateB = b.publishedDate || b.lastModified
          return new Date(dateA).getTime() - new Date(dateB).getTime()
        })
        break
      case "views":
        filtered.sort((a, b) => b.views - a.views)
        break
      case "engagement":
        filtered.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
        break
    }

    return filtered
  }, [searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy])

  const stats = {
    total: mockAdminNews.length,
    published: mockAdminNews.filter(n => n.status === 'published').length,
    draft: mockAdminNews.filter(n => n.status === 'draft').length,
    pending: mockAdminNews.filter(n => n.status === 'pending').length,
    reported: mockAdminNews.filter(n => n.reports > 0).length,
    totalViews: mockAdminNews.reduce((sum, n) => sum + n.views, 0),
    totalEngagement: mockAdminNews.reduce((sum, n) => sum + n.likes + n.comments + n.shares, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedNews.length === 0) {
      toast.error("Please select news articles first")
      return
    }

    switch (action) {
      case 'publish':
        toast.success(`Published ${selectedNews.length} articles`)
        break
      case 'unpublish':
        toast.success(`Unpublished ${selectedNews.length} articles`)
        break
      case 'delete':
        setDeleteDialogOpen(true)
        break
      case 'feature':
        toast.success(`Featured ${selectedNews.length} articles`)
        break
      case 'unfeature':
        toast.success(`Unfeatured ${selectedNews.length} articles`)
        break
    }
    setSelectedNews([])
  }

  const handleDeleteNews = (newsId?: string) => {
    if (newsId) {
      toast.success("News article deleted")
    } else {
      toast.success(`Deleted ${selectedNews.length} articles`)
      setSelectedNews([])
    }
    setDeleteDialogOpen(false)
    setNewsToDelete(null)
  }

  const handleToggleSelect = (newsId: string) => {
    setSelectedNews(prev =>
      prev.includes(newsId)
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    )
  }

  const handleSelectAll = () => {
    if (selectedNews.length === filteredNews.length) {
      setSelectedNews([])
    } else {
      setSelectedNews(filteredNews.map(news => news.id))
    }
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="mobile-sticky bg-background/95 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">News Management</h1>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-4">
          {/* Mobile Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="mobile-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Articles</p>
                    <p className="text-lg font-semibold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mobile-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-lg font-semibold">{stats.published}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-input pl-10"
            />
          </div>

          {/* Mobile Filters */}
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="engagement">Most Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile News List */}
          <div className="space-y-3">
            {filteredNews.map((news) => (
              <Card key={news.id} className="mobile-card border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-base line-clamp-2">{news.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.excerpt}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              setNewsToDelete(news.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(news.status)}>
                          {news.status}
                        </Badge>
                        {news.featured && (
                          <Badge variant="outline">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {news.reports > 0 && (
                          <Badge variant="destructive">
                            <Flag className="h-3 w-3 mr-1" />
                            {news.reports}
                          </Badge>
                        )}
                      </div>
                      <Badge className={getPriorityColor(news.priority)}>
                        {news.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {news.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {news.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {news.comments}
                        </span>
                      </div>
                      <span>{news.author}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredNews.length === 0 && (
            <Card className="mobile-card border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No articles found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters to find articles.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // Desktop version
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">News Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage campus news and announcements
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                {stats.reported > 0 && (
                  <p className="text-xs text-red-600">{stats.reported} reported</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Campus Updates">Campus Updates</SelectItem>
                  <SelectItem value="Alumni Success">Alumni Success</SelectItem>
                  <SelectItem value="Student Life">Student Life</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="engagement">Most Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Bulk Actions */}
          {selectedNews.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedNews.length} selected
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('publish')}
                >
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('feature')}
                >
                  Feature
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedNews.length === filteredNews.length && filteredNews.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((news) => (
                <TableRow key={news.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedNews.includes(news.id)}
                      onCheckedChange={() => handleToggleSelect(news.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start space-x-3">
                      {news.image && (
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-16 h-16 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{news.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {news.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {news.featured && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {news.reports > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              <Flag className="h-3 w-3 mr-1" />
                              {news.reports} reports
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(news.status)}>
                      {news.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{news.category}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={news.authorAvatar} />
                        <AvatarFallback className="text-xs">
                          {news.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{news.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          {news.views}
                        </span>
                        <span className="flex items-center text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          {news.likes}
                        </span>
                        <span className="flex items-center text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {news.comments}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {news.publishedDate ? (
                        <div>
                          <div>{new Date(news.publishedDate).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(news.publishedDate).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not published</span>
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
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {news.status === 'draft' && (
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {news.status === 'published' && (
                          <DropdownMenuItem>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unpublish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          {news.featured ? (
                            <>
                              <Star className="h-4 w-4 mr-2" />
                              Unfeature
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-2" />
                              Feature
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            setNewsToDelete(news.id)
                            setDeleteDialogOpen(true)
                          }}
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

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? "Try adjusting your search criteria or filters to find articles."
                : "Get started by creating your first news article."}
            </p>
            {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
              <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Article
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete News Article</AlertDialogTitle>
            <AlertDialogDescription>
              {newsToDelete 
                ? "Are you sure you want to delete this news article? This action cannot be undone."
                : `Are you sure you want to delete ${selectedNews.length} selected articles? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteNews(newsToDelete || undefined)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create News Dialog */}
      <CreateNewsDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  )
}