import { useState } from "react"
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  Award, 
  Clock, 
  Calendar,
  User,
  Send,
  ThumbsUp,
  X
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"

interface StoryDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  story?: any
}

export function StoryDetailDialog({ open, onOpenChange, story }: StoryDetailDialogProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(story?.likes || 0)
  const [newComment, setNewComment] = useState("")

  if (!story) return null

  const mockComments = [
    {
      id: "comment-1",
      author: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        graduationYear: "2020",
        currentRole: "Product Manager at Microsoft"
      },
      content: "This is incredibly inspiring! I'm currently transitioning into tech and your journey gives me hope. Thank you for sharing your experience.",
      timestamp: "2024-02-12T10:30:00Z",
      likes: 12,
      replies: []
    },
    {
      id: "comment-2",
      author: {
        name: "Lisa Wang",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        graduationYear: "2018",
        currentRole: "Senior Developer at Apple"
      },
      content: "Sarah, I remember you from our algorithms class! So proud to see how far you've come. Would love to connect and catch up sometime.",
      timestamp: "2024-02-12T14:45:00Z",
      likes: 8,
      replies: [
        {
          id: "reply-1",
          author: {
            name: "Sarah Chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            graduationYear: "2019",
            currentRole: "Senior Software Engineer at Google"
          },
          content: "Lisa! Of course I remember you! Let's definitely catch up - I'll send you a message.",
          timestamp: "2024-02-12T16:20:00Z",
          likes: 3
        }
      ]
    },
    {
      id: "comment-3",
      author: {
        name: "Michael Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        graduationYear: "2021",
        currentRole: "Software Engineer at Startup"
      },
      content: "Thank you for mentioning the importance of networking and alumni connections. I'm actively reaching out to alumni in my field - any advice on the best approach?",
      timestamp: "2024-02-11T09:15:00Z",
      likes: 15,
      replies: []
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

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

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.excerpt,
        url: window.location.href
      })
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In real app, would add comment via API
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Alumni Story
            </span>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* Header Image */}
            {story.image && (
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {story.featured && (
                  <Badge className="absolute top-4 left-4 bg-primary">
                    Featured Story
                  </Badge>
                )}
                {story.verified && (
                  <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            )}

            {/* Story Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getCategoryColor(story.category)}>
                  {story.category}
                </Badge>
                {story.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Award className="h-3 w-3 mr-1" />
                    Verified Alumni
                  </Badge>
                )}
              </div>

              <h1 className="mb-4">{story.title}</h1>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={story.author.avatar} alt={story.author.name} />
                    <AvatarFallback>
                      {getInitials(story.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{story.author.name}</p>
                      {story.verified && (
                        <Award className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {story.author.currentRole}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {story.author.major} • Class of {story.author.graduationYear}
                    </p>
                  </div>
                </div>

                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(story.publishedDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {story.readTime} minute read
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {story.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Story Content */}
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                {story.excerpt}
              </p>
              
              <div className="whitespace-pre-wrap">
                {story.content}
              </div>
            </div>

            {/* Engagement Actions */}
            <div className="flex items-center justify-between py-4 border-y">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? "text-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {likes} {likes === 1 ? 'like' : 'likes'}
                </Button>

                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {mockComments.length} {mockComments.length === 1 ? 'comment' : 'comments'}
                </Button>

                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={isBookmarked ? "text-yellow-600" : ""}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <h3>Comments ({mockComments.length})</h3>

              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Share your thoughts or ask a question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-6">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(comment.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{comment.author.name}</p>
                          <span className="text-xs text-muted-foreground">
                            Class of {comment.author.graduationYear}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {comment.author.currentRole}
                        </p>
                        <p className="text-sm mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-11 space-y-3">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                              <AvatarFallback className="text-xs">
                                {getInitials(reply.author.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm">{reply.author.name}</p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(reply.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm mb-2">{reply.content}</p>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {reply.likes}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}