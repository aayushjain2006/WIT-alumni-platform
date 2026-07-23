import { useState, useMemo } from "react"
import { MapPin, Clock, Building2, Users, Calendar, Filter, SortAsc, GraduationCap } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"
import { OpportunityCard } from "./OpportunityCard"
import { useAuth } from "../../contexts/AuthContext"

const mockInternships = [
  {
    id: "intern-1",
    title: "Software Engineering Intern",
    company: "Google",
    companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=150&h=150&fit=crop",
    location: "Mountain View, CA",
    duration: "Summer 2024 (12 weeks)",
    stipend: "₹8,000/month",
    paid: true,
    postedBy: "Sarah Chen",
    postedByAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-14T10:00:00Z",
    description: "Join our Cloud Platform team to work on large-scale distributed systems that serve billions of users...",
    skills: ["Python", "Java", "Distributed Systems", "Cloud Computing"],
    remote: false,
    featured: true,
    applications: 456,
    isBookmarked: false,
    requirements: ["Currently pursuing CS degree", "Strong programming fundamentals", "Problem-solving skills"],
    deadline: "2024-03-15T23:59:00Z"
  },
  {
    id: "intern-2",
    title: "Product Management Intern",
    company: "Meta",
    companyLogo: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=150&h=150&fit=crop",
    location: "Menlo Park, CA",
    duration: "Summer 2024 (10 weeks)",
    stipend: "₹7,500/month",
    paid: true,
    postedBy: "Alex Thompson",
    postedByAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-13T15:30:00Z",
    description: "Work on features that impact billions of users across our family of apps including Facebook, Instagram, and WhatsApp...",
    skills: ["Product Strategy", "Data Analysis", "User Research", "Communication"],
    remote: false,
    featured: false,
    applications: 234,
    isBookmarked: true,
    requirements: ["Business/Engineering student", "Analytical mindset", "Leadership experience"],
    deadline: "2024-03-20T23:59:00Z"
  },
  {
    id: "intern-3",
    title: "Data Science Intern",
    company: "Netflix",
    companyLogo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=150&h=150&fit=crop",
    location: "Los Gatos, CA",
    duration: "Summer 2024 (12 weeks)",
    stipend: "₹7,000/month",
    paid: true,
    postedBy: "Michael Rodriguez",
    postedByAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-12T09:15:00Z",
    description: "Apply machine learning to personalize the Netflix experience for 230M+ subscribers worldwide...",
    skills: ["Python", "SQL", "Machine Learning", "Statistics"],
    remote: true,
    featured: true,
    applications: 189,
    isBookmarked: false,
    requirements: ["Statistics/CS/Math student", "Python proficiency", "ML coursework"],
    deadline: "2024-03-10T23:59:00Z"
  },
  {
    id: "intern-4",
    title: "UX Design Intern",
    company: "Airbnb",
    companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
    location: "San Francisco, CA",
    duration: "Summer 2024 (12 weeks)",
    stipend: "₹6,500/month",
    paid: true,
    postedBy: "Lisa Thompson",
    postedByAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-11T14:20:00Z",
    description: "Design intuitive experiences for travelers and hosts on our platform used by millions globally...",
    skills: ["Figma", "User Research", "Prototyping", "Visual Design"],
    remote: false,
    featured: false,
    applications: 298,
    isBookmarked: true,
    requirements: ["Design student", "Portfolio required", "Figma proficiency"],
    deadline: "2024-03-25T23:59:00Z"
  },
  {
    id: "intern-5",
    title: "Marketing Intern",
    company: "Slack",
    companyLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=150&fit=crop",
    location: "San Francisco, CA",
    duration: "Summer 2024 (10 weeks)",
    stipend: "₹5,000/month",
    paid: true,
    postedBy: "Jennifer Wu",
    postedByAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-09T16:30:00Z",
    description: "Support our growth marketing team in reaching enterprise customers and driving product adoption...",
    skills: ["Digital Marketing", "Content Creation", "Analytics", "Social Media"],
    remote: true,
    featured: false,
    applications: 167,
    isBookmarked: false,
    requirements: ["Marketing/Business student", "Creative thinking", "Communication skills"],
    deadline: "2024-04-01T23:59:00Z"
  },
  {
    id: "intern-6",
    title: "Research Intern - Unpaid",
    company: "Stanford AI Lab",
    companyLogo: "https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop",
    location: "Stanford, CA",
    duration: "Fall 2024 (16 weeks)",
    stipend: "Unpaid",
    paid: false,
    postedBy: "Dr. Emily Chen",
    postedByAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-08T12:00:00Z",
    description: "Work on cutting-edge AI research in natural language processing and computer vision...",
    skills: ["Python", "PyTorch", "Research", "Academic Writing"],
    remote: false,
    featured: false,
    applications: 89,
    isBookmarked: false,
    requirements: ["Graduate student preferred", "Research experience", "Strong academic record"],
    deadline: "2024-04-15T23:59:00Z"
  }
]

