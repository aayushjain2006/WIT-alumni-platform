import { useState, useMemo } from "react"
import { Search, Filter, Plus, TrendingUp, Calendar, Users, Award, GraduationCap, Building2, SortAsc } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "../ui/dropdown-menu"
import { useAuth } from "../../contexts/AuthContext"
import { NewsCard } from "./NewsCard"
import { NewsFilters } from "./NewsFilters"
import { CreateNewsDialog } from "./CreateNewsDialog"
import { unsplash_tool } from "../../tools/unsplash"

const mockNews = [
  {
    id: "news-1",
    title: "University Announces New $50M Innovation Hub for Students and Alumni",
    excerpt: "The new innovation hub will provide state-of-the-art facilities for entrepreneurship, research, and collaboration between current students and alumni.",
    content: "The University is proud to announce the groundbreaking of a new $50 million Innovation Hub, set to open in Fall 2025. This cutting-edge facility will serve as a nexus for entrepreneurship, research, and collaboration between current students, faculty, and our accomplished alumni network...",
    category: "Campus Updates",
    author: "University Communications",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-15T09:00:00Z",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
    tags: ["Innovation", "Facilities", "Entrepreneurship", "Alumni"],
    likes: 156,
    comments: 23,
    featured: true,
    priority: "high"
  },
  {
    id: "news-2",
    title: "Alumni Spotlight: Sarah Chen '18 Named to Forbes 30 Under 30",
    excerpt: "Computer Science graduate Sarah Chen has been recognized for her groundbreaking work in AI and machine learning at Google.",
    content: "We're thrilled to celebrate Sarah Chen, Class of 2018, who has been named to Forbes' prestigious 30 Under 30 list in the Technology category. Sarah, who graduated with a degree in Computer Science, has been making waves at Google with her innovative work in artificial intelligence and machine learning...",
    category: "Alumni Success",
    author: "Alumni Relations",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-14T14:30:00Z",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop",
    tags: ["Alumni", "Achievement", "Technology", "Forbes"],
    likes: 234,
    comments: 41,
    featured: true,
    priority: "high"
  },
  {
    id: "news-3",
    title: "Spring Career Fair Breaks Attendance Records with 200+ Companies",
    excerpt: "This year's Spring Career Fair attracted over 200 companies and 3,000 students, making it the largest career fair in university history.",
    content: "The Spring 2024 Career Fair exceeded all expectations, with over 200 companies participating and more than 3,000 students in attendance. Major tech companies like Google, Microsoft, and Apple were joined by innovative startups and established corporations across various industries...",
    category: "Student Life",
    author: "Career Services",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-13T11:00:00Z",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
    tags: ["Career", "Students", "Recruitment", "Companies"],
    likes: 89,
    comments: 15,
    featured: false,
    priority: "medium"
  },
  {
    id: "news-4",
    title: "New Partnership with Tesla Opens Doors for Engineering Students",
    excerpt: "The university has signed a new partnership agreement with Tesla, creating internship and research opportunities for engineering students.",
    content: "We're excited to announce a strategic partnership with Tesla that will provide unprecedented opportunities for our engineering students. The partnership includes summer internship programs, co-op opportunities, and joint research projects focused on sustainable energy and autonomous vehicles...",
    category: "Academic",
    author: "Engineering Department",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-12T16:45:00Z",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    tags: ["Partnership", "Tesla", "Engineering", "Internships"],
    likes: 167,
    comments: 28,
    featured: false,
    priority: "high"
  },
  {
    id: "news-5",
    title: "Student Research Team Wins National Sustainability Competition",
    excerpt: "A team of environmental science students took first place in the National Sustainability Innovation Challenge with their water purification project.",
    content: "Congratulations to our environmental science students who won first place in the National Sustainability Innovation Challenge! Their innovative water purification system using locally sourced materials has the potential to provide clean drinking water to underserved communities...",
    category: "Student Achievement",
    author: "Research Office",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-11T10:15:00Z",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
    tags: ["Students", "Research", "Sustainability", "Competition"],
    likes: 145,
    comments: 19,
    featured: false,
    priority: "medium"
  },
  {
    id: "news-6",
    title: "Alumni Mentorship Program Celebrates 5 Years of Success",
    excerpt: "The university's alumni mentorship program has connected over 2,000 students with experienced professionals since its launch in 2019.",
    content: "Five years ago, we launched the Alumni Mentorship Program with the goal of connecting current students with our accomplished alumni network. Today, we're proud to celebrate this milestone achievement: over 2,000 successful mentor-mentee connections, with 85% of participants reporting positive career outcomes...",
    category: "Alumni Network",
    author: "Alumni Relations",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-10T13:20:00Z",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    tags: ["Alumni", "Mentorship", "Program", "Success"],
    likes: 198,
    comments: 34,
    featured: false,
    priority: "medium"
  },
  {
    id: "news-7",
    title: "New Scholarship Fund Established by Tech Alumni",
    excerpt: "Alumni working in major tech companies have established a $1M scholarship fund to support underrepresented students in STEM fields.",
    content: "We're grateful to announce the establishment of the Tech Alumni Scholarship Fund, a $1 million endowment created by our alumni working at leading technology companies. This scholarship will provide financial support to underrepresented students pursuing degrees in STEM fields...",
    category: "Financial Aid",
    author: "Financial Aid Office",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-09T12:00:00Z",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
    tags: ["Scholarship", "Alumni", "STEM", "Diversity"],
    likes: 276,
    comments: 52,
    featured: false,
    priority: "high"
  },
  {
    id: "news-8",
    title: "Campus Sustainability Initiative Achieves Carbon Neutral Status",
    excerpt: "The university has achieved carbon neutral status ahead of its 2025 goal, thanks to renewable energy investments and campus-wide conservation efforts.",
    content: "We're proud to announce that our campus has achieved carbon neutral status, one year ahead of our ambitious 2025 goal. This achievement is the result of comprehensive sustainability initiatives including solar panel installations, energy-efficient building upgrades, and campus-wide conservation programs...",
    category: "Campus Updates",
    author: "Sustainability Office",
    authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    publishedDate: "2024-02-08T15:30:00Z",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop",
    tags: ["Sustainability", "Environment", "Campus", "Achievement"],
    likes: 134,
    comments: 21,
    featured: false,
    priority: "medium"
  }
]

