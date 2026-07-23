import { useState } from "react"
import { UserPlus, Save, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Card, CardContent } from "../ui/card"
import { useNotifications } from "../../contexts/NotificationContext"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    graduationYear: "",
    major: "",
    company: "",
    position: "",
    location: "",
    phone: "",
    linkedIn: "",
    bio: "",
    sendWelcomeEmail: true,
    requirePasswordReset: true,
    skipEmailVerification: false
  })

  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear + 5 - i)
  
  const majors = [
    "Computer Science",
    "Engineering", 
    "Business Administration",
    "Data Science",
    "Marketing",
    "Finance",
    "Psychology",
    "Biology",
    "Chemistry",
    "Physics",
    "Mathematics",
    "English",
    "History",
    "Political Science",
    "Economics",
    "Other"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Add notification
    addNotification({
      type: "system",
      title: "User created successfully",
      description: `${formData.firstName} ${formData.lastName} has been added to the platform`,
      isRead: false,
      actionUrl: "/admin/users"
    })

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      graduationYear: "",
      major: "",
      company: "",
      position: "",
      location: "",
      phone: "",
      linkedIn: "",
      bio: "",
      sendWelcomeEmail: true,
      requirePasswordReset: true,
      skipEmailVerification: false
    })

    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would make an API call to create the user
    console.log("User created:", formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Add a new user to the alumni platform
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium">Basic Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium">Academic Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year *</Label>
                  <Select value={formData.graduationYear} onValueChange={(value) => setFormData(prev => ({ ...prev, graduationYear: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Major/Field of Study *</Label>
                  <Select value={formData.major} onValueChange={(value) => setFormData(prev => ({ ...prev, major: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select major" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.map((major) => (
                        <SelectItem key={major} value={major}>
                          {major}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          {(formData.role === "alumni" || formData.role === "admin") && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">Professional Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Title</Label>
                    <Input
                      id="position"
                      placeholder="Job title"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                    <Input
                      id="linkedIn"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bio */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium">Additional Information</h4>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief biography or introduction..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Options */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium">Account Options</h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendWelcomeEmail"
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendWelcomeEmail: !!checked }))}
                  />
                  <Label htmlFor="sendWelcomeEmail">Send welcome email with login instructions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requirePasswordReset"
                    checked={formData.requirePasswordReset}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requirePasswordReset: !!checked }))}
                  />
                  <Label htmlFor="requirePasswordReset">Require password reset on first login</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skipEmailVerification"
                    checked={formData.skipEmailVerification}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, skipEmailVerification: !!checked }))}
                  />
                  <Label htmlFor="skipEmailVerification">Skip email verification (mark as verified)</Label>
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
              {isSubmitting ? "Creating..." : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}