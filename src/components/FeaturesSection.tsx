import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Users, Calendar, Briefcase, BookOpen, MessageSquare, Award } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Alumni Directory",
      description: "Find and connect with alumni based on location, industry, graduation year, and interests.",
      badge: "25K+ Members",
      color: "text-blue-600"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Events & Networking",
      description: "Join exclusive alumni events, reunions, and networking sessions worldwide.",
      badge: "50+ Monthly Events",
      color: "text-green-600"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Career Hub",
      description: "Access job postings, mentorship programs, and career development resources.",
      badge: "New Opportunities",
      color: "text-purple-600"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Learning Resources",
      description: "Continuous learning with courses, workshops, and educational content.",
      badge: "100+ Courses",
      color: "text-orange-600"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Community Forums",
      description: "Engage in discussions, share insights, and collaborate on projects.",
      badge: "Active Community",
      color: "text-cyan-600"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Recognition",
      description: "Celebrate achievements and recognize outstanding alumni contributions.",
      badge: "Monthly Awards",
      color: "text-yellow-600"
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need to Stay Connected
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform offers all the tools and resources you need to maintain 
            lifelong connections and advance your career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-background border ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full group-hover:bg-primary/5 transition-colors">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}