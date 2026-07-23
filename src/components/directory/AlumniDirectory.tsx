import { useState, useMemo, useEffect } from "react"
import { Search, Filter, MapPin, Briefcase, GraduationCap, Users } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { AlumniCard } from "./AlumniCard"
import { useApi } from "../../hooks/useApi"
import { VisuallyHidden } from "../ui/visually-hidden"

// Mock alumni data
export const mockAlumni = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    graduationYear: 2019,
    degree: "Computer Science",
    currentRole: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    industry: "Technology",
    skills: ["JavaScript", "React", "Python", "Machine Learning"],
    bio: "Passionate software engineer with 5+ years of experience in web development and AI. Love mentoring students and contributing to open source projects.",
    avatar: "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc1Nzc2NDc4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    linkedIn: "https://linkedin.com/in/sarahchen",
    experience: [
      { company: "Google", role: "Senior Software Engineer", years: "2021-Present" },
      { company: "Microsoft", role: "Software Engineer", years: "2019-2021" }
    ]
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    graduationYear: 2020,
    degree: "Business Administration",
    currentRole: "Product Manager",
    company: "Apple",
    location: "Cupertino, CA",
    industry: "Technology",
    skills: ["Product Management", "Strategy", "Analytics", "Leadership"],
    bio: "Product manager passionate about creating user-centric experiences. Previously worked in consulting and startups.",
    avatar: "https://images.unsplash.com/photo-1719257751404-1dea075324bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NTc3ODEzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    linkedIn: "https://linkedin.com/in/michaelrodriguez",
    experience: [
      { company: "Apple", role: "Product Manager", years: "2022-Present" },
      { company: "Startup Inc", role: "Associate Product Manager", years: "2020-2022" }
    ]
  },
  {
    id: "3",
    name: "Dr. Jennifer Park",
    email: "jennifer.park@email.com",
    graduationYear: 2018,
    degree: "Medicine",
    currentRole: "Cardiologist",
    company: "Stanford Medical Center",
    location: "Palo Alto, CA",
    industry: "Healthcare",
    skills: ["Cardiology", "Research", "Patient Care", "Medical Education"],
    bio: "Board-certified cardiologist with expertise in interventional cardiology. Actively involved in clinical research and medical education.",
    avatar: "https://images.unsplash.com/photo-1757125736482-328a3cdd9743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkb2N0b3IlMjB3b21hbnxlbnwxfHx8fDE3NTc4NzAwNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    linkedIn: "https://linkedin.com/in/drjenniferpark",
    experience: [
      { company: "Stanford Medical Center", role: "Attending Cardiologist", years: "2023-Present" },
      { company: "UCSF Medical Center", role: "Cardiology Fellow", years: "2021-2023" }
    ]
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    graduationYear: 2017,
    degree: "Finance",
    currentRole: "Investment Banker",
    company: "Goldman Sachs",
    location: "New York, NY",
    industry: "Finance",
    skills: ["Investment Banking", "Financial Modeling", "M&A", "Client Relations"],
    bio: "Investment banker specializing in technology sector M&A. Enjoy helping students navigate finance careers.",
    avatar: "https://images.unsplash.com/photo-1561731885-e0591a34659c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG1hbnxlbnwxfHx8fDE3NTc4MDA5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    linkedIn: "https://linkedin.com/in/davidkim",
    experience: [
      { company: "Goldman Sachs", role: "Vice President", years: "2020-Present" },
      { company: "Goldman Sachs", role: "Associate", years: "2017-2020" }
    ]
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    graduationYear: 2016,
    degree: "Marketing",
    currentRole: "Marketing Director",
    company: "Nike",
    location: "Portland, OR",
    industry: "Consumer Goods",
    skills: ["Brand Marketing", "Digital Marketing", "Campaign Management", "Analytics"],
    bio: "Creative marketing professional with expertise in brand strategy and digital campaigns. Passionate about storytelling and consumer insights.",
    avatar: "https://images.unsplash.com/photo-1563132337-f159f484226c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvbWFufGVufDF8fHx8MTc1NzgyMjUxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    linkedIn: "https://linkedin.com/in/lisathompson",
    experience: [
      { company: "Nike", role: "Marketing Director", years: "2021-Present" },
      { company: "Adidas", role: "Senior Marketing Manager", years: "2018-2021" }
    ]
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    graduationYear: 2015,
    degree: "Engineering",
    currentRole: "CTO",
    company: "TechStart",
    location: "Austin, TX",
    industry: "Technology",
    skills: ["Leadership", "Software Architecture", "Team Building", "Strategy"],
    bio: "Experienced technology leader and entrepreneur. Founded two successful startups and currently CTO at a growing tech company.",
    avatar: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWNoJTIwZXhlY3V0aXZlfGVufDF8fHx8MTc1Nzg3MDA0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    linkedIn: "https://linkedin.com/in/roberttaylor",
    experience: [
      { company: "TechStart", role: "CTO", years: "2022-Present" },
      { company: "InnovateCorp", role: "VP Engineering", years: "2019-2022" }
    ]
  }
]

