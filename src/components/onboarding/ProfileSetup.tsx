import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { useAuth } from '../../contexts/AuthContext'
import { Camera, X, Plus } from 'lucide-react'

const departments = [
  'Computer Science', 'Business Administration', 'Engineering', 'Medicine', 
  'Law', 'Arts', 'Education', 'Psychology', 'Marketing', 'Finance'
]

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Consulting', 'Government', 'Non-profit', 'Media'
]

export function ProfileSetup() {
  const { user, updateProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    profileImage: user?.profileImage || '',
    graduationYear: user?.graduationYear || new Date().getFullYear(),
    department: user?.department || '',
    company: user?.company || '',
    jobTitle: user?.jobTitle || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    linkedIn: '',
    website: ''
  })
  
  const [newSkill, setNewSkill] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Complete profile setup
      updateProfile({
        ...formData,
        isProfileComplete: true
      })
    }
  }

  const handleSkip = () => {
    updateProfile({ isProfileComplete: true })
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Upload a profile picture</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="graduationYear">Graduation Year</Label>
          <Select 
            value={formData.graduationYear.toString()} 
            onValueChange={(value) => handleInputChange('graduationYear', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, Country"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      {user?.role === 'alumni' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="company">Current Company</Label>
            <Input
              id="company"
              placeholder="Company name"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="Your current role"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself, your interests, and what you're looking for..."
          className="min-h-[120px]"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Skills & Interests</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" variant="outline" onClick={addSkill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {skill}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeSkill(skill)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="linkedIn">LinkedIn Profile</Label>
        <Input
          id="linkedIn"
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedIn}
          onChange={(e) => handleInputChange('linkedIn', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Personal Website</Label>
        <Input
          id="website"
          placeholder="https://yourwebsite.com"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Privacy Settings</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Your profile will be visible to other verified alumni and students</p>
          <p>• Contact information is only shared when you connect with someone</p>
          <p>• You can update your privacy preferences anytime in settings</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Help other alumni find and connect with you
          </CardDescription>
          <div className="flex items-center space-x-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Step {step} of 3</p>
        </CardHeader>

        <CardContent>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
            <div className="space-x-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button onClick={handleNext}>
                {step === 3 ? 'Complete Profile' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}