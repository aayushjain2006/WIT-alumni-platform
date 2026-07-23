import { useState } from "react"
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
import { Users, UserPlus, Check, X, Search, MessageCircle, ExternalLink } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Separator } from "../ui/separator"

interface User {
  id: string
  name: string
  avatar?: string
  title: string
  company: string
  batch?: string
  location: string
  isOnline?: boolean
}

interface Connection {
  id: string
  user: User
  connectedAt: string
  mutualConnections: number
}

interface ConnectionRequest {
  id: string
  user: User
  message?: string
  requestedAt: string
  type: "incoming" | "outgoing"
}

interface NetworkingTabProps {
  connections: Connection[]
  connectionRequests: ConnectionRequest[]
}

export function NetworkingTab({ connections, connectionRequests }: NetworkingTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("connections")

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

  const filteredConnections = connections.filter(connection =>
    connection.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.user.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.user.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const incomingRequests = connectionRequests.filter(req => req.type === "incoming")
  const outgoingRequests = connectionRequests.filter(req => req.type === "outgoing")

  const handleAcceptRequest = (requestId: string) => {
    // In a real app, this would make an API call
    alert(`Accepting connection request ${requestId}`)
  }

  const handleDeclineRequest = (requestId: string) => {
    // In a real app, this would make an API call
    alert(`Declining connection request ${requestId}`)
  }

  const handleCancelRequest = (requestId: string) => {
    // In a real app, this would make an API call
    alert(`Canceling connection request ${requestId}`)
  }

  const handleSendMessage = (userId: string) => {
    // In a real app, this would start a new conversation
    alert(`Starting conversation with user ${userId}`)
  }

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connections">
            Connections ({connections.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {connectionRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {connectionRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="discover">
            Discover
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-6 overflow-hidden">
          <TabsContent value="connections" className="h-full m-0">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Connections
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search connections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {filteredConnections.length > 0 ? (
                  <div className="space-y-4">
                    {filteredConnections.map((connection) => (
                      <div key={connection.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={connection.user.avatar} alt={connection.user.name} />
                            <AvatarFallback>
                              {getInitials(connection.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          {connection.user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{connection.user.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {connection.user.title} at {connection.user.company}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {connection.user.location}
                            </span>
                            {connection.user.batch && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  Class of {connection.user.batch}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Connected {formatTimestamp(connection.connectedAt)} • {connection.mutualConnections} mutual connections
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSendMessage(connection.user.id)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="mb-2">No connections found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search criteria." : "Start connecting with fellow alumni to build your network."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="h-full m-0">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Connection Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {connectionRequests.length > 0 ? (
                  <div className="space-y-6">
                    {/* Incoming Requests */}
                    {incomingRequests.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-4">Incoming Requests ({incomingRequests.length})</h4>
                        <div className="space-y-4">
                          {incomingRequests.map((request) => (
                            <div key={request.id} className="p-4 border rounded-lg">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={request.user.avatar} alt={request.user.name} />
                                  <AvatarFallback>
                                    {getInitials(request.user.name)}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium">{request.user.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      Class of {request.user.batch}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {request.user.title} at {request.user.company}
                                  </p>
                                  <p className="text-xs text-muted-foreground mb-3">
                                    {request.user.location} • {formatTimestamp(request.requestedAt)}
                                  </p>

                                  {request.message && (
                                    <div className="bg-muted p-3 rounded-md mb-3">
                                      <p className="text-sm">{request.message}</p>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm"
                                      onClick={() => handleAcceptRequest(request.id)}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Accept
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleDeclineRequest(request.id)}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Decline
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Outgoing Requests */}
                    {outgoingRequests.length > 0 && (
                      <div>
                        {incomingRequests.length > 0 && <Separator />}
                        <h4 className="font-medium mb-4 mt-6">Sent Requests ({outgoingRequests.length})</h4>
                        <div className="space-y-4">
                          {outgoingRequests.map((request) => (
                            <div key={request.id} className="flex items-center gap-4 p-4 border rounded-lg">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={request.user.avatar} alt={request.user.name} />
                                <AvatarFallback>
                                  {getInitials(request.user.name)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium">{request.user.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {request.user.title} at {request.user.company}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Sent {formatTimestamp(request.requestedAt)}
                                </p>
                              </div>

                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCancelRequest(request.id)}
                              >
                                Cancel Request
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="mb-2">No connection requests</h3>
                    <p className="text-muted-foreground">
                      Connection requests will appear here when you receive them.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="h-full m-0">
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="mb-2">Discover New Connections</h3>
                <p className="text-muted-foreground mb-4">
                  Find and connect with alumni in your field or location.
                </p>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Browse Alumni Directory
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}