import { useState } from "react"
import { Camera, Edit3, MapPin, Briefcase, GraduationCap, Mail, Phone, Globe, LinkedIn, Github, Save, X } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { useMobile } from "../ui/use-mobile"
import { toast } from "sonner@2.0.3"

interface ProfileScreenProps {
  onBack?: () => void
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, updateProfile } = useAuth()
  const { isMobile } = useMobile()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    company: user?.company || '',
    jobTitle: user?.jobTitle || '',
    location: user?.location || '',
    department: user?.department || '',
    graduationYear: user?.graduationYear?.toString() || '',
    skills: user?.skills || [],
    phone: '',
    website: '',
    linkedin: '',
    github: ''
  })

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleSave = () => {
    updateProfile({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      bio: editForm.bio,
      company: editForm.company,
      jobTitle: editForm.jobTitle,
      location: editForm.location,
      department: editForm.department,
      graduationYear: editForm.graduationYear ? parseInt(editForm.graduationYear) : undefined,
      skills: editForm.skills,
      isProfileComplete: true
    })
    setIsEditing(false)
    toast.success("Profile updated successfully!")
  }

  const handleCancel = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      company: user?.company || '',
      jobTitle: user?.jobTitle || '',
      location: user?.location || '',
      department: user?.department || '',
      graduationYear: user?.graduationYear?.toString() || '',
      skills: user?.skills || [],
      phone: '',
      website: '',
      linkedin: '',
      github: ''
    })
    setIsEditing(false)
  }

  const addSkill = (skill: string) => {
    if (skill && !editForm.skills.includes(skill)) {
      setEditForm({ ...editForm, skills: [...editForm.skills, skill] })
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setEditForm({ 
      ...editForm, 
      skills: editForm.skills.filter(skill => skill !== skillToRemove) 
    })
  }

  if (!user) return null

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="mobile-sticky bg-background/95 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">My Profile</h1>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => toast.info("Photo upload coming soon!")}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="First name"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="mobile-input text-center"
                  />
                  <Input
                    placeholder="Last name"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="mobile-input text-center"
                  />
                </div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mobile-input text-center"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
                <p className="text-lg text-muted-foreground">{user.jobTitle || 'No job title set'}</p>
                <p className="text-base text-muted-foreground">{user.company || 'No company set'}</p>
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="mobile-input"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Phone number"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="mobile-input"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="mobile-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Job title"
                      value={editForm.jobTitle}
                      onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                      className="mobile-input"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Company"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      className="mobile-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.jobTitle && (
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.jobTitle}</span>
                    </div>
                  )}
                  {user.company && (
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.company}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Department"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="mobile-input"
                    />
                  </div>
                  {user.role === 'alumni' && (
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Graduation year"
                        type="number"
                        value={editForm.graduationYear}
                        onChange={(e) => setEditForm({ ...editForm, graduationYear: e.target.value })}
                        className="mobile-input"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">University Name</span>
                  </div>
                  {user.department && (
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.department}</span>
                    </div>
                  )}
                  {user.graduationYear && (
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Class of {user.graduationYear}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* About */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="mobile-input min-h-24"
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {user.bio || 'No bio added yet.'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="mobile-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {editForm.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {editForm.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`text-xs ${isEditing ? 'pr-1' : ''}`}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm mb-3">No skills added yet.</p>
              )}
              
              {isEditing && (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a skill"
                    className="mobile-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addSkill(input.value)
                      input.value = ''
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Desktop version
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Desktop Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="h-32 w-32 mx-auto">
                    <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0"
                      onClick={() => toast.info("Photo upload coming soon!")}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="First name"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      />
                      <Input
                        placeholder="Last name"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
                    <p className="text-lg text-muted-foreground">{user.jobTitle || 'No job title set'}</p>
                    <p className="text-base text-muted-foreground">{user.company || 'No company set'}</p>
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Phone number"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="min-h-32"
                  rows={6}
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {user.bio || 'No bio added yet.'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                      placeholder="Job title"
                      value={editForm.jobTitle}
                      onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      placeholder="Company"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.jobTitle && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                      <p>{user.jobTitle}</p>
                    </div>
                  )}
                  {user.company && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Company</label>
                      <p>{user.company}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Input
                      placeholder="Department"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    />
                  </div>
                  {user.role === 'alumni' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Graduation Year</label>
                      <Input
                        placeholder="Graduation year"
                        type="number"
                        value={editForm.graduationYear}
                        onChange={(e) => setEditForm({ ...editForm, graduationYear: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">University</label>
                    <p>University Name</p>
                  </div>
                  {user.department && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <p>{user.department}</p>
                    </div>
                  )}
                  {user.graduationYear && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Graduation</label>
                      <p>Class of {user.graduationYear}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              {editForm.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {editForm.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={isEditing ? 'pr-1' : ''}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">No skills added yet.</p>
              )}
              
              {isEditing && (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a skill"
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addSkill(input.value)
                      input.value = ''
                    }}
                  >
                    Add Skill
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}