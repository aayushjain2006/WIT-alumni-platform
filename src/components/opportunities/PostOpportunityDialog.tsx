import { useState } from "react"
import { Plus, X, Building2, MapPin, Clock, DollarSign, Users, Calendar, Briefcase, GraduationCap, Eye, Upload, Image } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Switch } from "../ui/switch"
import { Separator } from "../ui/separator"
import { useAuth } from "../../contexts/AuthContext"
import { useNotifications } from "../../contexts/NotificationContext"

const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Remote", "Hybrid"]
const experienceLevels = ["Entry Level", "1-2 years", "3-5 years", "5+ years", "Senior Level", "Executive Level"]
const internshipDurations = ["Summer (10-12 weeks)", "Fall (12-16 weeks)", "Spring (12-16 weeks)", "Year-round", "Flexible"]
const projectTypes = ["Research Project", "Capstone Project", "Startup Project", "Open Source", "Consulting", "Pro Bono"]
const projectDurations = ["1-3 months", "3-6 months", "6-12 months", "1+ years", "Ongoing"]
const teamSizes = ["1-2 people", "3-5 people", "6-10 people", "10+ people", "Flexible"]

const skillSuggestions = [
  "JavaScript", "Python", "Java", "React", "Node.js", "AWS", "Docker", 
  "Kubernetes", "SQL", "MongoDB", "Git", "TypeScript", "Go", "Rust",
  "Product Management", "Data Science", "Machine Learning", "DevOps",
  "UI/UX Design", "Marketing", "Sales", "Finance", "Analytics",
  "Project Management", "Research", "Writing", "Graphic Design"
]

const benefitSuggestions = [
  "Health Insurance", "Dental & Vision", "401(k)", "Flexible Hours", 
  "Remote Work", "Professional Development", "Gym Membership", "Free Meals",
  "Stock Options", "Unlimited PTO", "Learning Stipend", "Conference Attendance"
]

interface PostOpportunityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialType?: "job" | "internship" | "project"
}

