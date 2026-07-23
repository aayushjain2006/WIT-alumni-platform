import { useState, useMemo } from "react"
import { Search, Filter, Users, MessageCircle, Star, MapPin, Building2, GraduationCap, Coffee, Video, Calendar, SortAsc, Heart } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"
import { useAuth } from "../../contexts/AuthContext"
import { AlumniConnectCard } from "./AlumniConnectCard"
import { ConnectionRequestDialog } from "./ConnectionRequestDialog"
import { ConnectFilters } from "./ConnectFilters"

const mockAlumni = [
  {
    id: "alumni-1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    title: "Senior Product Manager",
    company: "Google",
    location: "Mountain View, CA",
    graduationYear: "2018",
    major: "Computer Science",
    bio: "I love helping students navigate tech careers and product management transitions. Always happy to chat about breaking into PM roles.",
    expertise: ["Product Management", "Strategy", "Career Transitions", "Tech Industry"],
    interests: ["Hiking", "Photography", "Mentoring", "Travel"],
    responseRate: 95,
    avgResponseTime: "< 24 hours",
    connectionsHelped: 47,
    rating: 4.9,
    isAvailable: true,
    preferredContact: ["Coffee Chat", "Video Call"],
    willingToHelp: ["Career Advice", "Resume Review", "Interview Prep", "Industry Insights"],
    linkedIn: "https://linkedin.com/in/sarahchen",
    twitter: "@sarahchen",
    featured: true
  },
  {
    id: "alumni-2",
    name: "Michael Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    title: "Data Scientist",
    company: "Netflix",
    location: "Los Gatos, CA",
    graduationYear: "2019",
    major: "Statistics",
    bio: "Data science enthusiast who transitioned from academia to industry. Happy to share insights about the data science field and career paths.",
    expertise: ["Data Science", "Machine Learning", "Python", "Statistics"],
    interests: ["Soccer", "Music", "Data Visualization", "Teaching"],
    responseRate: 88,
    avgResponseTime: "< 48 hours",
    connectionsHelped: 32,
    rating: 4.7,
    isAvailable: true,
    preferredContact: ["Video Call", "Phone Call"],
    willingToHelp: ["Technical Skills", "Portfolio Review", "Career Transition", "Academia to Industry"],
    linkedIn: "https://linkedin.com/in/michaelrodriguez",
    featured: false
  },
  {
    id: "alumni-3",
    name: "Lisa Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    title: "UX Design Lead",
    company: "Airbnb",
    location: "San Francisco, CA",
    graduationYear: "2017",
    major: "Design",
    bio: "Design leader passionate about creating inclusive user experiences. Love helping new designers find their voice and build confidence.",
    expertise: ["UX Design", "Design Leadership", "User Research", "Design Systems"],
    interests: ["Art", "Yoga", "Volunteering", "Design Thinking"],
    responseRate: 92,
    avgResponseTime: "< 24 hours",
    connectionsHelped: 56,
    rating: 4.8,
    isAvailable: true,
    preferredContact: ["Coffee Chat", "Video Call", "Portfolio Review"],
    willingToHelp: ["Portfolio Review", "Design Process", "Career Guidance", "Interview Prep"],
    linkedIn: "https://linkedin.com/in/lisathompson",
    featured: true
  },
  {
    id: "alumni-4",
    name: "Alex Kim",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    title: "Software Engineering Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    graduationYear: "2016",
    major: "Computer Engineering",
    bio: "Engineering leader with experience in scaling teams and building products. Happy to discuss technical leadership and career growth.",
    expertise: ["Software Engineering", "Engineering Management", "System Design", "Team Leadership"],
    interests: ["Basketball", "Gaming", "Tech Innovation", "Mentoring"],
    responseRate: 78,
    avgResponseTime: "< 72 hours",
    connectionsHelped: 28,
    rating: 4.6,
    isAvailable: false,
    preferredContact: ["Video Call", "Email"],
    willingToHelp: ["Technical Leadership", "System Design", "Career Growth", "Engineering Culture"],
    linkedIn: "https://linkedin.com/in/alexkim",
    featured: false
  },
  {
    id: "alumni-5",
    name: "Jennifer Wu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    title: "Marketing Director",
    company: "Slack",
    location: "San Francisco, CA",
    graduationYear: "2015",
    major: "Business Administration",
    bio: "Marketing professional passionate about growth strategies and digital marketing. Love helping students explore marketing careers.",
    expertise: ["Digital Marketing", "Growth Marketing", "B2B Marketing", "Content Strategy"],
    interests: ["Running", "Cooking", "Public Speaking", "Women in Tech"],
    responseRate: 90,
    avgResponseTime: "< 48 hours",
    connectionsHelped: 41,
    rating: 4.8,
    isAvailable: true,
    preferredContact: ["Coffee Chat", "Video Call", "Phone Call"],
    willingToHelp: ["Marketing Strategy", "Career Transition", "Personal Branding", "Industry Insights"],
    linkedIn: "https://linkedin.com/in/jenniferwu",
    featured: true
  },
  {
    id: "alumni-6",
    name: "David Park",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
    title: "Financial Analyst",
    company: "Goldman Sachs",
    location: "New York, NY",
    graduationYear: "2020",
    major: "Economics",
    bio: "Finance professional working in investment banking. Can share insights about finance careers and the transition from college to Wall Street.",
    expertise: ["Finance", "Investment Banking", "Financial Analysis", "Excel/Modeling"],
    interests: ["Finance", "Tennis", "Reading", "Travel"],
    responseRate: 85,
    avgResponseTime: "< 48 hours",
    connectionsHelped: 19,
    rating: 4.5,
    isAvailable: true,
    preferredContact: ["Video Call", "Email"],
    willingToHelp: ["Finance Careers", "Interview Prep", "Resume Review", "Industry Insights"],
    linkedIn: "https://linkedin.com/in/davidpark",
    featured: false
  }
]

