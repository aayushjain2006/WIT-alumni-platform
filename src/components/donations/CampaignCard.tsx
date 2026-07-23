import { Heart, Users, Calendar, TrendingUp, Target } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { cn } from "../ui/utils"

interface CampaignCardProps {
  campaign: any
  onDonate: (campaign: any) => void
  featured?: boolean
  className?: string
}

export function CampaignCard({ campaign, onDonate, featured = false, className }: CampaignCardProps) {
  const progressPercentage = (campaign.raised / campaign.goal) * 100
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Student Support": return "bg-blue-100 text-blue-800"
      case "Infrastructure": return "bg-purple-100 text-purple-800"
      case "Scholarships": return "bg-green-100 text-green-800"
      case "Programs": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (featured) {
    return (
      <Card className={cn("transition-all hover:shadow-lg", className)}>
        <div className="relative">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-3 left-3 bg-primary">
            Featured
          </Badge>
          <Badge className={cn("absolute top-3 right-3", getUrgencyColor(campaign.urgency))}>
            {campaign.urgency} priority
          </Badge>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <Badge className={getCategoryColor(campaign.category)}>
              {campaign.category}
            </Badge>
            <div className="text-right text-sm text-muted-foreground">
              {campaign.daysLeft} days left
            </div>
          </div>

          <h3 className="mb-3">{campaign.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {campaign.description}
          </p>

          {/* Progress */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span>₹{campaign.raised.toLocaleString()} raised</span>
              <span>₹{campaign.goal.toLocaleString()} goal</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {campaign.donors} donors
              </div>
              <span>{Math.round(progressPercentage)}% funded</span>
            </div>
          </div>

          {/* Impact */}
          <div className="p-3 bg-muted/50 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Expected Impact</p>
                <p className="text-sm text-muted-foreground">{campaign.impact}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1"
              onClick={() => onDonate(campaign)}
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate Now
            </Button>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Regular card layout
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <div className="relative">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <Badge className={cn("absolute top-2 right-2", getUrgencyColor(campaign.urgency))}>
          {campaign.urgency}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(campaign.category)} variant="outline">
            {campaign.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {campaign.daysLeft} days left
          </span>
        </div>

        <h4 className="font-medium mb-2 line-clamp-1">{campaign.title}</h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs">
            <span>₹{campaign.raised.toLocaleString()}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {campaign.donors} donors
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            ₹{campaign.goal.toLocaleString()} goal
          </div>
        </div>

        <Button 
          size="sm" 
          className="w-full"
          onClick={() => onDonate(campaign)}
        >
          <Heart className="h-3 w-3 mr-2" />
          Donate
        </Button>
      </CardContent>
    </Card>
  )
}