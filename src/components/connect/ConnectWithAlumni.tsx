import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useMobile } from '../ui/use-mobile'
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  MessageSquare,
  UserPlus,
  Calendar,
  Building,
  ChevronRight,
  Video,
  Mail,
  Coffee,
  Star,
  Users,
  TrendingUp,
  Award,
  Globe
} from 'lucide-react'

interface AlumniProfile {
  id: string
  name: string
  title: string
  company: string
  location: string
  graduationYear: number
  major: string
  profileImage?: string
  industry: string
  experience: number
  skills: string[]
  mentoring: boolean
  available: boolean
  responseRate: number
  bio: string
  connections: number
  featured?: boolean
}

const mockAlumni: AlumniProfile[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    graduationYear: 2018,
    major: 'Computer Science',
    industry: 'Technology',
    experience: 6,
    skills: ['React', 'Python', 'Machine Learning'],
    mentoring: true,
    available: true,
    responseRate: 95,
    bio: 'Passionate about building scalable web applications and mentoring new graduates.',
    connections: 1250,
    featured: true
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'Marketing Director',
    company: 'Nike',
    location: 'Portland, OR',
    graduationYear: 2015,
    major: 'Business Administration',
    industry: 'Consumer Goods',
    experience: 9,
    skills: ['Digital Marketing', 'Brand Strategy', 'Analytics'],
    mentoring: true,
    available: false,
    responseRate: 88,
    bio: 'Leading global marketing campaigns for iconic sports brands.',
    connections: 890
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    title: 'Investment Banking VP',
    company: 'Morgan Stanley',
    location: 'New York, NY',
    graduationYear: 2012,
    major: 'Economics',
    industry: 'Finance',
    experience: 12,
    skills: ['Financial Modeling', 'M&A', 'Leadership'],
    mentoring: true,
    available: true,
    responseRate: 92,
    bio: 'Specializing in tech sector M&A with over $2B in completed transactions.',
    connections: 2100,
    featured: true
  },
  {
    id: '4',
    name: 'James Park',
    title: 'UX Design Lead',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    graduationYear: 2017,
    major: 'Graphic Design',
    industry: 'Technology',
    experience: 7,
    skills: ['User Research', 'Prototyping', 'Design Systems'],
    mentoring: false,
    available: true,
    responseRate: 78,
    bio: 'Creating intuitive experiences that connect people around the world.',
    connections: 650
  }
]

const industries = [
  { id: 'all', label: 'All Industries', icon: Globe },
  { id: 'technology', label: 'Technology', icon: GraduationCap },
  { id: 'finance', label: 'Finance', icon: TrendingUp },
  { id: 'consulting', label: 'Consulting', icon: Award },
  { id: 'healthcare', label: 'Healthcare', icon: Users },
  { id: 'consumer-goods', label: 'Consumer', icon: Star }
]

const connectionPurposes = [
  { id: 'mentoring', label: 'Mentoring', icon: Award },
  { id: 'career-advice', label: 'Career Advice', icon: Briefcase },
  { id: 'networking', label: 'Networking', icon: Users },
  { id: 'industry-insights', label: 'Industry Insights', icon: TrendingUp }
]

interface ConnectWithAlumniProps {
  onBack?: () => void
}