interface AlumniDirectoryProps {
  className?: string
  onNavigate?: (screen: string, alumniId?: string) => void
}

export function AlumniDirectory({ className, onNavigate }: AlumniDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedGradYear, setSelectedGradYear] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  const { data: apiAlumni, request: fetchAlumni, isLoading } = useApi<any[]>()

  useEffect(() => {
    fetchAlumni('get', '/alumni/search')
  }, [fetchAlumni])

  const alumniList = apiAlumni || []

  // Get unique values for filter options
  const industries = [...new Set(alumniList.map(alumni => alumni.industry))].filter(Boolean)
  const locations = [...new Set(alumniList.map(alumni => alumni.location?.split(", ")[1] || alumni.location))].filter(Boolean)
  const gradYears = [...new Set(alumniList.map(alumni => alumni.graduationYear?.toString()))].filter(Boolean)

  // Filter and sort alumni
  const filteredAlumni = useMemo(() => {
    let filtered = alumniList.filter(alumni => {
      const name = `${alumni.firstName} ${alumni.lastName}`
      const matchesSearch = 
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alumni.jobTitle && alumni.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (alumni.company && alumni.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (alumni.skills && alumni.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())))

      const matchesIndustry = selectedIndustry === "all" || alumni.industry === selectedIndustry
      const matchesLocation = selectedLocation === "all" || alumni.location.includes(selectedLocation)
      const matchesGradYear = selectedGradYear === "all" || alumni.graduationYear.toString() === selectedGradYear

      return matchesSearch && matchesIndustry && matchesLocation && matchesGradYear
    })

    // Sort results
    filtered.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`
      const nameB = `${b.firstName} ${b.lastName}`
      switch (sortBy) {
        case "name":
          return nameA.localeCompare(nameB)
        case "year":
          return (b.graduationYear || 0) - (a.graduationYear || 0)
        case "company":
          return (a.company || "").localeCompare(b.company || "")
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedIndustry, selectedLocation, selectedGradYear, sortBy])

  const activeFiltersCount = [selectedIndustry, selectedLocation, selectedGradYear].filter(f => f !== "all").length

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl">Alumni Directory</h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
          Connect with our amazing alumni community. Search by name, company, skills, or use filters to find the perfect mentor or connection.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, role, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 h-12 sm:h-14 text-base"
          />
        </div>

        {/* Quick Filters and Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[140px] sm:w-[160px] h-10 sm:h-11">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 sm:h-11 px-3 sm:px-4">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Alumni</SheetTitle>
                  <SheetDescription>
                    Use these filters to narrow down your search results.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block">Graduation Year</label>
                    <Select value={selectedGradYear} onValueChange={setSelectedGradYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {gradYears.sort((a, b) => b.localeCompare(a)).map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedIndustry("all")
                      setSelectedLocation("all")
                      setSelectedGradYear("all")
                    }}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-muted-foreground text-sm sm:text-base">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px] sm:w-[140px] h-10 sm:h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="year">Grad Year</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
          {selectedIndustry !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
              {selectedIndustry}
              <button 
                onClick={() => setSelectedIndustry("all")}
                className="ml-1 hover:text-destructive transition-colors"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedLocation !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              {selectedLocation}
              <button 
                onClick={() => setSelectedLocation("all")}
                className="ml-1 hover:text-destructive transition-colors"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedGradYear !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              Class of {selectedGradYear}
              <button 
                onClick={() => setSelectedGradYear("all")}
                className="ml-1 hover:text-destructive transition-colors"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">
            {filteredAlumni.length} alumni found
            {searchQuery && ` for "${searchQuery}"`}
          </span>
        </div>
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredAlumni.map(alumni => (
            <AlumniCard
              key={alumni.id}
              alumni={alumni}
              onClick={() => onNavigate?.('alumni-profile', alumni.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">No alumni found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedIndustry("all")
                  setSelectedLocation("all")
                  setSelectedGradYear("all")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
}