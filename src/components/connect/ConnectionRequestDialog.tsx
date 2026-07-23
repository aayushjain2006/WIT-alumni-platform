import { useState } from "react"
import { MessageCircle, X, Coffee, Video, Phone, Mail, Send, User, Clock, Star } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { useAuth } from "../../contexts/AuthContext"
import { useNotifications } from "../../contexts/NotificationContext"

const helpTopics = [
  "Career Advice & Guidance",
  "Resume Review & Feedback",
  "Interview Preparation",
  "Industry Insights",
  "Technical Skills Development",
  "Networking & Professional Development",
  "Job Search Strategy",
  "Career Transition Advice",
  "Salary Negotiation",
  "Work-Life Balance",
  "Company Culture Questions",
  "Other (please specify)"
]

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
}

const getContactIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case 'coffee chat':
      return Coffee
    case 'video call':
      return Video
    case 'phone call':
      return Phone
    case 'email':
      return Mail
    default:
      return MessageCircle
  }
}

interface ConnectionRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alumni: any
}

export function ConnectionRequestDialog({ open, onOpenChange, alumni }: ConnectionRequestDialogProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    helpTopic: "",
    customTopic: "",
    preferredContact: "",
    timeframe: "",
    message: "",
    introduction: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Add notification about connection request sent
    addNotification({
      type: "connections",
      title: "Connection request sent",
      description: `Your request to connect with ${alumni?.name} has been sent. They typically respond within ${alumni?.avgResponseTime}.`,
      isRead: false,
      actionUrl: "/connect"
    })

    // Reset form
    setFormData({
      helpTopic: "",
      customTopic: "",
      preferredContact: "",
      timeframe: "",
      message: "",
      introduction: ""
    })

    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would make an API call to send the connection request
    console.log("Connection request sent:", {
      alumni: alumni?.id,
      ...formData
    })
  }

  if (!alumni) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Request Connection
          </DialogTitle>
          <DialogDescription>
            Send a personalized connection request to get guidance and advice
          </DialogDescription>
        </DialogHeader>

        {/* Alumni Preview */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={alumni.avatar} alt={alumni.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(alumni.name)}
                  </AvatarFallback>
                </Avatar>
                {alumni.isAvailable && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{alumni.name}</h4>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {alumni.title} at {alumni.company}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    {alumni.rating}/5.0
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alumni.avgResponseTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {alumni.connectionsHelped} helped
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brief Introduction */}
          <div className="space-y-2">
            <Label htmlFor="introduction">Brief Introduction</Label>
            <Textarea
              id="introduction"
              placeholder="Tell them a bit about yourself - your major, year, interests, etc."
              rows={2}
              value={formData.introduction}
              onChange={(e) => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Help them understand your background and why you're reaching out
            </p>
          </div>

          {/* What do you need help with? */}
          <div className="space-y-2">
            <Label>What do you need help with? *</Label>
            <Select 
              value={formData.helpTopic} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, helpTopic: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {helpTopics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {formData.helpTopic === "Other (please specify)" && (
              <Input
                placeholder="Please specify what you need help with"
                value={formData.customTopic}
                onChange={(e) => setFormData(prev => ({ ...prev, customTopic: e.target.value }))}
                required
              />
            )}
          </div>

          {/* Preferred Contact Method */}
          <div className="space-y-4">
            <Label>Preferred Contact Method *</Label>
            <RadioGroup 
              value={formData.preferredContact} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, preferredContact: value }))}
              className="grid grid-cols-2 gap-4"
            >
              {alumni.preferredContact.map((method: string) => {
                const Icon = getContactIcon(method)
                return (
                  <div key={method} className="flex items-center space-x-2">
                    <RadioGroupItem value={method} id={method} />
                    <Label htmlFor={method} className="flex items-center gap-2 cursor-pointer">
                      <Icon className="h-4 w-4" />
                      {method}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {/* Timeframe */}
          <div className="space-y-2">
            <Label>When would you like to connect?</Label>
            <Select 
              value={formData.timeframe} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeframe: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">As soon as possible</SelectItem>
                <SelectItem value="this-week">This week</SelectItem>
                <SelectItem value="next-week">Next week</SelectItem>
                <SelectItem value="within-month">Within the next month</SelectItem>
                <SelectItem value="flexible">I'm flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message *</Label>
            <Textarea
              id="message"
              placeholder="Write a thoughtful message explaining why you'd like to connect with this alumni specifically and what you hope to gain from the conversation..."
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Be specific about what drew you to this alumni and what you're hoping to learn
            </p>
          </div>

          <Separator />

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tips for a great connection request</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about what you need help with</li>
                <li>• Show that you've done your research about them</li>
                <li>• Keep your message concise but personal</li>
                <li>• Be respectful of their time and expertise</li>
                <li>• Come prepared with specific questions</li>
              </ul>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}