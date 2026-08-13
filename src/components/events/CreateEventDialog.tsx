import { useState } from "react"
import { Calendar, MapPin, Users, Clock, Plus, X, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription } from "../ui/alert"
import api from "../../lib/api"
import { VisuallyHidden } from "../ui/visually-hidden"

interface CreateEventDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface AgendaItem {
  time: string
  activity: string
}

export function CreateEventDialog({ isOpen, onClose }: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    address: "",
    type: "",
    category: "",
    maxAttendees: "",
    isVirtual: false,
    ticketPrice: "",
    registrationDeadline: "",
    speakers: [] as string[],
    agenda: [] as AgendaItem[]
  })

  const [newSpeaker, setNewSpeaker] = useState("")
  const [newAgendaItem, setNewAgendaItem] = useState({ time: "", activity: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const eventTypes = [
    { value: "Networking", label: "Networking" },
    { value: "Career", label: "Career" },
    { value: "Entrepreneurship", label: "Entrepreneurship" },
    { value: "Reunion", label: "Reunion" },
    { value: "Workshop", label: "Workshop" },
    { value: "Seminar", label: "Seminar" }
  ]

  const eventCategories = [
    { value: "Professional", label: "Professional" },
    { value: "Social", label: "Social" },
    { value: "Academic", label: "Academic" },
    { value: "Business", label: "Business" }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSpeaker = () => {
    if (newSpeaker.trim()) {
      setFormData(prev => ({
        ...prev,
        speakers: [...prev.speakers, newSpeaker.trim()]
      }))
      setNewSpeaker("")
    }
  }

  const removeSpeaker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }))
  }

  const addAgendaItem = () => {
    if (newAgendaItem.time && newAgendaItem.activity) {
      setFormData(prev => ({
        ...prev,
        agenda: [...prev.agenda, { ...newAgendaItem }]
      }))
      setNewAgendaItem({ time: "", activity: "" })
    }
  }

  const removeAgendaItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        date: new Date(`${formData.date}T${formData.time || "09:00"}`).toISOString(),
        time: formData.time,
        endDate: formData.endTime ? new Date(`${formData.date}T${formData.endTime}`).toISOString() : undefined,
        endTime: formData.endTime || undefined,
        location: formData.location,
        address: formData.address,
        type: formData.type,
        category: formData.category,
        capacity: formData.maxAttendees ? parseInt(formData.maxAttendees) : 10,
        isVirtual: formData.isVirtual,
        ticketPrice: formData.ticketPrice ? parseFloat(formData.ticketPrice) : 0,
        registrationDeadline: formData.registrationDeadline
          ? new Date(`${formData.registrationDeadline}T23:59:00`).toISOString()
          : undefined,
        speakers: formData.speakers,
        agenda: formData.agenda
      }
      await api.post('/events', payload)
      alert("Event created successfully!")
      handleClose()
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      endTime: "",
      location: "",
      address: "",
      type: "",
      category: "",
      maxAttendees: "",
      isVirtual: false,
      ticketPrice: "",
      registrationDeadline: "",
      speakers: [],
      agenda: []
    })
    setNewSpeaker("")
    setNewAgendaItem({ time: "", activity: "" })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new event for the alumni community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your event"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Start Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isVirtual"
                  checked={formData.isVirtual}
                  onCheckedChange={(checked) => handleInputChange("isVirtual", checked)}
                />
                <Label htmlFor="isVirtual">Virtual Event</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Venue/Platform *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder={formData.isVirtual ? "Zoom, Teams, etc." : "Venue name"}
                  required
                />
              </div>

              {!formData.isVirtual && (
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Full address"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Capacity & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capacity & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    step="0.01"
                    value={formData.ticketPrice}
                    onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                    placeholder="0.00 for free"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Speakers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Speakers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSpeaker}
                  onChange={(e) => setNewSpeaker(e.target.value)}
                  placeholder="Speaker name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpeaker())}
                />
                <Button type="button" variant="outline" onClick={addSpeaker}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.speakers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.speakers.map((speaker, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {speaker}
                      <button
                        type="button"
                        onClick={() => removeSpeaker(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agenda */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="time"
                  value={newAgendaItem.time}
                  onChange={(e) => setNewAgendaItem(prev => ({ ...prev, time: e.target.value }))}
                  className="w-32"
                />
                <Input
                  value={newAgendaItem.activity}
                  onChange={(e) => setNewAgendaItem(prev => ({ ...prev, activity: e.target.value }))}
                  placeholder="Activity description"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAgendaItem())}
                />
                <Button type="button" variant="outline" onClick={addAgendaItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.agenda.length > 0 && (
                <div className="space-y-2">
                  {formData.agenda.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{item.time}</Badge>
                        <span>{item.activity}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAgendaItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}