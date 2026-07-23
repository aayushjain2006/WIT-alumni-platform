import { Heart, MessageCircle, Share, Eye, Clock, Star, Award, Calendar } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "../ui/utils"

interface StoryCardProps {
  story: any
  onViewStory: (story: any) => void
  featured?: boolean
  layout?: 'horizontal' | 'vertical'
  className?: string
}

export function StoryCard({ 
  story, 
  onViewStory, 
  featured = false, 
  layout = 'vertical',
  className 
}: StoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Career Success": return "bg-blue-100 text-blue-800"
      case "Social Impact": return "bg-green-100 text-green-800"
      case "Personal Achievement": return "bg-purple-100 text-purple-800"
      case "Entrepreneurship": return "bg-orange-100 text-orange-800"
      case "Giving Back": return "bg-pink-100 text-pink-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  if (layout === 'horizontal' || featured) {
    return (
      <Card 
        className={cn(
          "transition-all hover:shadow-lg cursor-pointer",
          featured && "ring-2 ring-primary/20 shadow-md",
          className
        )}
        onClick={() => onViewStory(story)}
      >
        <CardContent className="p-6">
          <div className={cn(
            "flex gap-6",
            featured ? "flex-col lg:flex-row" : "flex-col sm:flex-row"
          )}>
            {/* Image */}
            {story.image && (
              <div className={cn(
                "relative flex-shrink-0",
                featured ? "lg:w-80 lg:h-48" : "sm:w-48 sm:h-32",
                "w-full h-48 sm:h-auto"
              )}>
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                {featured && (
                  <Badge className="absolute top-3 left-3 bg-primary">
                    Featured
                  </Badge>
                )}
                {story.verified && (
                  <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <Award className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getCategoryColor(story.category)}>
                  {story.category}
                </Badge>
                {featured && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    <Star className="h-3 w-3 mr-1" />
                    Editor's Pick
                  </Badge>
                )}
              </div>

              <h3 className={cn(
                "mb-3 line-clamp-2",
                featured && "text-xl"
              )}>
                {story.title}
              </h3>

              <p className={cn(
                "text-muted-foreground mb-4",
                featured ? "line-clamp-3" : "line-clamp-2"
              )}>
                {story.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {story.tags.slice(0, featured ? 4 : 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {story.tags.length > (featured ? 4 : 3) && (
                  <Badge variant="outline" className="text-xs">
                    +{story.tags.length - (featured ? 4 : 3)}
                  </Badge>
                )}
              </div>

              {/* Author and Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={story.author.avatar} alt={story.author.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(story.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{story.author.name}</p>
                      {story.verified && (
                        <Award className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {story.author.currentRole} • Class of {story.author.graduationYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {story.readTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(story.publishedDate)}
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {story.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {story.comments}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share className="h-4 w-4" />
                    {story.shares}
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  Read Story
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Vertical layout
  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        className
      )}
      onClick={() => onViewStory(story)}
    >
      {story.image && (
        <div className="relative">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {story.verified && (
            <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
              <Award className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={getCategoryColor(story.category)}>
            {story.category}
          </Badge>
        </div>

        <h4 className="mb-3 line-clamp-2">
          {story.title}
        </h4>

        <p className="text-muted-foreground mb-4 line-clamp-3">
          {story.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {story.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{story.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={story.author.avatar} alt={story.author.name} />
            <AvatarFallback className="text-xs">
              {getInitials(story.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">{story.author.name}</p>
              {story.verified && (
                <Award className="h-3 w-3 text-blue-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              Class of {story.author.graduationYear}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {story.readTime} min read
          </div>
          <span>{formatDate(story.publishedDate)}</span>
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {story.likes}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {story.comments}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {story.likes * 3}
            </div>
          </div>

          <Button variant="outline" size="sm">
            Read
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}