const mockMyConnections = [
  {
    id: "conn-1",
    alumni: mockAlumni[0],
    status: "connected",
    connectedDate: "2024-02-10T10:00:00Z",
    lastInteraction: "2024-02-12T14:30:00Z",
    conversationId: "conv-1",
    notes: "Helped with PM interview prep. Great insights on product strategy."
  },
  {
    id: "conn-2",
    alumni: mockAlumni[2],
    status: "pending",
    requestDate: "2024-02-14T09:00:00Z",
    requestMessage: "Hi Lisa! I'm a design student interested in transitioning to UX. Would love to get your advice on building a strong portfolio.",
    notes: ""
  },
  {
    id: "conn-3",
    alumni: mockAlumni[1],
    status: "connected",
    connectedDate: "2024-01-28T16:00:00Z",
    lastInteraction: "2024-02-08T11:15:00Z",
    conversationId: "conv-2",
    notes: "Provided excellent guidance on data science career path and technical skills."
  }
]

interface AlumniConnectProps {
  className?: string
}

export function AlumniConnect({ className }: AlumniConnectProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("discover")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  
  const [filters, setFilters] = useState({
    location: "",
    company: "",
    major: "",
    graduationYear: "",
    expertise: "",
    availability: "all"
  })

  // Filter and sort alumni
  const filteredAlumni = useMemo(() => {
    let filtered = mockAlumni

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(alumni =>
        alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply other filters
    if (filters.location) {
      filtered = filtered.filter(alumni => 
        alumni.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.company) {
      filtered = filtered.filter(alumni => 
        alumni.company.toLowerCase().includes(filters.company.toLowerCase())
      )
    }

    if (filters.major) {
      filtered = filtered.filter(alumni => 
        alumni.major.toLowerCase().includes(filters.major.toLowerCase())
      )
    }

    if (filters.expertise) {
      filtered = filtered.filter(alumni => 
        alumni.expertise.some(skill => skill.toLowerCase().includes(filters.expertise.toLowerCase()))
      )
    }

    if (filters.availability === "available") {
      filtered = filtered.filter(alumni => alumni.isAvailable)
    }

    // Sort alumni
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "response-rate":
        filtered.sort((a, b) => b.responseRate - a.responseRate)
        break
      case "connections":
        filtered.sort((a, b) => b.connectionsHelped - a.connectionsHelped)
        break
      case "recent":
        filtered.sort((a, b) => parseInt(b.graduationYear) - parseInt(a.graduationYear))
        break
    }

    return filtered
  }, [searchQuery, filters, sortBy])

  const featuredAlumni = filteredAlumni.filter(alumni => alumni.featured)
  const regularAlumni = filteredAlumni.filter(alumni => !alumni.featured)

  const stats = {
    totalAlumni: mockAlumni.length,
    availableNow: mockAlumni.filter(a => a.isAvailable).length,
    avgResponseTime: "< 48 hours",
    successfulConnections: mockAlumni.reduce((sum, a) => sum + a.connectionsHelped, 0)
  }

  const handleConnectRequest = (alumni: any) => {
    setSelectedAlumni(alumni)
    setShowRequestDialog(true)
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Alumni Connect</h1>
            <p className="text-muted-foreground">
              Connect with experienced alumni for guidance, advice, and networking opportunities
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alumni Network</p>
                  <p className="font-medium">{stats.totalAlumni}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Now</p>
                  <p className="font-medium">{stats.availableNow}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="font-medium">{stats.avgResponseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Connections</p>
                  <p className="font-medium">{stats.successfulConnections}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Discover Alumni
            </TabsTrigger>
            <TabsTrigger value="my-connections" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              My Connections
              <Badge variant="secondary">{mockMyConnections.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search alumni by name, company, or expertise..."
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
                        <DropdownMenuItem onClick={() => setSortBy("featured")}>
                          Featured First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("rating")}>
                          Highest Rated
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("response-rate")}>
                          Best Response Rate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("connections")}>
                          Most Helpful
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("recent")}>
                          Recent Graduates
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters Panel */}
            {showFilters && (
              <ConnectFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredAlumni.length} alumni found
              </div>
              {filteredAlumni.filter(a => a.isAvailable).length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {filteredAlumni.filter(a => a.isAvailable).length} available now
                </Badge>
              )}
            </div>

            {/* Featured Alumni */}
            {featuredAlumni.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3>Featured Alumni</h3>
                  <Badge variant="secondary">Highly recommended</Badge>
                </div>
                <div className="grid gap-4">
                  {featuredAlumni.map((alumni) => (
                    <AlumniConnectCard
                      key={alumni.id}
                      alumni={alumni}
                      onConnect={() => handleConnectRequest(alumni)}
                      featured
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Alumni */}
            {regularAlumni.length > 0 && (
              <div>
                {featuredAlumni.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="mb-4">All Alumni</h3>
                  </>
                )}
                <div className="grid gap-4">
                  {regularAlumni.map((alumni) => (
                    <AlumniConnectCard
                      key={alumni.id}
                      alumni={alumni}
                      onConnect={() => handleConnectRequest(alumni)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredAlumni.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="mb-2">No alumni found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {searchQuery || Object.values(filters).some(v => v && v !== "all")
                      ? "Try adjusting your search criteria or filters to find more alumni."
                      : "Our alumni network is growing. Check back soon for new members!"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my-connections" className="space-y-6">
            {mockMyConnections.length > 0 ? (
              <div className="space-y-4">
                {mockMyConnections.map((connection) => (
                  <Card key={connection.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={connection.alumni.avatar} alt={connection.alumni.name} />
                            <AvatarFallback>
                              {connection.alumni.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{connection.alumni.name}</h4>
                              <Badge 
                                variant={connection.status === "connected" ? "default" : "secondary"}
                                className={connection.status === "connected" ? "bg-green-100 text-green-800" : ""}
                              >
                                {connection.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {connection.alumni.title} at {connection.alumni.company}
                            </p>
                            {connection.notes && (
                              <p className="text-sm mb-2">{connection.notes}</p>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {connection.status === "connected" ? (
                                <>
                                  Connected on {new Date(connection.connectedDate!).toLocaleDateString()}
                                  {connection.lastInteraction && (
                                    <span> • Last interaction: {new Date(connection.lastInteraction).toLocaleDateString()}</span>
                                  )}
                                </>
                              ) : (
                                <>Request sent on {new Date(connection.requestDate!).toLocaleDateString()}</>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {connection.status === "connected" ? (
                            <Button size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              Pending
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="mb-2">No connections yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Start building your alumni network by connecting with experienced professionals in your field.
                  </p>
                  <Button onClick={() => setActiveTab('discover')}>
                    Discover Alumni
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Connection Request Dialog */}
      <ConnectionRequestDialog
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        alumni={selectedAlumni}
      />
    </div>
  )
}