import { useState } from "react"
import { Send, Clock, Users, Target, Calendar, Mail, MessageSquare, Eye } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { Switch } from "../ui/switch"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useNotifications } from "../../contexts/NotificationContext"

interface CreateAnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAnnouncementDialog({ open, onOpenChange }: CreateAnnouncementDialogProps) {
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "",
    priority: "medium",
    sendMethod: "immediate",
    scheduledDate: "",
    scheduledTime: "",
    // Audience targeting
    targetRoles: [] as string[],
    targetGradYears: [] as string[],
    targetMajors: [] as string[],
    customFilter: "",
    // Channel settings
    sendEmail: true,
    sendInApp: true,
    sendPush: false,
    // Options
    allowComments: true,
    trackEngagement: true,
    saveAsTemplate: false
  })

  const announcementTypes = [
    { value: "event", label: "Event Announcement", icon: Calendar },
    { value: "career", label: "Career Opportunity", icon: Target },
    { value: "scholarship", label: "Scholarship/Funding", icon: Users },
    { value: "system", label: "System Update", icon: MessageSquare },
    { value: "general", label: "General News", icon: Mail }
  ]

  const roles = ["student", "alumni", "admin"]
  const graduationYears = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "Other"]
  const majors = [
    "Computer Science", "Engineering", "Business Administration", 
    "Data Science", "Marketing", "Finance", "Psychology", "Biology", "Other"
  ]

  const templates = {
    event: {
      title: "Join us for [Event Name]",
      content: "We're excited to invite you to [Event Name] on [Date] at [Location].\n\n[Event Description]\n\nRegister now at [Registration Link]\n\nWe look forward to seeing you there!"
    },
    career: {
      title: "New Career Opportunity: [Job Title]",
      content: "We're pleased to share an exciting career opportunity that may be of interest to our alumni community.\n\n[Company Name] is seeking a [Job Title].\n\n[Job Description]\n\nInterested? Apply at [Application Link]"
    },
    scholarship: {
      title: "New Scholarship Opportunity Available",
      content: "We're excited to announce a new scholarship opportunity for our students.\n\n[Scholarship Name]\nAmount: [Amount]\nDeadline: [Deadline]\n\n[Description and Requirements]\n\nApply at [Application Link]"
    }
  }

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, type }))
    
    // Auto-fill template if available
    if (templates[type as keyof typeof templates]) {
      const template = templates[type as keyof typeof templates]
      if (!formData.title && !formData.content) {
        setFormData(prev => ({
          ...prev,
          title: template.title,
          content: template.content
        }))
      }
    }
  }

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }))
  }

  const handleGradYearToggle = (year: string) => {
    setFormData(prev => ({
      ...prev,
      targetGradYears: prev.targetGradYears.includes(year)
        ? prev.targetGradYears.filter(y => y !== year)
        : [...prev.targetGradYears, year]
    }))
  }

  const handleMajorToggle = (major: string) => {
    setFormData(prev => ({
      ...prev,
      targetMajors: prev.targetMajors.includes(major)
        ? prev.targetMajors.filter(m => m !== major)
        : [...prev.targetMajors, major]
    }))
  }

  const calculateRecipients = () => {
    // Mock calculation based on selections
    let baseCount = 2847 // Total users
    
    if (formData.targetRoles.length > 0) {
      if (formData.targetRoles.includes("student") && !formData.targetRoles.includes("alumni")) {
        baseCount = 1654
      } else if (formData.targetRoles.includes("alumni") && !formData.targetRoles.includes("student")) {
        baseCount = 1138
      }
    }
    
    if (formData.targetGradYears.length > 0 && formData.targetGradYears.length < graduationYears.length) {
      baseCount = Math.floor(baseCount * 0.6) // Rough estimation
    }
    
    if (formData.targetMajors.length > 0 && formData.targetMajors.length < majors.length) {
      baseCount = Math.floor(baseCount * 0.4) // Rough estimation
    }
    
    return baseCount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const action = formData.sendMethod === "immediate" ? "sent" : "scheduled"
    const recipients = calculateRecipients()

    addNotification({
      type: "system",
      title: `Announcement ${action} successfully`,
      description: `Your announcement "${formData.title}" has been ${action} to ${recipients} recipients`,
      isRead: false,
      actionUrl: "/admin/announcements"
    })

    // Reset form
    setFormData({
      title: "",
      content: "",
      type: "",
      priority: "medium",
      sendMethod: "immediate",
      scheduledDate: "",
      scheduledTime: "",
      targetRoles: [],
      targetGradYears: [],
      targetMajors: [],
      customFilter: "",
      sendEmail: true,
      sendInApp: true,
      sendPush: false,
      allowComments: true,
      trackEngagement: true,
      saveAsTemplate: false
    })

    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would make an API call to create the announcement
    console.log("Announcement created:", formData)
  }

  const renderPreview = () => (
    <Card className="bg-muted/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary">
              {announcementTypes.find(t => t.value === formData.type)?.label || "Announcement"}
            </Badge>
            <Badge variant="outline">{formData.priority} priority</Badge>
          </div>
          
          <h3>{formData.title || "Your announcement title will appear here"}</h3>
          
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">
              {formData.content || "Your announcement content will appear here..."}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
            <span>To: {calculateRecipients()} recipients</span>
            <span>•</span>
            <span>
              {formData.sendMethod === "immediate" 
                ? "Sending immediately" 
                : `Scheduled for ${formData.scheduledDate} at ${formData.scheduledTime}`
              }
            </span>
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
            <Send className="h-5 w-5" />
            Create Announcement
          </DialogTitle>
          <DialogDescription>
            Create and send announcements to your alumni community
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="compose" className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Announcement Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter announcement title..."
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Announcement Type *</Label>
                    <Select value={formData.type} onValueChange={handleTypeChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {announcementTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your announcement content..."
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority Level</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Send Method</Label>
                    <Select value={formData.sendMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, sendMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Send Immediately</SelectItem>
                        <SelectItem value="scheduled">Schedule for Later</SelectItem>
                        <SelectItem value="draft">Save as Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.sendMethod === "scheduled" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Scheduled Date</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime">Scheduled Time</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Channel Settings */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4">Delivery Channels</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Email Notification</p>
                          <p className="text-xs text-muted-foreground">Send via email to user inboxes</p>
                        </div>
                        <Switch
                          checked={formData.sendEmail}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendEmail: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">In-App Notification</p>
                          <p className="text-xs text-muted-foreground">Show in platform notification center</p>
                        </div>
                        <Switch
                          checked={formData.sendInApp}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendInApp: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Push Notification</p>
                          <p className="text-xs text-muted-foreground">Send mobile push notifications</p>
                        </div>
                        <Switch
                          checked={formData.sendPush}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendPush: checked }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audience" className="space-y-6">
              {/* Audience Targeting */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3>Target Audience</h3>
                    <Badge variant="secondary">
                      {calculateRecipients()} recipients
                    </Badge>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">User Roles</Label>
                    <div className="flex flex-wrap gap-2">
                      {roles.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role}`}
                            checked={formData.targetRoles.includes(role)}
                            onCheckedChange={() => handleRoleToggle(role)}
                          />
                          <Label htmlFor={`role-${role}`} className="capitalize text-sm">
                            {role}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Graduation Year Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Graduation Years</Label>
                    <div className="flex flex-wrap gap-2">
                      {graduationYears.map((year) => (
                        <div key={year} className="flex items-center space-x-2">
                          <Checkbox
                            id={`year-${year}`}
                            checked={formData.targetGradYears.includes(year)}
                            onCheckedChange={() => handleGradYearToggle(year)}
                          />
                          <Label htmlFor={`year-${year}`} className="text-sm">
                            {year}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Major Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Majors</Label>
                    <div className="flex flex-wrap gap-2">
                      {majors.map((major) => (
                        <div key={major} className="flex items-center space-x-2">
                          <Checkbox
                            id={`major-${major}`}
                            checked={formData.targetMajors.includes(major)}
                            onCheckedChange={() => handleMajorToggle(major)}
                          />
                          <Label htmlFor={`major-${major}`} className="text-sm">
                            {major}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="customFilter">Custom Filter (Optional)</Label>
                    <Textarea
                      id="customFilter"
                      placeholder="Describe any additional targeting criteria..."
                      rows={3}
                      value={formData.customFilter}
                      onChange={(e) => setFormData(prev => ({ ...prev, customFilter: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Announcement Preview</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {calculateRecipients()} recipients
                    </span>
                  </div>
                </div>
                {renderPreview()}
              </div>
            </TabsContent>

            {/* Additional Options */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Additional Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowComments"
                      checked={formData.allowComments}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowComments: !!checked }))}
                    />
                    <Label htmlFor="allowComments">Allow comments on this announcement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trackEngagement"
                      checked={formData.trackEngagement}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, trackEngagement: !!checked }))}
                    />
                    <Label htmlFor="trackEngagement">Track engagement analytics</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveAsTemplate"
                      checked={formData.saveAsTemplate}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, saveAsTemplate: !!checked }))}
                    />
                    <Label htmlFor="saveAsTemplate">Save as template for future use</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : (
                  <>
                    {formData.sendMethod === "immediate" ? (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </>
                    ) : formData.sendMethod === "scheduled" ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule
                      </>
                    ) : (
                      "Save Draft"
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}