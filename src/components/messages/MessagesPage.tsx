import { useState, useMemo } from "react"
import { Search, Plus, Users, MessageCircle, UserPlus, Settings } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useAuth } from "../../contexts/AuthContext"
import { ConversationsList } from "./ConversationsList"
import { ChatInterface } from "./ChatInterface"
import { NetworkingTab } from "./NetworkingTab"
import { NewMessageDialog } from "./NewMessageDialog"

// Mock conversations data
const mockConversations = [
  {
    id: "1",
    type: "direct",
    participants: [
      {
        id: "u1",
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        role: "alumni",
        title: "Software Engineer",
        company: "Google",
        isOnline: true
      }
    ],
    lastMessage: {
      id: "m1",
      content: "Thanks for connecting! I'd love to learn more about your experience in product management.",
      sender: "u1",
      timestamp: "2024-02-14T15:30:00Z",
      isRead: false
    },
    unreadCount: 2
  },
  {
    id: "2",
    type: "direct",
    participants: [
      {
        id: "u2",
        name: "Michael Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "alumni",
        title: "Marketing Director",
        company: "Meta",
        isOnline: false,
        lastSeen: "2024-02-14T14:00:00Z"
      }
    ],
    lastMessage: {
      id: "m2",
      content: "The event next week sounds great. I'll definitely be there!",
      sender: "current",
      timestamp: "2024-02-14T12:45:00Z",
      isRead: true
    },
    unreadCount: 0
  },
  {
    id: "3",
    type: "group",
    name: "CS Alumni 2020",
    participants: [
      {
        id: "u3",
        name: "Lisa Thompson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        role: "alumni"
      },
      {
        id: "u4",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        role: "alumni"
      }
    ],
    lastMessage: {
      id: "m3",
      content: "Anyone interested in a reunion this summer?",
      sender: "u3",
      timestamp: "2024-02-14T10:15:00Z",
      isRead: true
    },
    unreadCount: 0,
    memberCount: 15
  },
  {
    id: "4",
    type: "direct",
    participants: [
      {
        id: "u5",
        name: "Emily Johnson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        role: "student",
        title: "Computer Science Student",
        company: "University",
        isOnline: true
      }
    ],
    lastMessage: {
      id: "m4",
      content: "Hi! I saw your profile and I'm really interested in learning about career opportunities in tech.",
      sender: "u5",
      timestamp: "2024-02-13T16:20:00Z",
      isRead: false
    },
    unreadCount: 1
  }
]

// Mock networking data
const mockConnections = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      title: "Software Engineer",
      company: "Google",
      batch: "2018",
      location: "San Francisco, CA",
      isOnline: true
    },
    connectedAt: "2024-01-15T10:00:00Z",
    mutualConnections: 12
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Marketing Director",
      company: "Meta",
      batch: "2017",
      location: "New York, NY",
      isOnline: false
    },
    connectedAt: "2024-01-10T14:30:00Z",
    mutualConnections: 8
  }
]

const mockConnectionRequests = [
  {
    id: "1",
    user: {
      id: "u6",
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      title: "Data Scientist",
      company: "Netflix",
      batch: "2019",
      location: "Los Angeles, CA"
    },
    message: "Hi! I'd love to connect and learn about your experience in product management.",
    requestedAt: "2024-02-14T09:00:00Z",
    type: "incoming"
  },
  {
    id: "2",
    user: {
      id: "u7",
      name: "Jessica Park",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      title: "UX Designer",
      company: "Adobe",
      batch: "2020",
      location: "Seattle, WA"
    },
    message: "",
    requestedAt: "2024-02-13T15:30:00Z",
    type: "outgoing"
  }
]

interface MessagesPageProps {
  className?: string
}

export function MessagesPage({ className }: MessagesPageProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("conversations")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewMessage, setShowNewMessage] = useState(false)

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return mockConversations
    
    return mockConversations.filter(conv => {
      if (conv.type === "group") {
        return conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
      } else {
        return conv.participants[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
      }
    })
  }, [searchQuery])

  const totalUnreadCount = mockConversations.reduce((total, conv) => total + conv.unreadCount, 0)

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId)
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
  }

  const selectedConversationData = selectedConversation 
    ? mockConversations.find(c => c.id === selectedConversation)
    : null

  return (
    <div className={className}>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="mb-2">Messages & Networking</h1>
              <p className="text-muted-foreground">
                Connect with fellow alumni, students, and engage in meaningful conversations.
              </p>
            </div>
            <Button onClick={() => setShowNewMessage(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="conversations" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages
                {totalUnreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="networking" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Networking
                {mockConnectionRequests.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {mockConnectionRequests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0">
              <TabsContent value="conversations" className="h-full m-0">
                <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Conversations List */}
                  <div className={`lg:col-span-1 ${selectedConversation ? 'hidden lg:block' : ''}`}>
                    <Card className="h-full flex flex-col">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Conversations
                          </CardTitle>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden p-0">
                        <ConversationsList
                          conversations={filteredConversations}
                          selectedConversation={selectedConversation}
                          onConversationSelect={handleConversationSelect}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Chat Interface */}
                  <div className={`lg:col-span-2 ${!selectedConversation ? 'hidden lg:block' : ''}`}>
                    {selectedConversationData ? (
                      <ChatInterface
                        conversation={selectedConversationData}
                        onBack={handleBackToList}
                      />
                    ) : (
                      <Card className="h-full flex items-center justify-center">
                        <CardContent className="text-center">
                          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="mb-2">Select a conversation</h3>
                          <p className="text-muted-foreground mb-4">
                            Choose a conversation from the list to start messaging.
                          </p>
                          <Button onClick={() => setShowNewMessage(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Start New Conversation
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="networking" className="h-full m-0">
                <NetworkingTab
                  connections={mockConnections}
                  connectionRequests={mockConnectionRequests}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* New Message Dialog */}
        <NewMessageDialog
          isOpen={showNewMessage}
          onClose={() => setShowNewMessage(false)}
          onConversationStart={(conversationId) => {
            setSelectedConversation(conversationId)
            setActiveTab("conversations")
          }}
        />
      </div>
    </div>
  )
}