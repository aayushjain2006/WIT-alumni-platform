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
import { Users, Circle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
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

interface ConversationsListProps {
  conversations: Conversation[]
  selectedConversation: string | null
  onConversationSelect: (conversationId: string) => void
}

export function ConversationsList({ 
  conversations, 
  selectedConversation, 
  onConversationSelect 
}: ConversationsListProps) {
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

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.type === "group") {
      return conversation.name || "Group Chat"
    }
    return conversation.participants[0]?.name || "Unknown"
  }

  const getConversationSubtitle = (conversation: Conversation) => {
    if (conversation.type === "group") {
      return `${conversation.memberCount || conversation.participants.length} members`
    }
    const participant = conversation.participants[0]
    return participant?.title && participant?.company 
      ? `${participant.title} at ${participant.company}`
      : participant?.title || participant?.company || ""
  }

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === "group") {
      return null // We'll show a group icon instead
    }
    return conversation.participants[0]?.avatar
  }

  const isParticipantOnline = (conversation: Conversation) => {
    if (conversation.type === "group") return false
    return conversation.participants[0]?.isOnline || false
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No conversations found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation === conversation.id
        const avatar = getConversationAvatar(conversation)
        const isOnline = isParticipantOnline(conversation)
        
        return (
          <div
            key={conversation.id}
            className={cn(
              "flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b transition-colors",
              isSelected && "bg-muted"
            )}
            onClick={() => onConversationSelect(conversation.id)}
          >
            {/* Avatar */}
            <div className="relative">
              {conversation.type === "group" ? (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              ) : (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatar} alt={getConversationTitle(conversation)} />
                  <AvatarFallback>
                    {getInitials(getConversationTitle(conversation))}
                  </AvatarFallback>
                </Avatar>
              )}
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium truncate">
                  {getConversationTitle(conversation)}
                </h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(conversation.lastMessage.timestamp)}
                    </span>
                  )}
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-muted-foreground mb-1 truncate">
                {getConversationSubtitle(conversation)}
              </p>

              {/* Last Message */}
              {conversation.lastMessage && (
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground truncate flex-1">
                    {conversation.lastMessage.sender === "current" && (
                      <span className="text-foreground">You: </span>
                    )}
                    {conversation.lastMessage.content}
                  </p>
                  {!conversation.lastMessage.isRead && conversation.lastMessage.sender !== "current" && (
                    <Circle className="h-2 w-2 fill-primary text-primary flex-shrink-0" />
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}