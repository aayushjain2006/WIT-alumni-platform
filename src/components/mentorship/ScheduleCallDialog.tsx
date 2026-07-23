import { useState } from "react"
import { Calendar, Clock, Video, PhoneCall, MessageSquare, Send } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { useNotifications } from "../../contexts/NotificationContext"

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"
]

const meetingPlatforms = [
  { value: "zoom", label: "Zoom", icon: Video },
  { value: "google-meet", label: "Google Meet", icon: Video },
  { value: "teams", label: "Microsoft Teams", icon: Video },
  { value: "phone", label: "Phone Call", icon: PhoneCall }
]

const sessionTemplates = [
  {
    title: "Career Guidance Session",
    duration: 60,
    description: "Discuss career paths, industry insights, and professional development"
  },
  {
    title: "Resume & Portfolio Review", 
    duration: 45,
    description: "Review and provide feedback on resume, portfolio, or LinkedIn profile"
  },
  {
    title: "Interview Preparation",
    duration: 60,
    description: "Practice interviews and provide tips for job interviews"
  },
  {
    title: "Goal Setting & Planning",
    duration: 45,
    description: "Set academic and career goals with actionable steps"
  },
  {
    title: "Networking & Industry Insights",
    duration: 30,
    description: "Share industry knowledge and networking strategies"
  },
  {
    title: "Check-in Session",
    duration: 30,
    description: "Regular progress check-in and Q&A"
  }
]

interface ScheduleCallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mentee?: any
}

export function ScheduleCallDialog({ open, onOpenChange, mentee }: ScheduleCallDialogProps) {
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    menteeId: mentee?.id || "",
    date: "",
    time: "",
    duration: 60,
    platform: "zoom",
    title: "",
    description: "",
    agenda: "",
    preparationNotes: "",
    sendReminder: true,
    recordSession: false
  })

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      title: template.title,
      duration: template.duration,
      description: template.description
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Add notification
    addNotification({
      type: "system",
      title: "Meeting scheduled successfully",
      description: `Your ${formData.title} with ${mentee?.name || 'student'} has been scheduled for ${formData.date} at ${formData.time}`,
      isRead: false,
      actionUrl: "/mentorship"
    })

    // Reset form
    setFormData({
      menteeId: "",
      date: "",
      time: "",
      duration: 60,
      platform: "zoom",
      title: "",
      description: "",
      agenda: "",
      preparationNotes: "",
      sendReminder: true,
      recordSession: false
    })
    setSelectedTemplate(null)

    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would make an API call to schedule the meeting
    console.log("Meeting scheduled:", formData)
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Mentorship Session
          </DialogTitle>
          <DialogDescription>
            {mentee 
              ? `Schedule a mentorship session with ${mentee.name}`
              : "Schedule a new mentorship session"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Templates */}
          <div className="space-y-3">
            <Label>Session Type (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessionTemplates.map((template) => (
                <Card 
                  key={template.title}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.title === template.title ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-1">{template.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {template.duration} minutes
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mentee Selection */}
          {!mentee && (
            <div className="space-y-2">
              <Label htmlFor="mentee">Mentee *</Label>
              <Select value={formData.menteeId} onValueChange={(value) => setFormData(prev => ({ ...prev, menteeId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a mentee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentee-1">Emily Davis</SelectItem>
                  <SelectItem value="mentee-2">Alex Chen</SelectItem>
                  <SelectItem value="mentee-4">Michael Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                min={getTomorrowDate()}
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Select 
                value={formData.duration.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meeting Platform */}
          <div className="space-y-2">
            <Label>Meeting Platform *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {meetingPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <Card 
                    key={platform.value}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      formData.platform === platform.value ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, platform: platform.value }))}
                  >
                    <CardContent className="p-3 text-center">
                      <Icon className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">{platform.label}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Career Guidance Session"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what will be covered in this session..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea
                id="agenda"
                placeholder="Session agenda and topics to discuss..."
                rows={4}
                value={formData.agenda}
                onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparation">Preparation Notes</Label>
              <Textarea
                id="preparation"
                placeholder="Any preparation notes or materials for the mentee..."
                rows={3}
                value={formData.preparationNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationNotes: e.target.value }))}
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminder"
                checked={formData.sendReminder}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendReminder: !!checked }))}
              />
              <Label htmlFor="reminder">Send email reminder 24 hours before</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="record"
                checked={formData.recordSession}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recordSession: !!checked }))}
              />
              <Label htmlFor="record">Record session (with mentee's consent)</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Schedule Session
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}