import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

export function EventsSection() {
  const upcomingEvents = [
    {
      title: "Annual Alumni Gala",
      date: "March 15, 2025",
      time: "6:00 PM EST",
      location: "Grand Ballroom, NYC",
      attendees: 450,
      type: "In-Person",
      description: "Join us for an evening of celebration, networking, and recognition of outstanding alumni achievements.",
      image: "https://images.unsplash.com/photo-1745970747689-52782301cfb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBuZXR3b3JraW5nJTIwYnVzaW5lc3MlMjBwZW9wbGV8ZW58MXx8fHwxNzU3Nzg3MjA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: true
    },
    {
      title: "Tech Industry Meetup",
      date: "March 8, 2025",
      time: "7:00 PM PST",
      location: "Virtual Event",
      attendees: 120,
      type: "Virtual",
      description: "Connect with alumni working in tech. Discuss latest trends, share opportunities, and build your network.",
      image: "https://images.unsplash.com/photo-1608908272009-5834650fb600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBtZWV0aW5nfGVufDF8fHx8MTc1Nzg2NDkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      featured: false
    },
    {
      title: "Career Development Workshop",
      date: "March 12, 2025",
      time: "2:00 PM EST",
      location: "Alumni Center",
      attendees: 85,
      type: "In-Person",
      description: "Learn essential skills for career advancement with industry experts and successful alumni.",
      image: "",
      featured: false
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't miss these exciting opportunities to connect and grow
            </p>
          </div>
          <Button size="lg">
            View All Events
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Event */}
          {upcomingEvents.filter(event => event.featured).map((event, index) => (
            <Card key={index} className="lg:col-span-2 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-primary/10 text-primary">Featured</Badge>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date}</span>
                      <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1">Register Now</Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Other Events */}
          <div className="space-y-6">
            {upcomingEvents.filter(event => !event.featured).map((event, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{event.type}</Badge>
                    <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Register
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}