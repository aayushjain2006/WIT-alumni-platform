import { Calendar, Users, Award, TrendingUp, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"

interface CampaignParticipationCardProps {
  campaign: any
  onParticipate: (campaign: any) => void
  className?: string
}

export function CampaignParticipationCard({ 
  campaign, 
  onParticipate, 
  className 
}: CampaignParticipationCardProps) {
  const progressPercentage = (campaign.currentParticipants / campaign.participationGoal) * 100
  
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(date.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day left"
    if (diffDays < 7) return `${diffDays} days left`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks left`
    return date.toLocaleDateString()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Story Sharing": return "bg-blue-100 text-blue-800"
      case "Mentorship Focus": return "bg-green-100 text-green-800"
      case "Research & Innovation": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(campaign.type)}>
                {campaign.type}
              </Badge>
              {campaign.featured && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl mb-2">{campaign.title}</CardTitle>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{campaign.currentParticipants} participants</span>
            <span>{campaign.participationGoal} goal</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {Math.round(progressPercentage)}% complete
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDeadline(campaign.deadline)}
            </div>
          </div>
        </div>

        {/* Rewards */}
        {campaign.rewards && campaign.rewards.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Award className="h-4 w-4" />
              Participation Rewards
            </h4>
            <div className="flex flex-wrap gap-2">
              {campaign.rewards.map((reward: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {reward}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Deadline: {new Date(campaign.deadline).toLocaleDateString()}
            </div>
          </div>
          <Button onClick={() => onParticipate(campaign)}>
            Participate Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}