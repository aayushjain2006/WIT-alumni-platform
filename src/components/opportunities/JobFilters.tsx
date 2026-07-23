import { useState } from "react"
import { X, MapPin, Briefcase, Clock, DollarSign, Code } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { Slider } from "../ui/slider"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"

const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary"]
const experienceLevels = ["Entry Level", "1-2 years", "3-5 years", "5+ years", "Senior Level"]
const popularSkills = [
  "JavaScript", "Python", "Java", "React", "Node.js", "AWS", "Docker", 
  "Kubernetes", "SQL", "MongoDB", "Git", "TypeScript", "Go", "Rust",
  "Product Management", "Data Science", "Machine Learning", "DevOps",
  "UI/UX Design", "Marketing", "Sales", "Finance"
]

interface JobFiltersProps {
  filters: {
    location: string
    type: string
    experience: string
    remote: boolean
    salary: number[]
    skills: string[]
  }
  onFiltersChange: (filters: any) => void
  onClose: () => void
}

export function JobFilters({ filters, onFiltersChange, onClose }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const addSkill = (skill: string) => {
    const newSkills = [...localFilters.skills, skill]
    updateFilter('skills', newSkills)
  }

  const removeSkill = (skill: string) => {
    const newSkills = localFilters.skills.filter(s => s !== skill)
    updateFilter('skills', newSkills)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      location: "",
      type: "",
      experience: "",
      remote: false,
      salary: [0, 300000],
      skills: []
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const formatSalary = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Filter Jobs
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Job Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Job Type
            </Label>
            <Select value={localFilters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </Label>
            <Select value={localFilters.experience} onValueChange={(value) => updateFilter('experience', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remote Option */}
          <div className="space-y-2">
            <Label>Work Arrangement</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remote"
                checked={localFilters.remote}
                onCheckedChange={(checked) => updateFilter('remote', checked)}
              />
              <Label htmlFor="remote" className="text-sm">
                Remote work available
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Salary Range */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Salary Range
          </Label>
          <div className="px-4">
            <Slider
              value={localFilters.salary}
              onValueChange={(value) => updateFilter('salary', value)}
              max={300000}
              min={0}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatSalary(localFilters.salary[0])}</span>
              <span>{formatSalary(localFilters.salary[1])}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Skills */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Skills & Technologies
          </Label>
          
          {/* Selected Skills */}
          {localFilters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localFilters.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}

          {/* Available Skills */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {popularSkills
              .filter(skill => !localFilters.skills.includes(skill))
              .map((skill) => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  className="justify-start h-8 text-xs"
                  onClick={() => addSkill(skill)}
                >
                  {skill}
                </Button>
              ))}
          </div>
        </div>

        {/* Filter Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Active filters: </span>
              <span className="font-medium">
                {Object.values(localFilters).filter(v => 
                  Array.isArray(v) ? v.length > 0 : v !== "" && v !== false && !(Array.isArray(v) && v[0] === 0 && v[1] === 300000)
                ).length}
              </span>
            </div>
            {Object.values(localFilters).some(v => 
              Array.isArray(v) ? v.length > 0 : v !== "" && v !== false && !(Array.isArray(v) && v[0] === 0 && v[1] === 300000)
            ) && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}