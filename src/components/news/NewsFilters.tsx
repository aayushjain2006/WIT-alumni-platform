import { useState } from "react"
import { X, Calendar, User, Tag, Filter } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"

const categories = [
  "Campus Updates",
  "Alumni Success", 
  "Alumni Network",
  "Student Life",
  "Student Achievement",
  "Academic",
  "Financial Aid"
]

const authors = [
  "University Communications",
  "Alumni Relations",
  "Career Services",
  "Engineering Department",
  "Research Office",
  "Financial Aid Office",
  "Sustainability Office"
]

const popularTags = [
  "Innovation", "Achievement", "Technology", "Alumni", "Students", 
  "Career", "Research", "Sustainability", "Partnership", "Scholarship",
  "STEM", "Engineering", "Competition", "Program", "Success"
]

const dateRanges = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "quarter" },
  { label: "This Year", value: "year" }
]

interface NewsFiltersProps {
  filters: {
    category: string
    author: string
    dateRange: string
    tags: string[]
  }
  onFiltersChange: (filters: any) => void
  onClose: () => void
}

export function NewsFilters({ filters, onFiltersChange, onClose }: NewsFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const addTag = (tag: string) => {
    if (!localFilters.tags.includes(tag)) {
      const newTags = [...localFilters.tags, tag]
      updateFilter('tags', newTags)
    }
  }

  const removeTag = (tag: string) => {
    const newTags = localFilters.tags.filter(t => t !== tag)
    updateFilter('tags', newTags)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      category: "",
      author: "",
      dateRange: "",
      tags: []
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFilterCount = Object.values(localFilters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== ""
  ).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter News
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
          {/* Category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Category
            </Label>
            <Select value={localFilters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Author
            </Label>
            <Select value={localFilters.author} onValueChange={(value) => updateFilter('author', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All authors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Authors</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Label>
            <Select value={localFilters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Time</SelectItem>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Author Search */}
          <div className="space-y-2">
            <Label>Search Author</Label>
            <Input
              placeholder="Enter author name..."
              value={localFilters.author}
              onChange={(e) => updateFilter('author', e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Tags */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </Label>
          
          {/* Selected Tags */}
          {localFilters.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localFilters.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}

          {/* Available Tags */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {popularTags
              .filter(tag => !localFilters.tags.includes(tag))
              .map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="justify-start h-8 text-xs"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Button>
              ))}
          </div>
        </div>

        <Separator />

        {/* Quick Filter Buttons */}
        <div className="space-y-4">
          <Label>Quick Filters</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={localFilters.category === "Alumni Success" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('category', localFilters.category === "Alumni Success" ? "" : "Alumni Success")}
            >
              Alumni Achievements
            </Button>
            <Button
              variant={localFilters.category === "Student Achievement" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('category', localFilters.category === "Student Achievement" ? "" : "Student Achievement")}
            >
              Student Success
            </Button>
            <Button
              variant={localFilters.category === "Campus Updates" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('category', localFilters.category === "Campus Updates" ? "" : "Campus Updates")}
            >
              Campus News
            </Button>
            <Button
              variant={localFilters.dateRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('dateRange', localFilters.dateRange === "week" ? "" : "week")}
            >
              This Week
            </Button>
            <Button
              variant={localFilters.tags.includes("Technology") ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (localFilters.tags.includes("Technology")) {
                  removeTag("Technology")
                } else {
                  addTag("Technology")
                }
              }}
            >
              Tech News
            </Button>
            <Button
              variant={localFilters.tags.includes("Research") ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (localFilters.tags.includes("Research")) {
                  removeTag("Research")
                } else {
                  addTag("Research")
                }
              }}
            >
              Research
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
              {localFilters.category && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('category', '')}>
                  Category: {localFilters.category}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.author && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('author', '')}>
                  Author: {localFilters.author}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.dateRange && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('dateRange', '')}>
                  Date: {dateRanges.find(r => r.value === localFilters.dateRange)?.label}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {localFilters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  Tag: {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}