import { useState } from "react"
import { 
  Calendar, 
  Clock, 
  User, 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark,
  ExternalLink,
  Eye,
  ThumbsUp
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { cn } from "../ui/utils"
import { ImageWithFallback } from "../figma/ImageWithFallback"

// Helper function to format time ago
const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString()
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Campus Updates": "bg-blue-100 text-blue-800",
    "Alumni Success": "bg-purple-100 text-purple-800",
    "Alumni Network": "bg-purple-100 text-purple-800",
    "Student Life": "bg-green-100 text-green-800",
    "Student Achievement": "bg-green-100 text-green-800",
    "Academic": "bg-orange-100 text-orange-800",
    "Financial Aid": "bg-yellow-100 text-yellow-800"
  }
  return colors[category] || "bg-gray-100 text-gray-800"
}

interface NewsCardProps {
  news: any
  featured?: boolean
  layout?: 'horizontal' | 'vertical'
  onReadMore?: () => void
  className?: string
}

export function NewsCard({ 
  news, 
  featured = false, 
  layout = 'horizontal',
  onReadMore,
  className 
}: NewsCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(news.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
    // In real app, this would make an API call
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // In real app, this would make an API call
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // In real app, this would open share dialog
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.excerpt,
        url: window.location.href
      })
    }
  }

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onReadMore) {
      onReadMore()
    }
    // In real app, this would navigate to full article
  }

  if (layout === 'vertical') {
    return (
      <Card 
        className={cn(
          "transition-all hover:shadow-md cursor-pointer",
          featured && "ring-2 ring-primary/20 shadow-sm",
          className
        )}
      >
        {news.image && (
          <div className="relative">
            <ImageWithFallback
              src={news.image}
              alt={news.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {featured && (
              <Badge className="absolute top-3 left-3 bg-primary">
                Featured
              </Badge>
            )}
            <Badge 
              className={cn("absolute top-3 right-3", getCategoryColor(news.category))}
            >
              {news.category}
            </Badge>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={news.authorAvatar} alt={news.author} />
              <AvatarFallback className="text-xs">
                {getInitials(news.author)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{news.author}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {formatTimeAgo(news.publishedDate)}
            </span>
          </div>

          <h3 className="mb-3 line-clamp-2">
            {news.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-3">
            {news.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {news.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {news.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{news.tags.length - 3}
              </Badge>
            )}
          </div>

          <Separator className="my-4" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {news.readTime}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {likes + news.comments * 3}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "h-8 px-2",
                  isLiked && "text-red-600"
                )}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                <span className="ml-1">{likes}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MessageCircle className="h-4 w-4" />
                <span className="ml-1">{news.comments}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "h-8 w-8 p-0",
                  isBookmarked && "text-yellow-600"
                )}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
              </Button>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleReadMore}
          >
            Read Full Article
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Horizontal Layout
  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        featured && "ring-2 ring-primary/20 shadow-sm",
        className
      )}
    >
      <CardContent className="p-6">
        <div className={cn(
          "flex gap-6",
          featured ? "flex-col lg:flex-row" : "flex-col sm:flex-row"
        )}>
          {/* Image */}
          {news.image && (
            <div className={cn(
              "relative flex-shrink-0",
              featured ? "lg:w-80 lg:h-48" : "sm:w-64 sm:h-32",
              "w-full h-48 sm:h-auto"
            )}>
              <ImageWithFallback
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover rounded-lg"
              />
              {featured && (
                <Badge className="absolute top-3 left-3 bg-primary">
                  Featured
                </Badge>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getCategoryColor(news.category)}>
                {news.category}
              </Badge>
              {news.priority === 'high' && (
                <Badge variant="destructive" className="text-xs">
                  Important
                </Badge>
              )}
            </div>

            <h3 className={cn(
              "mb-3 line-clamp-2",
              featured && "text-xl"
            )}>
              {news.title}
            </h3>

            <p className={cn(
              "text-muted-foreground mb-4",
              featured ? "line-clamp-4" : "line-clamp-2"
            )}>
              {news.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {news.tags.slice(0, featured ? 5 : 3).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {news.tags.length > (featured ? 5 : 3) && (
                <Badge variant="outline" className="text-xs">
                  +{news.tags.length - (featured ? 5 : 3)}
                </Badge>
              )}
            </div>

            {/* Meta and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={news.authorAvatar} alt={news.author} />
                    <AvatarFallback className="text-xs">
                      {getInitials(news.author)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{news.author}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimeAgo(news.publishedDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {news.readTime}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={cn(
                      "h-8 px-2",
                      isLiked && "text-red-600"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                    <span className="ml-1">{likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MessageCircle className="h-4 w-4" />
                    <span className="ml-1">{news.comments}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="h-8 w-8 p-0"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={cn(
                      "h-8 w-8 p-0",
                      isBookmarked && "text-yellow-600"
                    )}
                  >
                    <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReadMore}
                >
                  Read More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}