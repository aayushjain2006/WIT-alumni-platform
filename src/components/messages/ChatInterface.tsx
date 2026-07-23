import { useState, useRef, useEffect } from "react"
// Simple date formatting function since date-fns isn't available
const formatDistanceToNow = (date: Date) => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return "now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString()
}
import { ArrowLeft, Send, Paperclip, Smile, Phone, Video, MoreVertical, Users, Circle } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardHeader } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import { cn } from "../ui/utils"

interface Participant {
  id: string
  name: string
  avatar?: string
  role: string
  title?: string
  company?: string
  isOnline?: boolean
  lastSeen?: string
}

interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  type: "direct" | "group"
  name?: string
  participants: Participant[]
  lastMessage?: Message
  unreadCount: number
  memberCount?: number
}

// Mock messages for the selected conversation
const mockMessages = [
  {
    id: "msg1",
    content: "Hi! I saw your profile and I'm really interested in learning about career opportunities in tech.",
    sender: "u5",
    timestamp: "2024-02-13T16:20:00Z",
    isRead: true,
    type: "text"
  },
  {
    id: "msg2",
    content: "Hello! I'd be happy to help. What specific areas are you most interested in?",
    sender: "current",
    timestamp: "2024-02-13T16:25:00Z",
    isRead: true,
    type: "text"
  },
  {
    id: "msg3",
    content: "I'm particularly interested in product management and software engineering. I'm currently a CS student and trying to understand the career paths better.",
    sender: "u5",
    timestamp: "2024-02-13T16:28:00Z",
    isRead: true,
    type: "text"
  },
  {
    id: "msg4",
    content: "Great choices! Both are excellent fields with lots of growth opportunities. Product management is really about understanding user needs and working with engineering teams to build solutions.",
    sender: "current",
    timestamp: "2024-02-13T16:30:00Z",
    isRead: true,
    type: "text"
  },
  {
    id: "msg5",
    content: "For software engineering, it depends on what kind of problems you want to solve - frontend, backend, mobile, etc. What interests you most?",
    sender: "current",
    timestamp: "2024-02-13T16:31:00Z",
    isRead: true,
    type: "text"
  },
  {
    id: "msg6",
    content: "Thanks for connecting! I'd love to learn more about your experience in product management.",
    sender: "u1",
    timestamp: "2024-02-14T15:30:00Z",
    isRead: false,
    type: "text"
  }
]

interface ChatInterfaceProps {
  conversation: Conversation
  onBack: () => void
}

export function ChatInterface({ conversation, onBack }: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp))
    } catch {
      return "Unknown"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  const getConversationTitle = () => {
    if (conversation.type === "group") {
      return conversation.name || "Group Chat"
    }
    return conversation.participants[0]?.name || "Unknown"
  }

  const getConversationSubtitle = () => {
    if (conversation.type === "group") {
      return `${conversation.memberCount || conversation.participants.length} members`
    }
    const participant = conversation.participants[0]
    if (participant?.isOnline) {
      return "Online now"
    }
    if (participant?.lastSeen) {
      return `Last seen ${formatTimestamp(participant.lastSeen)}`
    }
    return participant?.title || ""
  }

  const getParticipantById = (id: string) => {
    return conversation.participants.find(p => p.id === id)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: `msg${Date.now()}`,
        content: message.trim(),
        sender: "current",
        timestamp: new Date().toISOString(),
        isRead: true,
        type: "text"
      }
      setMessages(prev => [...prev, newMessage])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const isOnline = conversation.type === "direct" && conversation.participants[0]?.isOnline

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Avatar */}
          <div className="relative">
            {conversation.type === "group" ? (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={conversation.participants[0]?.avatar} 
                  alt={getConversationTitle()} 
                />
                <AvatarFallback>
                  {getInitials(getConversationTitle())}
                </AvatarFallback>
              </Avatar>
            )}
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{getConversationTitle()}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {getConversationSubtitle()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {conversation.type === "direct" && (
              <>
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Search Messages</DropdownMenuItem>
                <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="p-4 space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.sender === "current"
            const sender = isCurrentUser ? null : getParticipantById(msg.sender)
            
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  isCurrentUser ? "justify-end" : "justify-start"
                )}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={sender?.avatar} alt={sender?.name} />
                    <AvatarFallback className="text-xs">
                      {sender ? getInitials(sender.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn(
                  "max-w-[70%] space-y-1",
                  isCurrentUser ? "items-end" : "items-start"
                )}>
                  {!isCurrentUser && conversation.type === "group" && (
                    <p className="text-xs text-muted-foreground">{sender?.name}</p>
                  )}
                  
                  <div className={cn(
                    "rounded-lg px-3 py-2 break-words",
                    isCurrentUser 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-1 text-xs text-muted-foreground",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                    {isCurrentUser && (
                      <Circle className={cn(
                        "h-2 w-2",
                        msg.isRead ? "fill-primary text-primary" : "fill-muted-foreground text-muted-foreground"
                      )} />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm" className="flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}