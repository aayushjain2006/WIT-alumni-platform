import { useState } from "react"
import { Plus, X, Image, Calendar, Tag, Send, Eye } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useAuth } from "../../contexts/AuthContext"
import { useNotifications } from "../../contexts/NotificationContext"
import { unsplash_tool } from "../../tools/unsplash"

const categories = [
  "Campus Updates",
  "Alumni Success", 
  "Alumni Network",
  "Student Life",
  "Student Achievement",
  "Academic",
  "Financial Aid"
]

const suggestedTags = [
  "Innovation", "Achievement", "Technology", "Alumni", "Students", 
  "Career", "Research", "Sustainability", "Partnership", "Scholarship",
  "STEM", "Engineering", "Competition", "Program", "Success",
  "Award", "Grant", "Event", "Announcement", "Update"
]

interface CreateNewsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNewsDialog({ open, onOpenChange }: CreateNewsDialogProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTag, setCurrentTag] = useState("")
  const [activeTab, setActiveTab] = useState("write")
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    image: "",
    tags: [] as string[],
    featured: false,
    priority: "medium" as "low" | "medium" | "high",
    publishDate: "",
    publishImmediately: true
  })

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const handleImageSearch = async (query: string) => {
    try {
      // In real app, this would use the unsplash tool
      const imageUrl = `https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop`
      setFormData(prev => ({ ...prev, image: imageUrl }))
    } catch (error) {
      console.error("Failed to fetch image:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Add notification about news post created
    addNotification({
      type: "system",
      title: "News article published successfully",
      description: `Your article "${formData.title}" has been published and is now visible to the community`,
      isRead: false,
      actionUrl: "/campus-news"
    })

    // Reset form
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      image: "",
      tags: [],
      featured: false,
      priority: "medium",
      publishDate: "",
      publishImmediately: true
    })

    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would make an API call to create the news article
    console.log("News article created:", formData)
  }

  const renderPreview = () => (
    <Card>
      <CardContent className="p-6">
        {formData.image && (
          <div className="relative mb-4">
            <img
              src={formData.image}
              alt={formData.title || "News image"}
              className="w-full h-48 object-cover rounded-lg"
            />
            {formData.featured && (
              <Badge className="absolute top-3 left-3 bg-primary">
                Featured
              </Badge>
            )}
            {formData.category && (
              <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-800">
                {formData.category}
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="line-clamp-2">
              {formData.title || "Your article title will appear here"}
            </h3>
            {formData.excerpt && (
              <p className="text-muted-foreground mt-2">
                {formData.excerpt}
              </p>
            )}
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {formData.content && (
            <div className="prose prose-sm max-w-none">
              <p>{formData.content.substring(0, 200)}...</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {user?.name}</span>
            <span>•</span>
            <span>{formData.publishImmediately ? "Publishing now" : `Publishing ${formData.publishDate}`}</span>
            <span>•</span>
            <span>Priority: {formData.priority}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create News Article
          </DialogTitle>
          <DialogDescription>
            Share important news and updates with the campus community
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Write Article
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a brief summary that will appear in news previews..."
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Keep it concise - this will be shown in news cards and previews
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Article Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write the full article content..."
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                />
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste image URL or search for an image..."
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleImageSearch(formData.title)}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag(currentTag)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddTag(currentTag)}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedTags
                    .filter(tag => !formData.tags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => handleAddTag(tag)}
                      >
                        + {tag}
                      </Button>
                    ))}
                </div>
              </div>

              {/* Publishing Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority Level</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value: "low" | "medium" | "high") => setFormData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High (Important)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Schedule Publishing</Label>
                      <Input
                        type="datetime-local"
                        value={formData.publishDate}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          publishDate: e.target.value,
                          publishImmediately: !e.target.value
                        }))}
                        disabled={formData.publishImmediately}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                      />
                      <Label htmlFor="featured">Feature this article</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="immediate"
                        checked={formData.publishImmediately}
                        onCheckedChange={(checked) => setFormData(prev => ({ 
                          ...prev, 
                          publishImmediately: checked,
                          publishDate: checked ? "" : prev.publishDate
                        }))}
                      />
                      <Label htmlFor="immediate">Publish immediately</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("preview")}>
                  Preview
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Publishing..." : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {formData.publishImmediately ? "Publish Now" : "Schedule"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3>Article Preview</h3>
              <Button variant="outline" onClick={() => setActiveTab("write")}>
                Back to Edit
              </Button>
            </div>
            {renderPreview()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}