interface InternshipBoardProps {
  searchQuery: string
}

export function InternshipBoard({ searchQuery }: InternshipBoardProps) {
  const { user } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    location: "",
    duration: "",
    paid: "all",
    remote: false,
    skills: [] as string[]
  })

  // Filter and sort internships
  const filteredInternships = useMemo(() => {
    let filtered = mockInternships

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply other filters
    if (filters.location) {
      filtered = filtered.filter(internship => 
        internship.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.paid !== "all") {
      const isPaidFilter = filters.paid === "paid"
      filtered = filtered.filter(internship => internship.paid === isPaidFilter)
    }

    if (filters.remote) {
      filtered = filtered.filter(internship => internship.remote)
    }

    if (filters.skills.length > 0) {
      filtered = filtered.filter(internship =>
        filters.skills.some(skill => internship.skills.includes(skill))
      )
    }

    // Sort internships
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
        break
      case "deadline":
        filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        break
      case "applications":
        filtered.sort((a, b) => a.applications - b.applications)
        break
      case "stipend":
        filtered.sort((a, b) => {
          const aStipend = a.paid ? parseInt(a.stipend.replace(/[^0-9]/g, "")) || 0 : 0
          const bStipend = b.paid ? parseInt(b.stipend.replace(/[^0-9]/g, "")) || 0 : 0
          return bStipend - aStipend
        })
        break
    }

    return filtered
  }, [searchQuery, filters, sortBy])

  const featuredInternships = filteredInternships.filter(internship => internship.featured)
  const regularInternships = filteredInternships.filter(internship => !internship.featured)
  const paidInternships = filteredInternships.filter(internship => internship.paid).length
  const unpaidInternships = filteredInternships.filter(internship => !internship.paid).length

  return (
    <div className="space-y-6">
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
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("deadline")}>
                Application Deadline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("applications")}>
                Fewest Applications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("stipend")}>
                Highest Stipend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              {paidInternships} Paid
            </Badge>
            <Badge variant="outline">
              {unpaidInternships} Unpaid
            </Badge>
          </div>
          <span>
            {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Simple Filter Toggles */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Payment:</span>
                <Button
                  variant={filters.paid === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, paid: "all" }))}
                >
                  All
                </Button>
                <Button
                  variant={filters.paid === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, paid: "paid" }))}
                >
                  Paid Only
                </Button>
                <Button
                  variant={filters.paid === "unpaid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, paid: "unpaid" }))}
                >
                  Unpaid
                </Button>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-2">
                <Button
                  variant={filters.remote ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, remote: !prev.remote }))}
                >
                  Remote Available
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Internships */}
      {featuredInternships.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3>Featured Internships</h3>
            <Badge variant="secondary">Top opportunities</Badge>
          </div>
          <div className="grid gap-4">
            {featuredInternships.map((internship) => (
              <OpportunityCard
                key={internship.id}
                opportunity={internship}
                type="internship"
                featured
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Internships */}
      {regularInternships.length > 0 && (
        <div>
          {featuredInternships.length > 0 && (
            <>
              <Separator className="my-6" />
              <h3 className="mb-4">All Internships</h3>
            </>
          )}
          <div className="grid gap-4">
            {regularInternships.map((internship) => (
              <OpportunityCard
                key={internship.id}
                opportunity={internship}
                type="internship"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredInternships.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="mb-2">No internships found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery || Object.values(filters).some(v => v && v !== "all")
                ? "Try adjusting your search criteria or filters to find more opportunities."
                : "New internship opportunities are posted regularly. Check back soon!"}
            </p>
            {(searchQuery || Object.values(filters).some(v => v && v !== "all")) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilters({
                    location: "",
                    duration: "",
                    paid: "all",
                    remote: false,
                    skills: []
                  })
                }}
              >
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}