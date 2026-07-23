import { useState } from "react"
import { X, MapPin, Building2, GraduationCap, Users, Star } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"

const popularCompanies = [
  "Google", "Meta", "Netflix", "Airbnb", "Slack", "Spotify", "Uber", "Tesla",
  "Microsoft", "Amazon", "Apple", "Goldman Sachs", "JPMorgan", "McKinsey"
]

const majors = [
  "Computer Science", "Business Administration", "Engineering", "Design", 
  "Economics", "Statistics", "Marketing", "Finance", "Psychology", "Biology"
]

const expertiseAreas = [
  "Product Management", "Software Engineering", "Data Science", "UX Design",
  "Marketing", "Finance", "Consulting", "Sales", "Operations", "Legal"
]

const graduationYears = [
  "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"
]

interface ConnectFiltersProps {
  filters: {
    location: string
    company: string
    major: string
    graduationYear: string
    expertise: string
    availability: string
  }
  onFiltersChange: (filters: any) => void
  onClose: () => void
}

export function ConnectFilters({ filters, onFiltersChange, onClose }: ConnectFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      location: "",
      company: "",
      major: "",
      graduationYear: "",
      expertise: "",
      availability: "all"
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFilterCount = Object.values(localFilters).filter(v => 
    v !== "" && v !== "all"
  ).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Filter Alumni
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              placeholder="e.g. San Francisco, CA"
              value={localFilters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </Label>
            <Select value={localFilters.company} onValueChange={(value) => updateFilter('company', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Companies</SelectItem>
                {popularCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Major
            </Label>
            <Select value={localFilters.major} onValueChange={(value) => updateFilter('major', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select major" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Majors</SelectItem>
                {majors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Graduation Year */}
          <div className="space-y-2">
            <Label>Graduation Year</Label>
            <Select value={localFilters.graduationYear} onValueChange={(value) => updateFilter('graduationYear', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                {graduationYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    Class of {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expertise */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Expertise
            </Label>
            <Select value={localFilters.expertise} onValueChange={(value) => updateFilter('expertise', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Areas</SelectItem>
                {expertiseAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label>Availability</Label>
            <Select value={localFilters.availability} onValueChange={(value) => updateFilter('availability', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alumni</SelectItem>
                <SelectItem value="available">Available Now</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Quick Filter Buttons */}
        <div className="space-y-4">
          <Label>Quick Filters</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={localFilters.availability === "available" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('availability', localFilters.availability === "available" ? "all" : "available")}
            >
              Available Now
            </Button>
            <Button
              variant={localFilters.company === "Google" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('company', localFilters.company === "Google" ? "" : "Google")}
            >
              Google Alumni
            </Button>
            <Button
              variant={localFilters.company === "Meta" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('company', localFilters.company === "Meta" ? "" : "Meta")}
            >
              Meta Alumni
            </Button>
            <Button
              variant={localFilters.expertise === "Product Management" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('expertise', localFilters.expertise === "Product Management" ? "" : "Product Management")}
            >
              Product Managers
            </Button>
            <Button
              variant={localFilters.expertise === "Software Engineering" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('expertise', localFilters.expertise === "Software Engineering" ? "" : "Software Engineering")}
            >
              Engineers
            </Button>
            <Button
              variant={localFilters.major === "Computer Science" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('major', localFilters.major === "Computer Science" ? "" : "Computer Science")}
            >
              CS Alumni
            </Button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Active filters: </span>
              <span className="font-medium">{activeFilterCount}</span>
            </div>
            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
          
          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {localFilters.location && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('location', '')}>
                  Location: {localFilters.location}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.company && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('company', '')}>
                  Company: {localFilters.company}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.major && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('major', '')}>
                  Major: {localFilters.major}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.graduationYear && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('graduationYear', '')}>
                  Class of {localFilters.graduationYear}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.expertise && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('expertise', '')}>
                  Expertise: {localFilters.expertise}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.availability === "available" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('availability', 'all')}>
                  Available Now
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}