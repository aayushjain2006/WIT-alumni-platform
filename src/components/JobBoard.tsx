import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Building, MapPin, Clock, DollarSign, Bookmark } from "lucide-react"

export function JobBoard() {
  const featuredJobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150k - $180k",
      posted: "2 days ago",
      description: "Join our innovative team building next-generation software solutions...",
      skills: ["React", "TypeScript", "AWS"],
      logo: "",
      featured: true
    },
    {
      title: "Product Marketing Manager",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $140k",
      posted: "1 week ago",
      description: "Lead product marketing initiatives for our growing SaaS platform...",
      skills: ["Marketing", "Analytics", "Growth"],
      logo: "",
      featured: false
    },
    {
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130k - $160k",
      posted: "3 days ago",
      description: "Apply machine learning to solve complex business problems...",
      skills: ["Python", "ML", "SQL"],
      logo: "",
      featured: false
    },
    {
      title: "UX Designer",
      company: "Design Studio",
      location: "Austin, TX",
      type: "Contract",
      salary: "$80k - $100k",
      posted: "5 days ago",
      description: "Create beautiful and intuitive user experiences...",
      skills: ["Figma", "Design Systems", "Research"],
      logo: "",
      featured: false
    }
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Career Opportunities
            </h2>
            <p className="text-lg text-muted-foreground">
              Exclusive job postings from our alumni network
            </p>
          </div>
          <Button size="lg">
            Browse All Jobs
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {featuredJobs.map((job, index) => (
            <Card key={index} className={`group hover:shadow-lg transition-all duration-300 ${job.featured ? 'ring-2 ring-primary/20' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={job.logo} alt={job.company} />
                      <AvatarFallback>
                        <Building className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
                        {job.featured && (
                          <Badge className="bg-primary/10 text-primary text-xs">Featured</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Posted {job.posted}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1">Apply Now</Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-primary/5 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2">Post a Job Opportunity</h3>
            <p className="text-muted-foreground mb-4">
              Help fellow alumni find their next career opportunity
            </p>
            <Button>Post a Job</Button>
          </div>
        </div>
      </div>
    </section>
  )
}