export function PostOpportunityDialog({ open, onOpenChange, initialType = "job" }: PostOpportunityDialogProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState(initialType)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Common form data
  const [commonForm, setCommonForm] = useState({
    contactEmail: user?.email || "",
    contactName: user?.name || "",
    applicationUrl: "",
    featured: false,
    urgent: false
  })

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: "",
    company: user?.company || "",
    location: "",
    type: "",
    experience: "",
    salary: { min: "", max: "", currency: "USD", negotiable: false },
    description: "",
    requirements: "",
    responsibilities: "",
    skills: [] as string[],
    benefits: [] as string[],
    remote: false,
    relocation: false,
    visa: false,
    equity: false
  })

  // Internship form state
  const [internshipForm, setInternshipForm] = useState({
    title: "",
    company: user?.company || "",
    location: "",
    duration: "",
    stipend: "",
    paid: true,
    description: "",
    requirements: "",
    learningGoals: "",
    skills: [] as string[],
    remote: false,
    deadline: "",
    startDate: "",
    housing: false,
    transportation: false,
    creditEligible: false
  })

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    organization: user?.company || "",
    type: "",
    duration: "",
    teamSize: "",
    compensation: "",
    compensationType: "paid" as "paid" | "unpaid" | "equity" | "academic-credit",
    description: "",
    goals: "",
    requirements: "",
    skills: [] as string[],
    remote: true,
    deadline: "",
    startDate: "",
    mentorship: false,
    publicProject: false
  })

  const [currentSkill, setCurrentSkill] = useState("")
  const [currentBenefit, setCurrentBenefit] = useState("")

  const handleAddSkill = (skill: string, form: string) => {
    if (skill && !getSkills(form).includes(skill)) {
      switch (form) {
        case "job":
          setJobForm(prev => ({ ...prev, skills: [...prev.skills, skill] }))
          break
        case "internship":
          setInternshipForm(prev => ({ ...prev, skills: [...prev.skills, skill] }))
          break
        case "project":
          setProjectForm(prev => ({ ...prev, skills: [...prev.skills, skill] }))
          break
      }
      setCurrentSkill("")
    }
  }

  const handleRemoveSkill = (skill: string, form: string) => {
    switch (form) {
      case "job":
        setJobForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
        break
      case "internship":
        setInternshipForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
        break
      case "project":
        setProjectForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
        break
    }
  }

  const handleAddBenefit = (benefit: string) => {
    if (benefit && !jobForm.benefits.includes(benefit)) {
      setJobForm(prev => ({ ...prev, benefits: [...prev.benefits, benefit] }))
      setCurrentBenefit("")
    }
  }

  const handleRemoveBenefit = (benefit: string) => {
    setJobForm(prev => ({ ...prev, benefits: prev.benefits.filter(b => b !== benefit) }))
  }

  const getSkills = (form: string) => {
    switch (form) {
      case "job": return jobForm.skills
      case "internship": return internshipForm.skills
      case "project": return projectForm.skills
      default: return []
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    let form: any
    let type: string
    switch (activeTab) {
      case "job":
        form = { ...jobForm, ...commonForm }
        type = "Job"
        break
      case "internship":
        form = { ...internshipForm, ...commonForm }
        type = "Internship"
        break
      case "project":
        form = { ...projectForm, ...commonForm }
        type = "Project"
        break
      default:
        return
    }

    // Add notification about new opportunity posted
    addNotification({
      type: "system",
      title: `${type} opportunity posted successfully`,
      description: `Your ${form.title} at ${form.company || form.organization} is now live and visible to students`,
      isRead: false,
      actionUrl: "/opportunities"
    })

    // Reset forms
    resetForms()
    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would make an API call to create the opportunity
    console.log(`Posted ${activeTab}:`, form)
  }

  const resetForms = () => {
    setJobForm({
      title: "",
      company: user?.company || "",
      location: "",
      type: "",
      experience: "",
      salary: { min: "", max: "", currency: "USD", negotiable: false },
      description: "",
      requirements: "",
      responsibilities: "",
      skills: [],
      benefits: [],
      remote: false,
      relocation: false,
      visa: false,
      equity: false
    })

    setInternshipForm({
      title: "",
      company: user?.company || "",
      location: "",
      duration: "",
      stipend: "",
      paid: true,
      description: "",
      requirements: "",
      learningGoals: "",
      skills: [],
      remote: false,
      deadline: "",
      startDate: "",
      housing: false,
      transportation: false,
      creditEligible: false
    })

    setProjectForm({
      title: "",
      organization: user?.company || "",
      type: "",
      duration: "",
      teamSize: "",
      compensation: "",
      compensationType: "paid",
      description: "",
      goals: "",
      requirements: "",
      skills: [],
      remote: true,
      deadline: "",
      startDate: "",
      mentorship: false,
      publicProject: false
    })

    setCommonForm({
      contactEmail: user?.email || "",
      contactName: user?.name || "",
      applicationUrl: "",
      featured: false,
      urgent: false
    })
  }

  const renderSkillsSection = (form: string) => (
    <div className="space-y-2">
      <Label>Required Skills</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {getSkills(form).map((skill) => (
          <Badge
            key={skill}
            variant="default"
            className="cursor-pointer"
            onClick={() => handleRemoveSkill(skill, form)}
          >
            {skill}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill..."
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddSkill(currentSkill, form)
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => handleAddSkill(currentSkill, form)}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {skillSuggestions
          .filter(skill => !getSkills(form).includes(skill))
          .slice(0, 8)
          .map((skill) => (
            <Button
              key={skill}
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => handleAddSkill(skill, form)}
            >
              + {skill}
            </Button>
          ))}
      </div>
    </div>
  )

  const renderJobForm = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input
                id="job-title"
                placeholder="e.g. Senior Software Engineer"
                value={jobForm.title}
                onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-company">Company *</Label>
              <Input
                id="job-company"
                placeholder="Company name"
                value={jobForm.company}
                onChange={(e) => setJobForm(prev => ({ ...prev, company: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-location">Location *</Label>
              <Input
                id="job-location"
                placeholder="e.g. San Francisco, CA"
                value={jobForm.location}
                onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Job Type *</Label>
              <Select value={jobForm.type} onValueChange={(value) => setJobForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select value={jobForm.experience} onValueChange={(value) => setJobForm(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select 
                value={jobForm.salary.currency} 
                onValueChange={(value) => setJobForm(prev => ({ 
                  ...prev, 
                  salary: { ...prev.salary, currency: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary-min">Min Salary (Annual)</Label>
              <Input
                id="salary-min"
                placeholder="e.g. 120000"
                value={jobForm.salary.min}
                onChange={(e) => setJobForm(prev => ({ ...prev, salary: { ...prev.salary, min: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary-max">Max Salary (Annual)</Label>
              <Input
                id="salary-max"
                placeholder="e.g. 150000"
                value={jobForm.salary.max}
                onChange={(e) => setJobForm(prev => ({ ...prev, salary: { ...prev.salary, max: e.target.value } }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="salary-negotiable"
              checked={jobForm.salary.negotiable}
              onCheckedChange={(checked) => setJobForm(prev => ({ 
                ...prev, 
                salary: { ...prev.salary, negotiable: !!checked }
              }))}
            />
            <Label htmlFor="salary-negotiable">Salary is negotiable</Label>
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Overview *</Label>
            <Textarea
              id="job-description"
              placeholder="Describe the role, company culture, and what makes this opportunity great..."
              rows={4}
              value={jobForm.description}
              onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-responsibilities">Key Responsibilities</Label>
            <Textarea
              id="job-responsibilities"
              placeholder="List the main responsibilities and day-to-day tasks..."
              rows={3}
              value={jobForm.responsibilities}
              onChange={(e) => setJobForm(prev => ({ ...prev, responsibilities: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-requirements">Requirements & Qualifications</Label>
            <Textarea
              id="job-requirements"
              placeholder="List the required qualifications, experience, and education..."
              rows={3}
              value={jobForm.requirements}
              onChange={(e) => setJobForm(prev => ({ ...prev, requirements: e.target.value }))}
            />
          </div>

          {renderSkillsSection("job")}
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Benefits & Perks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Benefits & Perks</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {jobForm.benefits.map((benefit) => (
                <Badge
                  key={benefit}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveBenefit(benefit)}
                >
                  {benefit}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a benefit..."
                value={currentBenefit}
                onChange={(e) => setCurrentBenefit(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddBenefit(currentBenefit)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddBenefit(currentBenefit)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {benefitSuggestions
                .filter(benefit => !jobForm.benefits.includes(benefit))
                .slice(0, 6)
                .map((benefit) => (
                  <Button
                    key={benefit}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => handleAddBenefit(benefit)}
                  >
                    + {benefit}
                  </Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="job-remote"
                  checked={jobForm.remote}
                  onCheckedChange={(checked) => setJobForm(prev => ({ ...prev, remote: !!checked }))}
                />
                <Label htmlFor="job-remote">Remote work available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="job-relocation"
                  checked={jobForm.relocation}
                  onCheckedChange={(checked) => setJobForm(prev => ({ ...prev, relocation: !!checked }))}
                />
                <Label htmlFor="job-relocation">Relocation assistance provided</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="job-visa"
                  checked={jobForm.visa}
                  onCheckedChange={(checked) => setJobForm(prev => ({ ...prev, visa: !!checked }))}
                />
                <Label htmlFor="job-visa">Visa sponsorship available</Label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="job-equity"
                  checked={jobForm.equity}
                  onCheckedChange={(checked) => setJobForm(prev => ({ ...prev, equity: !!checked }))}
                />
                <Label htmlFor="job-equity">Equity/Stock options included</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderInternshipForm = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Internship Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intern-title">Internship Title *</Label>
              <Input
                id="intern-title"
                placeholder="e.g. Software Engineering Intern"
                value={internshipForm.title}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intern-company">Company *</Label>
              <Input
                id="intern-company"
                placeholder="Company name"
                value={internshipForm.company}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, company: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intern-location">Location *</Label>
              <Input
                id="intern-location"
                placeholder="e.g. San Francisco, CA"
                value={internshipForm.location}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Duration *</Label>
              <Select value={internshipForm.duration} onValueChange={(value) => setInternshipForm(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {internshipDurations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intern-stipend">Monthly Stipend</Label>
              <Input
                id="intern-stipend"
                placeholder={internshipForm.paid ? "e.g. 5000" : "Unpaid"}
                value={internshipForm.stipend}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, stipend: e.target.value }))}
                disabled={!internshipForm.paid}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intern-start">Start Date</Label>
              <Input
                id="intern-start"
                type="date"
                value={internshipForm.startDate}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intern-deadline">Application Deadline</Label>
              <Input
                id="intern-deadline"
                type="date"
                value={internshipForm.deadline}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Internship Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intern-description">Internship Overview *</Label>
            <Textarea
              id="intern-description"
              placeholder="Describe the internship, projects, team, and learning opportunities..."
              rows={4}
              value={internshipForm.description}
              onChange={(e) => setInternshipForm(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intern-learning">Learning Goals</Label>
            <Textarea
              id="intern-learning"
              placeholder="What will the intern learn and achieve during this program?"
              rows={3}
              value={internshipForm.learningGoals}
              onChange={(e) => setInternshipForm(prev => ({ ...prev, learningGoals: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intern-requirements">Requirements & Qualifications</Label>
            <Textarea
              id="intern-requirements"
              placeholder="List the required qualifications and preferred skills..."
              rows={3}
              value={internshipForm.requirements}
              onChange={(e) => setInternshipForm(prev => ({ ...prev, requirements: e.target.value }))}
            />
          </div>

          {renderSkillsSection("internship")}
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="intern-paid"
                  checked={internshipForm.paid}
                  onCheckedChange={(checked) => {
                    setInternshipForm(prev => ({ 
                      ...prev, 
                      paid: !!checked, 
                      stipend: checked ? prev.stipend : "" 
                    }))
                  }}
                />
                <Label htmlFor="intern-paid">This is a paid internship</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="intern-remote"
                  checked={internshipForm.remote}
                  onCheckedChange={(checked) => setInternshipForm(prev => ({ ...prev, remote: !!checked }))}
                />
                <Label htmlFor="intern-remote">Remote work available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="intern-housing"
                  checked={internshipForm.housing}
                  onCheckedChange={(checked) => setInternshipForm(prev => ({ ...prev, housing: !!checked }))}
                />
                <Label htmlFor="intern-housing">Housing assistance provided</Label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="intern-transport"
                  checked={internshipForm.transportation}
                  onCheckedChange={(checked) => setInternshipForm(prev => ({ ...prev, transportation: !!checked }))}
                />
                <Label htmlFor="intern-transport">Transportation assistance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="intern-credit"
                  checked={internshipForm.creditEligible}
                  onCheckedChange={(checked) => setInternshipForm(prev => ({ ...prev, creditEligible: !!checked }))}
                />
                <Label htmlFor="intern-credit">Eligible for academic credit</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProjectForm = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-title">Project Title *</Label>
              <Input
                id="project-title"
                placeholder="e.g. AI-Powered Healthcare Analytics Platform"
                value={projectForm.title}
                onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-org">Organization *</Label>
              <Input
                id="project-org"
                placeholder="Company, startup, or organization name"
                value={projectForm.organization}
                onChange={(e) => setProjectForm(prev => ({ ...prev, organization: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Project Type *</Label>
              <Select value={projectForm.type} onValueChange={(value) => setProjectForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={projectForm.duration} onValueChange={(value) => setProjectForm(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {projectDurations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Team Size</Label>
              <Select value={projectForm.teamSize} onValueChange={(value) => setProjectForm(prev => ({ ...prev, teamSize: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {teamSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Compensation Type</Label>
              <Select 
                value={projectForm.compensationType} 
                onValueChange={(value: "paid" | "unpaid" | "equity" | "academic-credit") => 
                  setProjectForm(prev => ({ ...prev, compensationType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid/Volunteer</SelectItem>
                  <SelectItem value="equity">Equity/Shares</SelectItem>
                  <SelectItem value="academic-credit">Academic Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-compensation">Compensation Details</Label>
              <Input
                id="project-compensation"
                placeholder={
                  projectForm.compensationType === "paid" ? "e.g. $25/hour" :
                  projectForm.compensationType === "equity" ? "e.g. 0.5% equity" :
                  projectForm.compensationType === "academic-credit" ? "e.g. 3 credits" :
                  "Learning opportunity"
                }
                value={projectForm.compensation}
                onChange={(e) => setProjectForm(prev => ({ ...prev, compensation: e.target.value }))}
                disabled={projectForm.compensationType === "unpaid"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-start">Start Date</Label>
              <Input
                id="project-start"
                type="date"
                value={projectForm.startDate}
                onChange={(e) => setProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-deadline">Application Deadline</Label>
            <Input
              id="project-deadline"
              type="date"
              value={projectForm.deadline}
              onChange={(e) => setProjectForm(prev => ({ ...prev, deadline: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-description">Project Overview *</Label>
            <Textarea
              id="project-description"
              placeholder="Describe the project, its purpose, technology stack, and what makes it exciting..."
              rows={4}
              value={projectForm.description}
              onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-goals">Goals & Objectives</Label>
            <Textarea
              id="project-goals"
              placeholder="What are the main goals and expected outcomes of this project?"
              rows={3}
              value={projectForm.goals}
              onChange={(e) => setProjectForm(prev => ({ ...prev, goals: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-requirements">Requirements & Qualifications</Label>
            <Textarea
              id="project-requirements"
              placeholder="List the required skills, experience, and qualifications..."
              rows={3}
              value={projectForm.requirements}
              onChange={(e) => setProjectForm(prev => ({ ...prev, requirements: e.target.value }))}
            />
          </div>

          {renderSkillsSection("project")}
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="project-remote"
                  checked={projectForm.remote}
                  onCheckedChange={(checked) => setProjectForm(prev => ({ ...prev, remote: !!checked }))}
                />
                <Label htmlFor="project-remote">Remote collaboration allowed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="project-mentorship"
                  checked={projectForm.mentorship}
                  onCheckedChange={(checked) => setProjectForm(prev => ({ ...prev, mentorship: !!checked }))}
                />
                <Label htmlFor="project-mentorship">Mentorship provided</Label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="project-public"
                  checked={projectForm.publicProject}
                  onCheckedChange={(checked) => setProjectForm(prev => ({ ...prev, publicProject: !!checked }))}
                />
                <Label htmlFor="project-public">Open source/public project</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContactSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contact & Application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Contact Person</Label>
            <Input
              id="contact-name"
              placeholder="Your name"
              value={commonForm.contactName}
              onChange={(e) => setCommonForm(prev => ({ ...prev, contactName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email *</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="your.email@company.com"
              value={commonForm.contactEmail}
              onChange={(e) => setCommonForm(prev => ({ ...prev, contactEmail: e.target.value }))}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="application-url">Application URL</Label>
          <Input
            id="application-url"
            placeholder="https://company.com/careers/apply"
            value={commonForm.applicationUrl}
            onChange={(e) => setCommonForm(prev => ({ ...prev, applicationUrl: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground">
            Optional: Direct link to application form or job posting
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={commonForm.featured}
              onCheckedChange={(checked) => setCommonForm(prev => ({ ...prev, featured: !!checked }))}
            />
            <Label htmlFor="featured">Feature this opportunity (recommended for better visibility)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={commonForm.urgent}
              onCheckedChange={(checked) => setCommonForm(prev => ({ ...prev, urgent: !!checked }))}
            />
            <Label htmlFor="urgent">Urgent hiring</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Post New Opportunity
          </DialogTitle>
          <DialogDescription>
            Share job opportunities, internships, and projects with our student community
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="job" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Job Position
            </TabsTrigger>
            <TabsTrigger value="internship" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Internship
            </TabsTrigger>
            <TabsTrigger value="project" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Project
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="job" className="space-y-6">
              {renderJobForm()}
              {renderContactSection()}
            </TabsContent>

            <TabsContent value="internship" className="space-y-6">
              {renderInternshipForm()}
              {renderContactSection()}
            </TabsContent>

            <TabsContent value="project" className="space-y-6">
              {renderProjectForm()}
              {renderContactSection()}
            </TabsContent>

            <div className="flex justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Post {activeTab === "job" ? "Job" : activeTab === "internship" ? "Internship" : "Project"}
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