import { Button } from "./ui/button"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { ArrowRight, Users, Calendar, Briefcase } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Connect, Grow, and 
                <span className="text-primary"> Thrive</span> with 
                Your Alumni Network
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join thousands of alumni in building meaningful connections, advancing careers, 
                and giving back to the community. Your next opportunity is just one connection away.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex items-center gap-2">
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Explore Features
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">25K+</div>
                <div className="text-sm text-muted-foreground">Alumni Connected</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">1.2K+</div>
                <div className="text-sm text-muted-foreground">Job Placements</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1738949538943-e54722a44ffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjB1bml2ZXJzaXR5fGVufDF8fHx8MTc1Nzc4MzAxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Graduation ceremony"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}