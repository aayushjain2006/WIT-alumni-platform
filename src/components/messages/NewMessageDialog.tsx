import { useState, useMemo } from "react"
import { Search, Users, MessageCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { VisuallyHidden } from "../ui/visually-hidden"

// Mock users data for starting new conversations
const mockUsers = [
  {
    id: "u1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    title: "Software Engineer",
    company: "Google",
    role: "alumni",
    batch: "2018",
    location: "San Francisco, CA",
    isOnline: true
  },
  {
    id: "u2",
    name: "Michael Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    title: "Marketing Director",
    company: "Meta",
    role: "alumni",
    batch: "2017",
    location: "New York, NY",
    isOnline: false
  },
  {
    id: "u3",
    name: "Lisa Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    title: "Product Manager",
    company: "Airbnb",
    role: "alumni",
    batch: "2019",
    location: "Los Angeles, CA",
    isOnline: true
  },
  {
    id: "u4",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    title: "Data Scientist",
    company: "Netflix",
    role: "alumni",
    batch: "2020",
    location: "Seattle, WA",
    isOnline: false
  },
  {
    id: "u5",
    name: "Emily Johnson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    title: "Computer Science Student",
    company: "University",
    role: "student",
    batch: "2025",
    location: "Boston, MA",
    isOnline: true
  },
  {
    id: "u6",
    name: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    title: "UX Designer",
    company: "Adobe",
    role: "alumni",
    batch: "2021",
    location: "Austin, TX",
    isOnline: true
  }
]

// Mock groups data
const mockGroups = [
  {
    id: "g1",
    name: "CS Alumni 2020",
    description: "Computer Science graduates from 2020",
    memberCount: 45,
    avatar: null,
    isPrivate: false
  },
  {
    id: "g2",
    name: "Product Management Network",
    description: "Alumni working in product management",
    memberCount: 78,
    avatar: null,
    isPrivate: false
  },
  {
    id: "g3",
    name: "Bay Area Alumni",
    description: "Alumni living and working in the Bay Area",
    memberCount: 156,
    avatar: null,
    isPrivate: false
  },
  {
    id: "g4",
    name: "Startup Founders",
    description: "Alumni who have started their own companies",
    memberCount: 23,
    avatar: null,
    isPrivate: true
  }
]

interface NewMessageDialogProps {
  isOpen: boolean
  onClose: () => void
  onConversationStart: (conversationId: string) => void
}

export function NewMessageDialog({ isOpen, onClose, onConversationStart }: NewMessageDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("users")

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return mockUsers
    
    return mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return mockGroups
    
    return mockGroups.filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleStartConversation = () => {
    if (activeTab === "users" && selectedUsers.length > 0) {
      // In a real app, this would create a new conversation
      const conversationId = `conv_${Date.now()}`
      alert(`Starting conversation with ${selectedUsers.length} user(s)`)
      onConversationStart(conversationId)
      handleClose()
    }
  }

  const handleJoinGroup = (groupId: string) => {
    // In a real app, this would join the group
    alert(`Joining group ${groupId}`)
    onConversationStart(groupId)
    handleClose()
  }

  const handleClose = () => {
    setSearchQuery("")
    setSelectedUsers([])
    setActiveTab("users")
    onClose()
  }

  const selectedUsersData = selectedUsers.map(id => mockUsers.find(u => u.id === id)).filter(Boolean)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Search for users or groups to start a new conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users or groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Selected ({selectedUsers.length}):</p>
              <div className="flex flex-wrap gap-2">
                {selectedUsersData.map((user) => (
                  <Badge key={user?.id} variant="secondary" className="flex items-center gap-1 pr-1">
                    {user?.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => user && handleUserToggle(user.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4 overflow-hidden">
              <TabsContent value="users" className="h-full m-0 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleUserToggle(user.id)}
                      >
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                        />
                        
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">{user.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {user.role === "alumni" ? `Class of ${user.batch}` : user.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.title} at {user.company}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="groups" className="h-full m-0 overflow-y-auto">
                {filteredGroups.length > 0 ? (
                  <div className="space-y-2">
                    {filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{group.name}</h4>
                            {group.isPrivate && (
                              <Badge variant="outline" className="text-xs">Private</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {group.memberCount} members
                          </p>
                        </div>

                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No groups found</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {activeTab === "users" && (
              <Button 
                onClick={handleStartConversation}
                disabled={selectedUsers.length === 0}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Conversation ({selectedUsers.length})
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}