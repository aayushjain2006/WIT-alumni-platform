import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MapPin, Building, Calendar } from "lucide-react"

export function AlumniSpotlight() {
  const spotlightAlumni = [
    {
      name: "Sarah Chen",
      title: "Senior Product Manager",
      company: "Meta",
      graduation: "Class of 2018",
      location: "San Francisco, CA",
      bio: "Leading product innovation in AR/VR technologies. Always happy to mentor fellow alumni in tech.",
      achievements: ["Product Leader", "Mentor"],
      image: ""
    },
    {
      name: "Marcus Johnson",
      title: "Founder & CEO",
      company: "GreenTech Solutions",
      graduation: "Class of 2015",
      location: "Austin, TX",
      bio: "Building sustainable technology solutions. Recently raised Series B funding.",
      achievements: ["Entrepreneur", "Sustainability Leader"],
      image: ""
    },
    {
      name: "Dr. Emily Rodriguez",
      title: "Research Scientist",
      company: "Stanford Medicine",
      graduation: "Class of 2012",
      location: "Palo Alto, CA",
      bio: "Pioneering research in gene therapy. Published 50+ papers in leading journals.",
      achievements: ["Researcher", "Innovation Award"],
      image: ""
    }
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Alumni Spotlight
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrating the remarkable achievements of our alumni community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spotlightAlumni.map((alumni, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={alumni.image} alt={alumni.name} />
                    <AvatarFallback className="text-lg">
                      {alumni.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight">{alumni.name}</h3>
                    <p className="text-muted-foreground">{alumni.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3" />
                      <span className="text-sm text-muted-foreground">{alumni.company}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {alumni.graduation}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {alumni.location}
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4">{alumni.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {alumni.achievements.map((achievement, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {achievement}
                    </Badge>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">
            Browse All Alumni
          </Button>
        </div>
      </div>
    </section>
  )
}