interface CampusNewsProps {
  className?: string
}

export function CampusNews({ className }: CampusNewsProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    dateRange: "",
    tags: [] as string[]
  })

  // Filter and sort news
  const filteredNews = useMemo(() => {
    let filtered = mockNews

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(news => {
        switch (activeTab) {
          case "featured":
            return news.featured
          case "campus":
            return news.category === "Campus Updates"
          case "alumni":
            return news.category === "Alumni Success" || news.category === "Alumni Network"
          case "students":
            return news.category === "Student Life" || news.category === "Student Achievement"
          case "academic":
            return news.category === "Academic"
          default:
            return true
        }
      })
    }

    // Apply other filters
    if (filters.category) {
      filtered = filtered.filter(news => news.category === filters.category)
    }

    if (filters.author) {
      filtered = filtered.filter(news => 
        news.author.toLowerCase().includes(filters.author.toLowerCase())
      )
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(news =>
        filters.tags.some(tag => news.tags.includes(tag))
      )
    }

    // Sort news
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime())
        break
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "discussed":
        filtered.sort((a, b) => b.comments - a.comments)
        break
    }

    return filtered
  }, [searchQuery, activeTab, filters, sortBy])

  const featuredNews = filteredNews.filter(news => news.featured)
  const regularNews = filteredNews.filter(news => !news.featured)

  const stats = {
    totalNews: mockNews.length,
    thisWeek: mockNews.filter(news => {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return new Date(news.publishedDate) > oneWeekAgo
    }).length,
    categories: [...new Set(mockNews.map(news => news.category))].length,
    engagement: mockNews.reduce((sum, news) => sum + news.likes + news.comments, 0)
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Campus News & Updates</h1>
            <p className="text-muted-foreground">
              Stay connected with the latest campus news, alumni achievements, and university updates
            </p>
          </div>
          {(user?.role === 'admin' || user?.role === 'alumni') && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Stories</p>
                  <p className="font-medium">{stats.totalNews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="font-medium">{stats.thisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="font-medium">{stats.categories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                  <p className="font-medium">{stats.engagement}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search news and updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SortAsc className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>
                      Most Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("discussed")}>
                      Most Discussed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Panel */}
        {showFilters && (
          <NewsFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* News Categories Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              All News
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="campus" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Campus
            </TabsTrigger>
            <TabsTrigger value="alumni" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Alumni
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Academic
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''} found
              </div>
              {featuredNews.length > 0 && activeTab === "all" && (
                <Badge variant="secondary">
                  {featuredNews.length} featured
                </Badge>
              )}
            </div>

            {/* Featured News */}
            {featuredNews.length > 0 && activeTab === "all" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3>Featured Stories</h3>
                  <Badge variant="secondary">Top stories</Badge>
                </div>
                <div className="grid gap-6">
                  {featuredNews.map((news) => (
                    <NewsCard
                      key={news.id}
                      news={news}
                      featured
                      layout="horizontal"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular News */}
            <div>
              {featuredNews.length > 0 && activeTab === "all" && (
                <div className="border-t pt-6 mb-4">
                  <h3>Latest News</h3>
                </div>
              )}
              <div className="grid gap-6">
                {(activeTab === "all" ? regularNews : filteredNews).map((news) => (
                  <NewsCard
                    key={news.id}
                    news={news}
                    layout="horizontal"
                  />
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredNews.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="mb-2">No news found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v)
                      ? "Try adjusting your search criteria or filters to find more news articles."
                      : "New stories are published regularly. Check back soon for updates!"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create News Dialog */}
      <CreateNewsDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  )
}