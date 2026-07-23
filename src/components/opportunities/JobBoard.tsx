import { useState, useMemo } from "react"
import { MapPin, Clock, Building2, DollarSign, Users, Bookmark, ExternalLink, Filter, SortAsc } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"
import { OpportunityCard } from "./OpportunityCard"
import { JobFilters } from "./JobFilters"
import { useAuth } from "../../contexts/AuthContext"

const mockJobs = [
  {
    id: "job-1",
    title: "Senior Software Engineer",
    company: "Google",
    companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=150&h=150&fit=crop",
    location: "Mountain View, CA",
    type: "Full-time",
    experience: "5+ years",
    salary: "₹180,000 - ₹220,000",
    postedBy: "Sarah Chen",
    postedByAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-14T10:00:00Z",
    description: "We're looking for a Senior Software Engineer to join our Cloud Infrastructure team...",
    skills: ["Python", "Kubernetes", "GCP", "Go"],
    remote: true,
    featured: true,
    applications: 23,
    isBookmarked: true,
    matchScore: 95
  },
  {
    id: "job-2",
    title: "Product Manager",
    company: "Meta",
    companyLogo: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=150&h=150&fit=crop",
    location: "Menlo Park, CA",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹150,000 - ₹180,000",
    postedBy: "Alex Thompson",
    postedByAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-13T15:30:00Z",
    description: "Join our AR/VR team to build the future of social connection...",
    skills: ["Product Strategy", "Analytics", "User Research", "Agile"],
    remote: false,
    featured: false,
    applications: 41,
    isBookmarked: false,
    matchScore: 87
  },
  {
    id: "job-3",
    title: "Data Scientist",
    company: "Netflix",
    companyLogo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=150&h=150&fit=crop",
    location: "Los Gatos, CA",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹130,000 - ₹160,000",
    postedBy: "Michael Rodriguez",
    postedByAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-12T09:15:00Z",
    description: "Help us understand viewer behavior and optimize content recommendations...",
    skills: ["Python", "SQL", "Machine Learning", "Spark"],
    remote: true,
    featured: true,
    applications: 67,
    isBookmarked: true,
    matchScore: 92
  },
  {
    id: "job-4",
    title: "UX Designer",
    company: "Airbnb",
    companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "3+ years",
    salary: "₹120,000 - ₹150,000",
    postedBy: "Lisa Thompson",
    postedByAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-11T14:20:00Z",
    description: "Design delightful experiences for millions of travelers worldwide...",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    remote: true,
    featured: false,
    applications: 89,
    isBookmarked: false,
    matchScore: 78
  },
  {
    id: "job-5",
    title: "DevOps Engineer",
    company: "Spotify",
    companyLogo: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=150&h=150&fit=crop",
    location: "New York, NY",
    type: "Full-time",
    experience: "4+ years",
    salary: "₹140,000 - ₹170,000",
    postedBy: "David Kim",
    postedByAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-10T11:45:00Z",
    description: "Scale our platform to serve 400M+ music lovers globally...",
    skills: ["AWS", "Docker", "Terraform", "Monitoring"],
    remote: false,
    featured: true,
    applications: 34,
    isBookmarked: false,
    matchScore: 85
  },
  {
    id: "job-6",
    title: "Marketing Manager",
    company: "Slack",
    companyLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=150&fit=crop",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "2-3 years",
    salary: "₹90,000 - ₹120,000",
    postedBy: "Jennifer Wu",
    postedByAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    postedDate: "2024-02-09T16:30:00Z",
    description: "Drive growth marketing initiatives for our enterprise platform...",
    skills: ["Digital Marketing", "Analytics", "Content Strategy", "B2B"],
    remote: true,
    featured: false,
    applications: 56,
    isBookmarked: true,
    matchScore: 71
  }
]

interface JobBoardProps {
  searchQuery: string
}

export function JobBoard({ searchQuery }: JobBoardProps) {
  const { user } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience: "",
    remote: false,
    salary: [0, 300000],
    skills: [] as string[]
  })

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = mockJobs

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply other filters
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type)
    }

    if (filters.remote) {
      filtered = filtered.filter(job => job.remote)
    }

    if (filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills.some(skill => job.skills.includes(skill))
      )
    }

    // Sort jobs
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
        break
      case "match":
        filtered.sort((a, b) => b.matchScore - a.matchScore)
        break
      case "applications":
        filtered.sort((a, b) => a.applications - b.applications)
        break
      case "salary":
        filtered.sort((a, b) => {
          const aMax = parseInt(a.salary.split(" - ")[1].replace(/[^0-9]/g, ""))
          const bMax = parseInt(b.salary.split(" - ")[1].replace(/[^0-9]/g, ""))
          return bMax - aMax
        })
        break
    }

    return filtered
  }, [searchQuery, filters, sortBy])

  const featuredJobs = filteredJobs.filter(job => job.featured)
  const regularJobs = filteredJobs.filter(job => !job.featured)

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
              <DropdownMenuItem onClick={() => setSortBy("match")}>
                Best Match
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("applications")}>
                Fewest Applications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("salary")}>
                Highest Salary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <JobFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3>Featured Jobs</h3>
            <Badge variant="secondary">Recommended for you</Badge>
          </div>
          <div className="grid gap-4">
            {featuredJobs.map((job) => (
              <OpportunityCard
                key={job.id}
                opportunity={job}
                type="job"
                featured
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Jobs */}
      {regularJobs.length > 0 && (
        <div>
          {featuredJobs.length > 0 && (
            <>
              <Separator className="my-6" />
              <h3 className="mb-4">All Jobs</h3>
            </>
          )}
          <div className="grid gap-4">
            {regularJobs.map((job) => (
              <OpportunityCard
                key={job.id}
                opportunity={job}
                type="job"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="mb-2">No jobs found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery || Object.values(filters).some(v => v)
                ? "Try adjusting your search criteria or filters to find more opportunities."
                : "New job opportunities are posted regularly. Check back soon!"}
            </p>
            {(searchQuery || Object.values(filters).some(v => v)) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilters({
                    location: "",
                    type: "",
                    experience: "",
                    remote: false,
                    salary: [0, 300000],
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