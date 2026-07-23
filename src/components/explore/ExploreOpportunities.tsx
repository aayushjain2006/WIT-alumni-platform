import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { useMobile } from '../ui/use-mobile'
import { toast } from 'sonner@2.0.3'
import { JobInquiryDialog } from '../messages/JobInquiryDialog'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  Award, 
  TrendingUp,
  Calendar,
  Building,
  ArrowRight,
  Bookmark,
  Star,
  ChevronRight,
  MessageSquare
} from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'internship' | 'contract'
  category: 'software' | 'marketing' | 'finance' | 'design' | 'consulting'
  salary?: string
  posted: string
  deadline?: string
  featured?: boolean
  remote?: boolean
  requirements: string[]
  description: string
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'full-time',
    category: 'software',
    salary: '₹120Lpa - ₹180Lpa',
    posted: '2 days ago',
    deadline: 'Dec 15',
    featured: true,
    remote: true,
    requirements: ['React', 'TypeScript', 'Node.js'],
    description: 'Join our engineering team building next-generation web applications...'
  },
  {
    id: '2',
    title: 'Marketing Intern',
    company: 'StartupX',
    location: 'New York, NY',
    type: 'internship',
    category: 'marketing',
    salary: '₹20/hour',
    posted: '1 day ago',
    deadline: 'Dec 20',
    remote: false,
    requirements: ['Social Media', 'Analytics', 'Content Creation'],
    description: 'Learn digital marketing while working with innovative brands...'
  },
  {
    id: '3',
    title: 'Financial Analyst',
    company: 'Goldman Sachs',
    location: 'Boston, MA',
    type: 'full-time',
    category: 'finance',
    salary: '₹90Lpa - ₹130Lpa',
    posted: '3 days ago',
    deadline: 'Jan 5',
    featured: true,
    remote: false,
    requirements: ['Excel', 'Financial Modeling', 'CFA preferred'],
    description: 'Analyze financial data and support investment decisions...'
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Seattle, WA',
    type: 'contract',
    category: 'design',
    salary: '₹65/hour',
    posted: '5 days ago',
    remote: true,
    requirements: ['Figma', 'User Research', 'Prototyping'],
    description: 'Design user experiences for mobile and web applications...'
  }
]

const categories = [
  { id: 'all', label: 'All', icon: Briefcase },
  { id: 'software', label: 'Tech', icon: GraduationCap },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  { id: 'finance', label: 'Finance', icon: Building },
  { id: 'design', label: 'Design', icon: Star },
  { id: 'consulting', label: 'Consulting', icon: Award }
]

const opportunityTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'full-time', label: 'Full Time' },
  { id: 'part-time', label: 'Part Time' },
  { id: 'internship', label: 'Internship' },
  { id: 'contract', label: 'Contract' }
]

interface ExploreOpportunitiesProps {
  onBack?: () => void
  onNavigate?: (screen: string) => void
}

