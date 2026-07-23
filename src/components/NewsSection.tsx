import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Calendar, MessageSquare, Heart, Share } from "lucide-react"

export function NewsSection() {
  const newsItems = [
    {
      title: "University Announces New $50M Innovation Center",
      excerpt: "The state-of-the-art facility will focus on sustainable technology research and will provide opportunities for alumni to collaborate on cutting-edge projects.",
      author: "Alumni Relations Team",
      date: "March 1, 2025",
      category: "University News",
      image: "",
      likes: 142,
      comments: 23,
      featured: true
    },
    {
      title: "Alumni Startup Raises $10M Series A",
      excerpt: "GreenTech Solutions, founded by Marcus Johnson (Class of 2015), secures major funding to expand their sustainable energy platform.",
      author: "Sarah Chen",
      date: "February 28, 2025",
      category: "Alumni Success",
      image: "",
      likes: 89,
      comments: 15,
      featured: false
    },
    {
      title: "Mentorship Program Expands Globally",
      excerpt: "Our alumni mentorship program now connects mentors and mentees across 50 countries, facilitating career growth worldwide.",
      author: "Career Services",
      date: "February 25, 2025",
      category: "Program Update",
      image: "",
      likes: 67,
      comments: 8,
      featured: false
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Latest News & Updates
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay informed about alumni achievements and university developments
            </p>
          </div>
          <Button size="lg">
            View All News
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          {newsItems.filter(item => item.featured).map((item, index) => (
            <Card key={index} className="lg:col-span-2 overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="md:flex md:h-80">
                <div className="md:w-1/2">
                  <ImageWithFallback
                    src={item.image || "https://images.unsplash.com/photo-1608908272009-5834650fb600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBtZWV0aW5nfGVufDF8fHx8MTc1Nzg2NDkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                    alt={item.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-primary/10 text-primary">Featured</Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 leading-tight">{item.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed flex-1">
                    {item.excerpt}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={item.author} />
                        <AvatarFallback className="text-xs">
                          {item.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.author}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{item.comments}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Other Articles */}
          <div className="space-y-6">
            {newsItems.filter(item => !item.featured).map((item, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{item.category}</Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="" alt={item.author} />
                      <AvatarFallback className="text-xs">
                        {item.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{item.author}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}