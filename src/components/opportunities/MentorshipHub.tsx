import { useState, useMemo } from "react"
import { Star, Users, MapPin, Filter, SortAsc, Heart, Award, BookOpen, Target } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { OpportunityCard } from "./OpportunityCard"
import { useAuth } from "../../contexts/AuthContext"

const mockMentors = [
  {
    id: "mentor-1",
    mentorName: "Sarah Chen",
    mentorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    title: "Senior Product Manager",
    company: "Google",
    location: "Mountain View, CA",
    experience: "8+ years",
    mentees: 15,
    rating: 4.9,
    reviews: 23,
    availability: "weekends",
    bio: "I've helped build products used by billions of users. I love mentoring aspiring PMs and helping them navigate their career transitions.",
    expertise: ["Product Management", "Strategy", "Analytics", "Leadership"],
    focusAreas: ["Career Transition", "Product Strategy", "Interview Prep"],
    featured: true,
    isBookmarked: false,
    responseTime: "< 24 hours",
    languages: ["English", "Mandarin"],
    timezone: "PST"
  },
  {
    id: "mentor-2",
    mentorName: "Alex Thompson",
    mentorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    title: "Data Scientist",
    company: "Netflix",
    location: "Los Gatos, CA",
    experience: "6+ years",
    mentees: 12,
    rating: 4.8,
    reviews: 18,
    availability: "evenings",
    bio: "Passionate about machine learning and data-driven decision making. I enjoy helping students break into data science.",
    expertise: ["Data Science", "Machine Learning", "Python", "Statistics"],
    focusAreas: ["Technical Skills", "Portfolio Building", "Job Search"],
    featured: true,
    isBookmarked: true,
    responseTime: "< 48 hours",
    languages: ["English"],
    timezone: "PST"
  },
  {
    id: "mentor-3",
    mentorName: "Lisa Rodriguez",
    mentorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    title: "UX Design Lead",
    company: "Airbnb",
    location: "San Francisco, CA",
    experience: "7+ years",
    mentees: 20,
    rating: 4.9,
    reviews: 31,
    availability: "flexible",
    bio: "Design leader with experience in consumer products. I'm passionate about helping new designers develop their craft and build confidence.",
    expertise: ["UX Design", "Design Systems", "User Research", "Figma"],
    focusAreas: ["Portfolio Review", "Design Process", "Career Growth"],
    featured: false,
    isBookmarked: false,
    responseTime: "< 24 hours",
    languages: ["English", "Spanish"],
    timezone: "PST"
  },
  {
    id: "mentor-4",
    mentorName: "Michael Kim",
    mentorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    title: "Software Engineering Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    experience: "10+ years",
    mentees: 8,
    rating: 4.7,
    reviews: 12,
    availability: "weekdays",
    bio: "Engineering leader with experience scaling teams and products. I help engineers grow into senior and leadership roles.",
    expertise: ["Software Engineering", "System Design", "Leadership", "Career Growth"],
    focusAreas: ["Technical Leadership", "System Design", "Team Management"],
    featured: false,
    isBookmarked: true,
    responseTime: "< 72 hours",
    languages: ["English", "Korean"],
    timezone: "PST"
  },
  {
    id: "mentor-5",
    mentorName: "Jennifer Wu",
    mentorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    title: "Marketing Director",
    company: "Slack",
    location: "San Francisco, CA",
    experience: "9+ years",
    mentees: 18,
    rating: 4.8,
    reviews: 26,
    availability: "weekends",
    bio: "Marketing professional with expertise in B2B growth and digital marketing. Love helping people transition into marketing roles.",
    expertise: ["Digital Marketing", "Growth", "B2B", "Content Strategy"],
    focusAreas: ["Marketing Strategy", "Career Transition", "Skill Development"],
    featured: true,
    isBookmarked: false,
    responseTime: "< 24 hours",
    languages: ["English"],
    timezone: "PST"
  },
  {
    id: "mentor-6",
    mentorName: "David Park",
    mentorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    title: "DevOps Engineer",
    company: "Spotify",
    location: "New York, NY",
    experience: "5+ years",
    mentees: 6,
    rating: 4.6,
    reviews: 9,
    availability: "evenings",
    bio: "Infrastructure and DevOps specialist. I help developers understand cloud technologies and build scalable systems.",
    expertise: ["DevOps", "AWS", "Kubernetes", "Infrastructure"],
    focusAreas: ["Cloud Technologies", "System Architecture", "Technical Skills"],
    featured: false,
    isBookmarked: false,
    responseTime: "< 48 hours",
    languages: ["English"],
    timezone: "EST"
  }
]

