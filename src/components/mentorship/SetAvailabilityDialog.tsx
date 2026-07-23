import { useState } from "react"
import { Clock, Save, Plus, X } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import { useNotifications } from "../../contexts/NotificationContext"

const timezones = [
  "PST", "MST", "CST", "EST", "GMT", "CET", "JST", "AEST"
]

const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", 
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"
]

interface SetAvailabilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAvailability?: any
}

export function SetAvailabilityDialog({ 
  open, 
  onOpenChange, 
  currentAvailability 
}: SetAvailabilityDialogProps) {
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    timezone: currentAvailability?.timezone || "PST",
    weeklyHours: currentAvailability?.weeklyHours || 4,
    maxMentees: currentAvailability?.maxMentees || 6,
    autoAcceptRequests: false,
    availableSlots: [] as any[],
    unavailableDates: [] as string[],
    bufferTime: 15,
    advanceBooking: 7
  })

  const [newSlot, setNewSlot] = useState({
    day: "",
    startTime: "",
    endTime: ""
  })

  const [newUnavailableDate, setNewUnavailableDate] = useState("")

  const handleAddSlot = () => {
    if (newSlot.day && newSlot.startTime && newSlot.endTime) {
      setFormData(prev => ({
        ...prev,
        availableSlots: [...prev.availableSlots, { ...newSlot, id: Date.now() }]
      }))
      setNewSlot({ day: "", startTime: "", endTime: "" })
    }
  }

  const handleRemoveSlot = (id: number) => {
    setFormData(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.filter(slot => slot.id !== id)
    }))
  }

  const handleAddUnavailableDate = () => {
    if (newUnavailableDate && !formData.unavailableDates.includes(newUnavailableDate)) {
      setFormData(prev => ({
        ...prev,
        unavailableDates: [...prev.unavailableDates, newUnavailableDate]
      }))
      setNewUnavailableDate("")
    }
  }

  const handleRemoveUnavailableDate = (date: string) => {
    setFormData(prev => ({
      ...prev,
      unavailableDates: prev.unavailableDates.filter(d => d !== date)
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
      title: "Availability updated successfully",
      description: "Your mentorship availability has been updated and is now visible to students",
      isRead: false,
      actionUrl: "/mentorship"
    })

    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would make an API call to update availability
    console.log("Availability updated:", formData)
  }

  const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Set Mentorship Availability
          </DialogTitle>
          <DialogDescription>
            Configure your availability for mentorship sessions and manage your schedule
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Basic Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyHours">Weekly Hours Commitment</Label>
                  <Select 
                    value={formData.weeklyHours.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, weeklyHours: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 hours/week</SelectItem>
                      <SelectItem value="4">4 hours/week</SelectItem>
                      <SelectItem value="6">6 hours/week</SelectItem>
                      <SelectItem value="8">8 hours/week</SelectItem>
                      <SelectItem value="10">10+ hours/week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxMentees">Maximum Mentees</Label>
                  <Select 
                    value={formData.maxMentees.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, maxMentees: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 mentees</SelectItem>
                      <SelectItem value="5">5 mentees</SelectItem>
                      <SelectItem value="6">6 mentees</SelectItem>
                      <SelectItem value="8">8 mentees</SelectItem>
                      <SelectItem value="10">10+ mentees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
                  <Select 
                    value={formData.bufferTime.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, bufferTime: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No buffer</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advanceBooking">Advance Booking Period</Label>
                <Select 
                  value={formData.advanceBooking.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, advanceBooking: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day ahead</SelectItem>
                    <SelectItem value="3">3 days ahead</SelectItem>
                    <SelectItem value="7">1 week ahead</SelectItem>
                    <SelectItem value="14">2 weeks ahead</SelectItem>
                    <SelectItem value="30">1 month ahead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoAccept"
                  checked={formData.autoAcceptRequests}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoAcceptRequests: !!checked }))}
                />
                <Label htmlFor="autoAccept">Auto-accept mentorship requests</Label>
              </div>
            </CardContent>
          </Card>

          {/* Available Time Slots */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Weekly Availability</h3>
              
              {/* Current Slots */}
              {formData.availableSlots.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Available Slots</Label>
                  <div className="space-y-2">
                    {formData.availableSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">
                          {slot.day}: {slot.startTime} - {slot.endTime}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSlot(slot.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Slot */}
              <div className="space-y-3">
                <Label>Add Time Slot</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Select value={newSlot.day} onValueChange={(value) => setNewSlot(prev => ({ ...prev, day: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekdays.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={newSlot.startTime} onValueChange={(value) => setNewSlot(prev => ({ ...prev, startTime: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={newSlot.endTime} onValueChange={(value) => setNewSlot(prev => ({ ...prev, endTime: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button type="button" onClick={handleAddSlot} disabled={!newSlot.day || !newSlot.startTime || !newSlot.endTime}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unavailable Dates */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Unavailable Dates</h3>
              
              {/* Current Unavailable Dates */}
              {formData.unavailableDates.length > 0 && (
                <div className="space-y-2">
                  <Label>Blocked Dates</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.unavailableDates.map((date) => (
                      <Badge key={date} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveUnavailableDate(date)}>
                        {formatDateDisplay(date)}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Unavailable Date */}
              <div className="space-y-2">
                <Label>Block Date</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={newUnavailableDate}
                    onChange={(e) => setNewUnavailableDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Button type="button" onClick={handleAddUnavailableDate} disabled={!newUnavailableDate}>
                    <Plus className="h-4 w-4" />
                  </Button>
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
              {isSubmitting ? "Saving..." : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Availability
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}