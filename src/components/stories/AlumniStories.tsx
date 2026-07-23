import { useState, useMemo } from "react"
import { 
  BookOpen, 
  Star, 
  Heart, 
  Share, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Award,
  Users,
  MessageCircle,
  Eye,
  Camera
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useAuth } from "../../contexts/AuthContext"
import { StoryCard } from "./StoryCard"
import { CreateStoryDialog } from "./CreateStoryDialog"
import { StoryDetailDialog } from "./StoryDetailDialog"
import { CampaignParticipationCard } from "./CampaignParticipationCard"

const mockStories = [
  {
    id: "story-1",
    title: "From Campus to Silicon Valley: My Journey to Google",
    excerpt: "How the university's computer science program and alumni network helped me land my dream job at Google.",
    content: "When I graduated from the university five years ago, I never imagined I'd be working as a Senior Software Engineer at Google. The journey from a nervous freshman to where I am today has been incredible, and so much of it is thanks to the foundation I built at our university...",
    author: {
      name: "Sarah Chen",
      graduationYear: "2019",
      major: "Computer Science",
      currentRole: "Senior Software Engineer at Google",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    category: "Career Success",
    tags: ["Technology", "Career Growth", "Google", "Computer Science"],
    publishedDate: "2024-02-10T10:00:00Z",
    readTime: 8,
    likes: 234,
    comments: 45,
    shares: 67,
    featured: true,
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop",
    verified: true
  },
  {
    id: "story-2",
    title: "Building a Sustainable Future: My Environmental Engineering Impact",
    excerpt: "Leading renewable energy projects that are making a real difference in combating climate change.",
    content: "After graduating with a degree in Environmental Engineering, I've dedicated my career to renewable energy projects. The theoretical knowledge from university has translated into real-world impact, helping design solar farms that power thousands of homes...",
    author: {
      name: "Marcus Rodriguez",
      graduationYear: "2017",
      major: "Environmental Engineering",
      currentRole: "Lead Engineer at SolarTech Solutions",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    category: "Social Impact",
    tags: ["Environmental", "Engineering", "Sustainability", "Green Energy"],
    publishedDate: "2024-02-08T14:00:00Z",
    readTime: 6,
    likes: 189,
    comments: 32,
    shares: 28,
    featured: true,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop",
    verified: true
  },
  {
    id: "story-3",
    title: "From Student Athlete to Olympic Dreams",
    excerpt: "How balancing academics and athletics at university prepared me for competing at the highest level.",
    content: "Being a student athlete wasn't easy, but it taught me discipline, time management, and perseverance. These skills have carried me all the way to the Olympic trials...",
    author: {
      name: "Jennifer Liu",
      graduationYear: "2020",
      major: "Kinesiology",
      currentRole: "Professional Athlete & Olympic Hopeful",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    category: "Personal Achievement",
    tags: ["Athletics", "Olympics", "Perseverance", "Student Life"],
    publishedDate: "2024-02-06T09:00:00Z",
    readTime: 5,
    likes: 312,
    comments: 78,
    shares: 156,
    featured: false,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    verified: true
  },
  {
    id: "story-4",
    title: "Launching My Startup: Lessons from Entrepreneurship Class",
    excerpt: "How the entrepreneurship program gave me the tools and confidence to start my own company.",
    content: "The entrepreneurship program wasn't just theory - it gave me practical tools to turn my idea into a thriving business. From writing business plans to pitching to investors, every lesson has been invaluable...",
    author: {
      name: "David Kim",
      graduationYear: "2018",
      major: "Business Administration",
      currentRole: "CEO & Founder of TechFlow Inc.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    category: "Entrepreneurship",
    tags: ["Startup", "Business", "Entrepreneurship", "Innovation"],
    publishedDate: "2024-02-04T16:30:00Z",
    readTime: 7,
    likes: 145,
    comments: 23,
    shares: 34,
    featured: false,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop",
    verified: true
  },
  {
    id: "story-5",
    title: "Giving Back: Establishing the First-Generation Student Scholarship",
    excerpt: "Why I created a scholarship fund to help first-generation college students achieve their dreams.",
    content: "As a first-generation college student myself, I understand the unique challenges students face. That's why I established this scholarship fund to help remove financial barriers...",
    author: {
      name: "Maria Gonzalez",
      graduationYear: "2015",
      major: "Social Work",
      currentRole: "Director of Community Relations",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    category: "Giving Back",
    tags: ["Scholarship", "First-Generation", "Community", "Social Work"],
    publishedDate: "2024-02-02T11:15:00Z",
    readTime: 4,
    likes: 298,
    comments: 56,
    shares: 89,
    featured: false,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
    verified: true
  }
]

const mockCampaigns = [
  {
    id: "campaign-1",
    title: "Share Your Success Story",
    description: "Help inspire current students by sharing your career journey and achievements since graduation.",
    type: "Story Sharing",
    participationGoal: 100,
    currentParticipants: 67,
    deadline: "2024-03-31T23:59:59Z",
    rewards: ["Featured in Alumni Magazine", "LinkedIn Feature", "Campus Recognition"],
    status: "active",
    featured: true
  },
  {
    id: "campaign-2", 
    title: "Mentorship Stories Campaign",
    description: "Share how mentorship (giving or receiving) has impacted your professional development.",
    type: "Mentorship Focus",
    participationGoal: 50,
    currentParticipants: 23,
    deadline: "2024-04-15T23:59:59Z",
    rewards: ["Mentorship Program Recognition", "Social Media Feature"],
    status: "active",
    featured: false
  },
  {
    id: "campaign-3",
    title: "Innovation & Research Spotlight",
    description: "Highlight your research achievements, patents, or innovative projects in your field.",
    type: "Research & Innovation",
    participationGoal: 30,
    currentParticipants: 12,
    deadline: "2024-05-01T23:59:59Z",
    rewards: ["Research Alumni Network Feature", "University Website Spotlight"],
    status: "active",
    featured: false
  }
]

const categories = ["All Stories", "Career Success", "Social Impact", "Personal Achievement", "Entrepreneurship", "Giving Back"]

interface AlumniStoriesProps {
  className?: string
}

export function AlumniStories({ className }: AlumniStoriesProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("stories")
  const [categoryFilter, setCategoryFilter] = useState("All Stories")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedStory, setSelectedStory] = useState<any>(null)

  // Filter stories
  const filteredStories = useMemo(() => {
    let filtered = mockStories

    if (searchQuery) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (categoryFilter !== "All Stories") {
      filtered = filtered.filter(story => story.category === categoryFilter)
    }

    return filtered
  }, [searchQuery, categoryFilter])

  const stats = {
    totalStories: mockStories.length,
    totalReads: mockStories.reduce((sum, story) => sum + (story.likes * 3), 0),
    totalLikes: mockStories.reduce((sum, story) => sum + story.likes, 0),
    activeCampaigns: mockCampaigns.filter(c => c.status === "active").length
  }

  const handleViewStory = (story: any) => {
    setSelectedStory(story)
    setShowDetailDialog(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Alumni Stories</h1>
            <p className="text-muted-foreground">
              Discover inspiring stories from our alumni community and share your own journey
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Share Your Story
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stories Shared</p>
                  <p className="font-medium">{stats.totalStories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reads</p>
                  <p className="font-medium">{stats.totalReads.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                  <p className="font-medium">{stats.totalLikes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="font-medium">{stats.activeCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="stories">Alumni Stories</TabsTrigger>
            <TabsTrigger value="campaigns">Story Campaigns</TabsTrigger>
            <TabsTrigger value="my-stories">My Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search stories, authors, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        {categoryFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {categories.map((category) => (
                        <DropdownMenuItem 
                          key={category} 
                          onClick={() => setCategoryFilter(category)}
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredStories.length} stor{filteredStories.length !== 1 ? 'ies' : 'y'} found
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {filteredStories.filter(s => s.featured).length} featured
                </Badge>
                <Badge variant="outline">
                  {filteredStories.filter(s => s.verified).length} verified
                </Badge>
              </div>
            </div>

            {/* Featured Stories */}
            {filteredStories.filter(s => s.featured).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3>Featured Stories</h3>
                  <Badge variant="secondary">Highlighted by our team</Badge>
                </div>
                <div className="grid gap-6">
                  {filteredStories
                    .filter(story => story.featured)
                    .map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        onViewStory={handleViewStory}
                        featured
                        layout="horizontal"
                      />
                    ))}
                </div>
              </div>
            )}

            {/* All Stories */}
            <div>
              {filteredStories.filter(s => s.featured).length > 0 && (
                <div className="border-t pt-6 mb-4">
                  <h3>All Stories</h3>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredStories
                  .filter(story => !story.featured)
                  .map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onViewStory={handleViewStory}
                    />
                  ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredStories.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="mb-2">No stories found</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    {searchQuery || categoryFilter !== "All Stories"
                      ? "Try adjusting your search criteria or filters."
                      : "Be the first to share your story with the alumni community!"}
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Share Your Story
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div>
              <h3 className="mb-4">Active Story Campaigns</h3>
              <div className="grid gap-6">
                {mockCampaigns
                  .filter(campaign => campaign.status === "active")
                  .map((campaign) => (
                    <CampaignParticipationCard
                      key={campaign.id}
                      campaign={campaign}
                      onParticipate={() => setShowCreateDialog(true)}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-stories" className="space-y-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mb-2">Share Your First Story</h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  Your experiences and achievements can inspire current students and fellow alumni. Share your journey today!
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Write Your Story
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateStoryDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <StoryDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        story={selectedStory}
      />
    </div>
  )
}