const mockMentorshipRequests = [
  {
    id: "request-1",
    studentName: "Emma Johnson",
    studentAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    major: "Computer Science",
    graduationYear: "2025",
    interests: ["Software Engineering", "Machine Learning"],
    requestDate: "2024-02-14T10:00:00Z",
    message: "Hi! I'm a CS student interested in transitioning from academia to industry. Would love guidance on technical interviews and industry best practices.",
    status: "pending"
  },
  {
    id: "request-2",
    studentName: "James Wilson",
    studentAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
    major: "Business Administration",
    graduationYear: "2024",
    interests: ["Product Management", "Strategy"],
    requestDate: "2024-02-13T15:30:00Z",
    message: "I'm interested in breaking into product management after graduation. Looking for advice on how to build relevant experience and prepare for PM interviews.",
    status: "pending"
  }
]

interface MentorshipHubProps {
  searchQuery: string
}

export function MentorshipHub({ searchQuery }: MentorshipHubProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(user?.role === 'alumni' ? 'mentoring' : 'find-mentor')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("rating")
  const [filters, setFilters] = useState({
    expertise: "",
    availability: "",
    location: "",
    experience: ""
  })

  // Filter and sort mentors
  const filteredMentors = useMemo(() => {
    let filtered = mockMentors

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply other filters
    if (filters.expertise) {
      filtered = filtered.filter(mentor => 
        mentor.expertise.some(skill => skill.toLowerCase().includes(filters.expertise.toLowerCase()))
      )
    }

    if (filters.availability) {
      filtered = filtered.filter(mentor => mentor.availability === filters.availability)
    }

    if (filters.location) {
      filtered = filtered.filter(mentor => 
        mentor.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Sort mentors
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "experience":
        filtered.sort((a, b) => {
          const aExp = parseInt(a.experience.replace(/[^0-9]/g, ""))
          const bExp = parseInt(b.experience.replace(/[^0-9]/g, ""))
          return bExp - aExp
        })
        break
      case "mentees":
        filtered.sort((a, b) => b.mentees - a.mentees)
        break
      case "response":
        filtered.sort((a, b) => {
          const aHours = parseInt(a.responseTime.replace(/[^0-9]/g, ""))
          const bHours = parseInt(b.responseTime.replace(/[^0-9]/g, ""))
          return aHours - bHours
        })
        break
    }

    return filtered
  }, [searchQuery, filters, sortBy])

  const featuredMentors = filteredMentors.filter(mentor => mentor.featured)
  const regularMentors = filteredMentors.filter(mentor => !mentor.featured)

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find-mentor" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Find a Mentor
          </TabsTrigger>
          <TabsTrigger value="mentoring" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            {user?.role === 'alumni' ? 'My Mentoring' : 'My Mentors'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find-mentor" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
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
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("rating")}>
                    Highest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("experience")}>
                    Most Experience
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("mentees")}>
                    Most Mentees
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("response")}>
                    Fastest Response
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {/* Simple Filter Toggles */}
          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Expertise:</span>
                    <Button
                      variant={filters.expertise === "" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, expertise: "" }))}
                    >
                      All
                    </Button>
                    <Button
                      variant={filters.expertise === "Product Management" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, expertise: "Product Management" }))}
                    >
                      Product
                    </Button>
                    <Button
                      variant={filters.expertise === "Engineering" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, expertise: "Engineering" }))}
                    >
                      Engineering
                    </Button>
                    <Button
                      variant={filters.expertise === "Design" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, expertise: "Design" }))}
                    >
                      Design
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Featured Mentors */}
          {featuredMentors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3>Top Mentors</h3>
                <Badge variant="secondary">Highly recommended</Badge>
              </div>
              <div className="grid gap-4">
                {featuredMentors.map((mentor) => (
                  <OpportunityCard
                    key={mentor.id}
                    opportunity={mentor}
                    type="mentorship"
                    featured
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Mentors */}
          {regularMentors.length > 0 && (
            <div>
              {featuredMentors.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <h3 className="mb-4">All Mentors</h3>
                </>
              )}
              <div className="grid gap-4">
                {regularMentors.map((mentor) => (
                  <OpportunityCard
                    key={mentor.id}
                    opportunity={mentor}
                    type="mentorship"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredMentors.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mb-2">No mentors found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery || Object.values(filters).some(v => v)
                    ? "Try adjusting your search criteria or filters to find more mentors."
                    : "Our mentor network is growing. Check back soon for new mentors!"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mentoring" className="space-y-6">
          {user?.role === 'alumni' ? (
            <div className="space-y-6">
              {/* Mentoring Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Mentees</p>
                        <p className="font-medium">8</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Star className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                        <p className="font-medium">4.8/5.0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                        <p className="font-medium">124</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mentorship Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    New Mentorship Requests
                    <Badge variant="secondary">{mockMentorshipRequests.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockMentorshipRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={request.studentAvatar}
                            alt={request.studentName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium">{request.studentName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {request.major} • Class of {request.graduationYear}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-4">{request.message}</p>
                      <div className="flex items-center gap-2 mb-3">
                        {request.interests.map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm">Accept</Button>
                        <Button size="sm" variant="outline">Decline</Button>
                        <Button size="sm" variant="ghost">Message</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mb-2">Your Mentorship Journey</h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  Connect with experienced alumni to get guidance on your career path.
                </p>
                <Button onClick={() => setActiveTab('find-mentor')}>
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}