export function ConnectWithAlumni({ onBack }: ConnectWithAlumniProps) {
  const { isMobile } = useMobile()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [showMentorsOnly, setShowMentorsOnly] = useState(false)

  const filteredAlumni = mockAlumni.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || alumni.industry.toLowerCase().replace(' ', '-') === selectedIndustry
    const matchesMentor = !showMentorsOnly || alumni.mentoring
    
    return matchesSearch && matchesIndustry && matchesMentor
  })

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
            <h1 className="text-xl font-semibold">Connect</h1>
            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alumni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 mobile-input"
            />
          </div>
        </div>

        {/* Mobile Industries */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {industries.map((industry) => {
            const Icon = industry.icon
            const isSelected = selectedIndustry === industry.id
            return (
              <Button
                key={industry.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className={`flex-shrink-0 h-10 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setSelectedIndustry(industry.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {industry.label}
              </Button>
            )
          })}
        </div>

        {/* Mobile Connection Purposes */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {connectionPurposes.map((purpose) => {
            const Icon = purpose.icon
            const isSelected = selectedPurpose === purpose.id
            return (
              <Button
                key={purpose.id}
                variant={isSelected ? 'secondary' : 'ghost'}
                size="sm"
                className="flex-shrink-0 h-8 text-sm"
                onClick={() => setSelectedPurpose(isSelected ? '' : purpose.id)}
              >
                <Icon className="h-3 w-3 mr-2" />
                {purpose.label}
              </Button>
            )
          })}
        </div>

        {/* Mobile Mentor Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredAlumni.length} alumni found
          </span>
          <Button
            variant={showMentorsOnly ? 'default' : 'ghost'}
            size="sm"
            className="text-sm"
            onClick={() => setShowMentorsOnly(!showMentorsOnly)}
          >
            <Award className="h-4 w-4 mr-2" />
            Mentors Only
          </Button>
        </div>

        {/* Mobile Alumni Cards */}
        <div className="space-y-3">
          {filteredAlumni.map((alumni) => (
            <Card key={alumni.id} className="mobile-card border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={alumni.profileImage} alt={alumni.name} />
                    <AvatarFallback className="text-sm font-medium">
                      {alumni.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-base truncate">{alumni.name}</h3>
                      {alumni.featured && (
                        <Badge className="bg-primary text-primary-foreground text-xs flex-shrink-0">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{alumni.title}</p>
                    <p className="text-sm font-medium text-foreground">{alumni.company}</p>
                  </div>
                  <div className="flex flex-col items-end text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {alumni.responseRate}%
                    </div>
                    {alumni.available && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Available
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{alumni.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{alumni.major} • Class of {alumni.graduationYear}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{alumni.connections.toLocaleString()} connections</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {alumni.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {alumni.mentoring && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Mentor
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {alumni.bio}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                  {alumni.mentoring && (
                    <Button variant="outline" size="sm" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Mentor
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Load More */}
        <div className="text-center py-4">
          <Button variant="outline" className="mobile-button">
            Load More Alumni
          </Button>
        </div>
      </div>
    )
  }

  // Desktop version
  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Connect with Alumni</h1>
          <p className="text-muted-foreground">
            Build meaningful connections with our global alumni network
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
            placeholder="Search alumni by name, company, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showMentorsOnly ? 'default' : 'outline'}
          onClick={() => setShowMentorsOnly(!showMentorsOnly)}
        >
          <Award className="h-4 w-4 mr-2" />
          Mentors Only
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Desktop Industries */}
      <div className="flex space-x-2 flex-wrap">
        {industries.map((industry) => {
          const Icon = industry.icon
          const isSelected = selectedIndustry === industry.id
          return (
            <Button
              key={industry.id}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedIndustry(industry.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {industry.label}
            </Button>
          )
        })}
      </div>

      {/* Desktop Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAlumni.map((alumni) => (
          <Card key={alumni.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={alumni.profileImage} alt={alumni.name} />
                  <AvatarFallback>
                    {alumni.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <CardTitle className="text-lg">{alumni.name}</CardTitle>
                    {alumni.featured && (
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    )}
                  </div>
                  <CardDescription>{alumni.title}</CardDescription>
                  <p className="text-sm font-medium mt-1">{alumni.company}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {alumni.responseRate}%
                  </div>
                  {alumni.available && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Available
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {alumni.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {alumni.major} • Class of {alumni.graduationYear}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {alumni.connections.toLocaleString()} connections
                </div>

                <div className="flex flex-wrap gap-2">
                  {alumni.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {alumni.mentoring && (
                    <Badge className="bg-green-100 text-green-800">
                      Mentor Available
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {alumni.bio}
                </p>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  {alumni.mentoring && (
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}