export function ExploreOpportunities({ onBack, onNavigate }: ExploreOpportunitiesProps) {
  const { isMobile } = useMobile()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [showJobInquiry, setShowJobInquiry] = useState(false)
  const [selectedJobForInquiry, setSelectedJobForInquiry] = useState<Opportunity | null>(null)

  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || opportunity.category === selectedCategory
    const matchesType = selectedType === 'all' || opportunity.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const toggleSaved = (jobId: string) => {
    const newSaved = new Set(savedJobs)
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId)
    } else {
      newSaved.add(jobId)
    }
    setSavedJobs(newSaved)
  }

  const handleContact = (opportunity: Opportunity) => {
    // Open the job inquiry dialog instead of directly navigating
    setSelectedJobForInquiry(opportunity)
    setShowJobInquiry(true)
  }

  const handleConversationStart = (conversationId: string) => {
    // Show success message
    toast.success(`Message sent! Conversation started about ${selectedJobForInquiry?.title}`)
    
    // Navigate to messages and select the new conversation
    onNavigate?.('messages')
    
    // Close dialog and reset state
    setShowJobInquiry(false)
    setSelectedJobForInquiry(null)
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Header */}
        <div className="mobile-sticky bg-background/95 backdrop-blur-sm p-4 -mx-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </Button>
            )}
            <h1 className="text-xl font-semibold">Opportunities</h1>
            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 mobile-input"
            />
          </div>
        </div>

        {/* Mobile Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id
            return (
              <Button
                key={category.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className={`flex-shrink-0 h-10 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            )
          })}
        </div>

        {/* Mobile Opportunity Types */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {opportunityTypes.map((type) => {
            const isSelected = selectedType === type.id
            return (
              <Button
                key={type.id}
                variant={isSelected ? 'secondary' : 'ghost'}
                size="sm"
                className="flex-shrink-0 h-8 text-sm"
                onClick={() => setSelectedType(type.id)}
              >
                {type.label}
              </Button>
            )
          })}
        </div>

        {/* Mobile Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredOpportunities.length} opportunities found</span>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Updated 2h ago</span>
          </div>
        </div>

        {/* Mobile Opportunity Cards */}
        <div className="space-y-3">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="mobile-card border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {opportunity.featured && (
                        <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>
                      )}
                      {opportunity.remote && (
                        <Badge variant="secondary" className="text-xs">Remote</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-1">{opportunity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{opportunity.company}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={() => toggleSaved(opportunity.id)}
                  >
                    <Bookmark 
                      className={`h-4 w-4 ${
                        savedJobs.has(opportunity.id) 
                          ? 'fill-primary text-primary' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {opportunity.location}
                  </div>
                  {opportunity.salary && (
                    <div className="flex items-center text-sm text-foreground font-medium">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3h12l-1 18H7L6 3z"/>
                        <path d="M9 7h6"/>
                        <path d="M9 11h4"/>
                      </svg>
                      {opportunity.salary}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Posted {opportunity.posted}
                    {opportunity.deadline && ` • Deadline ${opportunity.deadline}`}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {opportunity.requirements.slice(0, 3).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                  {opportunity.requirements.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{opportunity.requirements.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="mobile-button flex-1"
                    onClick={() => handleContact(opportunity)}
                    variant="outline"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button className="mobile-button flex-1">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Load More */}
        <div className="text-center py-4">
          <Button variant="outline" className="mobile-button">
            Load More Opportunities
          </Button>
        </div>

        {/* Job Inquiry Dialog */}
        {selectedJobForInquiry && (
          <JobInquiryDialog
            isOpen={showJobInquiry}
            onClose={() => {
              setShowJobInquiry(false)
              setSelectedJobForInquiry(null)
            }}
            jobInquiry={{
              jobId: selectedJobForInquiry.id,
              jobTitle: selectedJobForInquiry.title,
              company: selectedJobForInquiry.company
            }}
            onConversationStart={handleConversationStart}
          />
        )}
      </div>
    )
  }

  // Desktop version
  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Explore Opportunities</h1>
          <p className="text-muted-foreground">
            Discover career opportunities shared by our alumni network
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Desktop Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Desktop Categories */}
      <div className="flex space-x-2">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id
          return (
            <Button
              key={category.id}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.label}
            </Button>
          )
        })}
      </div>

      {/* Desktop Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {opportunity.featured && (
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    )}
                    {opportunity.remote && (
                      <Badge variant="secondary">Remote</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription>{opportunity.company}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSaved(opportunity.id)}
                >
                  <Bookmark 
                    className={`h-4 w-4 ${
                      savedJobs.has(opportunity.id) 
                        ? 'fill-primary text-primary' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {opportunity.location}
                </div>
                {opportunity.salary && (
                  <div className="flex items-center text-sm font-medium">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12l-1 18H7L6 3z"/>
                      <path d="M9 7h6"/>
                      <path d="M9 11h4"/>
                    </svg>
                    {opportunity.salary}
                  </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Posted {opportunity.posted}
                </div>

                <div className="flex flex-wrap gap-2">
                  {opportunity.requirements.slice(0, 3).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {opportunity.description}
                </p>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContact(opportunity)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button className="flex-1">Apply Now</Button>
                  <Button variant="outline">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job Inquiry Dialog */}
      {selectedJobForInquiry && (
        <JobInquiryDialog
          isOpen={showJobInquiry}
          onClose={() => {
            setShowJobInquiry(false)
            setSelectedJobForInquiry(null)
          }}
          jobInquiry={{
            jobId: selectedJobForInquiry.id,
            jobTitle: selectedJobForInquiry.title,
            company: selectedJobForInquiry.company
          }}
          onConversationStart={handleConversationStart}
        />
      )}
    </div>
  )
}