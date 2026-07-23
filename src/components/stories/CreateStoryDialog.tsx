import { useState } from "react"
import { BookOpen, Upload, Eye, Send, Image, Tag, Save, X } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Checkbox } from "../ui/checkbox"
import { useAuth } from "../../contexts/AuthContext"
import { useNotifications } from "../../contexts/NotificationContext"

const storyCategories = [
  "Career Success",
  "Social Impact", 
  "Personal Achievement",
  "Entrepreneurship",
  "Giving Back",
  "Academic Excellence",
  "Innovation & Research"
]

const suggestedTags = [
  "Technology", "Career Growth", "Leadership", "Innovation", "Startup",
  "Research", "Community Service", "Mentorship", "Global Impact",
  "Education", "Healthcare", "Environment", "Arts", "Sports",
  "Finance", "Engineering", "Business", "Non-profit"
]

const storyTemplates = [
  {
    title: "Career Journey",
    description: "Share your professional path and key milestones",
    prompts: [
      "What was your major and why did you choose it?",
      "How did university prepare you for your career?", 
      "What were the key turning points in your journey?",
      "What advice would you give to current students?"
    ]
  },
  {
    title: "Overcoming Challenges",
    description: "Inspire others by sharing how you overcame obstacles",
    prompts: [
      "What challenge did you face during or after university?",
      "How did you approach solving this problem?",
      "What resources or support helped you?",
      "What did you learn from this experience?"
    ]
  },
  {
    title: "Making an Impact",
    description: "Highlight your contributions to community or society",
    prompts: [
      "What cause or issue are you passionate about?",
      "How are you making a difference in this area?",
      "What inspired you to get involved?",
      "What impact have you achieved so far?"
    ]
  },
  {
    title: "Innovation Story",
    description: "Share a breakthrough, invention, or creative solution",
    prompts: [
      "What problem were you trying to solve?",
      "How did you develop your solution?",
      "What role did your education play?",
      "What has been the impact of your innovation?"
    ]
  }
]

interface CreateStoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignId?: string
}

export function CreateStoryDialog({ open, onOpenChange, campaignId }: CreateStoryDialogProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [] as string[],
    image: "",
    publishImmediately: true,
    allowComments: true,
    featuredImage: null as File | null
  })

  const [currentTag, setCurrentTag] = useState("")

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      content: template.prompts.map((prompt: string, index: number) => 
        `**${prompt}**\n\n[Your answer here]\n\n`
      ).join('')
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }))
      // In real app, would upload to storage and get URL
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, image: imageUrl }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Add notification
    addNotification({
      type: "system",
      title: "Story published successfully!",
      description: `Your story "${formData.title}" has been published and is now visible to the alumni community`,
      isRead: false,
      actionUrl: "/stories"
    })

    // Reset form
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: [],
      image: "",
      publishImmediately: true,
      allowComments: true,
      featuredImage: null
    })
    setSelectedTemplate(null)

    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would make an API call to create the story
    console.log("Story created:", formData)
  }

  const renderPreview = () => (
    <Card>
      <div className="relative">
        {formData.image && (
          <img
            src={formData.image}
            alt={formData.title || "Story preview"}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        {formData.category && (
          <Badge className="absolute top-3 left-3 bg-blue-100 text-blue-800">
            {formData.category}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="mb-3">
          {formData.title || "Your story title will appear here"}
        </h3>
        
        {formData.excerpt && (
          <p className="text-muted-foreground mb-4">
            {formData.excerpt}
          </p>
        )}

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {formData.content && (
          <div className="prose prose-sm max-w-none">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Content preview:</p>
              <p className="line-clamp-4">{formData.content.substring(0, 300)}...</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span>By {user?.name}</span>
          <span>•</span>
          <span>Class of {user?.graduationYear || '2020'}</span>
          <span>•</span>
          <span>{formData.publishImmediately ? 'Publishing now' : 'Draft'}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Share Your Story
          </DialogTitle>
          <DialogDescription>
            Inspire current students and fellow alumni by sharing your journey, achievements, and experiences
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Write Story
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Story Templates */}
              {!formData.content && (
                <div className="space-y-3">
                  <Label>Story Templates (Optional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {storyTemplates.map((template) => (
                      <Card 
                        key={template.title}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate?.title === template.title ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-1">{template.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Story Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. From Campus to Silicon Valley: My Journey"
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
                      {storyCategories.map((category) => (
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
                <Label htmlFor="excerpt">Story Summary *</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a brief summary that will appear in story previews..."
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This summary will be shown in story cards and previews
                </p>
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex-1 border border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload an image or drag and drop
                    </p>
                  </label>
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

              {/* Story Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Your Story *</Label>
                <Textarea
                  id="content"
                  placeholder={selectedTemplate 
                    ? "Use the template questions as a guide, or write your story in your own way..."
                    : "Share your journey, experiences, challenges, achievements, and lessons learned..."
                  }
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Share details that will help others understand your journey and learn from your experiences
                </p>
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
                    <Tag className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedTags
                    .filter(tag => !formData.tags.includes(tag))
                    .slice(0, 10)
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
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium">Publishing Options</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="publish"
                      checked={formData.publishImmediately}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        publishImmediately: !!checked 
                      }))}
                    />
                    <Label htmlFor="publish">Publish immediately</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="comments"
                      checked={formData.allowComments}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        allowComments: !!checked 
                      }))}
                    />
                    <Label htmlFor="comments">Allow comments from other alumni</Label>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("preview")}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Publishing..." : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {formData.publishImmediately ? "Publish Story" : "Save Draft"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3>Story Preview</h3>
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