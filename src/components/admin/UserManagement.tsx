import { useState, useMemo } from "react"
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  MapPin,
  Eye,
  UserCheck,
  UserX,
  Download,
  Upload
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Checkbox } from "../ui/checkbox"
import { useNotifications } from "../../contexts/NotificationContext"
import { UserProfileDialog } from "./UserProfileDialog"
import { CreateUserDialog } from "./CreateUserDialog"
import { BulkActionDialog } from "./BulkActionDialog"

const mockUsers = [
  {
    id: "user-1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    role: "alumni",
    status: "active",
    joinDate: "2024-01-15T10:00:00Z",
    lastLogin: "2024-02-14T14:30:00Z",
    graduationYear: "2019",
    major: "Computer Science",
    company: "Google",
    position: "Senior Software Engineer",
    location: "San Francisco, CA",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    stats: {
      mentorships: 3,
      donations: 2,
      events: 8,
      stories: 2
    }
  },
  {
    id: "user-2",
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    role: "student",
    status: "pending",
    joinDate: "2024-02-10T09:00:00Z",
    lastLogin: "2024-02-14T16:00:00Z",
    graduationYear: "2025",
    major: "Engineering",
    company: null,
    position: null,
    location: "Austin, TX",
    verified: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    stats: {
      applications: 12,
      events: 3,
      connections: 5
    }
  },
  {
    id: "user-3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    role: "alumni",
    status: "active",
    joinDate: "2023-12-05T11:00:00Z",
    lastLogin: "2024-02-13T10:20:00Z",
    graduationYear: "2021",
    major: "Business Administration",
    company: "Microsoft",
    position: "Product Manager",
    location: "Seattle, WA",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    stats: {
      mentorships: 5,
      donations: 1,
      events: 12,
      stories: 1
    }
  },
  {
    id: "user-4",
    name: "Alex Thompson",
    email: "alex.t@email.com",
    role: "student",
    status: "active",
    joinDate: "2024-01-20T08:00:00Z",
    lastLogin: "2024-02-14T12:00:00Z",
    graduationYear: "2026",
    major: "Computer Science",
    company: null,
    position: null,
    location: "Boston, MA",
    verified: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    stats: {
      applications: 8,
      events: 6,
      connections: 12
    }
  },
  {
    id: "user-5",
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    role: "alumni",
    status: "suspended",
    joinDate: "2023-10-12T13:00:00Z",
    lastLogin: "2024-01-28T15:45:00Z",
    graduationYear: "2018",
    major: "Data Science",
    company: "Apple",
    position: "Data Scientist",
    location: "Cupertino, CA",
    verified: true,
    avatar: null,
    stats: {
      mentorships: 2,
      donations: 0,
      events: 4,
      stories: 0
    }
  }
]

const pendingProfiles = [
  {
    id: "pending-1",
    name: "Jennifer Liu",
    email: "jennifer.liu@email.com",
    role: "alumni",
    graduationYear: "2020",
    major: "Marketing",
    submittedDate: "2024-02-14T08:00:00Z",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    company: "Adobe",
    position: "Marketing Manager",
    reason: "Profile verification pending"
  },
  {
    id: "pending-2",
    name: "David Kim",
    email: "david.kim@email.com",
    role: "alumni",
    graduationYear: "2017",
    major: "Engineering",
    submittedDate: "2024-02-13T14:30:00Z",
    avatar: null,
    company: "Tesla",
    position: "Senior Engineer",
    reason: "Employment verification needed"
  }
]

interface UserManagementProps {
  className?: string
}

export function UserManagement({ className }: UserManagementProps) {
  const { addNotification } = useNotifications()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = mockUsers

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.major && user.major.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    return filtered
  }, [searchQuery, roleFilter, statusFilter])

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === "active").length,
    pending: mockUsers.filter(u => u.status === "pending").length + pendingProfiles.length,
    suspended: mockUsers.filter(u => u.status === "suspended").length,
    alumni: mockUsers.filter(u => u.role === "alumni").length,
    students: mockUsers.filter(u => u.role === "student").length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "suspended": return "bg-red-100 text-red-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "alumni": return "bg-blue-100 text-blue-800"
      case "student": return "bg-purple-100 text-purple-800"
      case "admin": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    )
  }

  const handleApproveUser = (userId: string, userName: string) => {
    addNotification({
      type: "system",
      title: "User approved",
      description: `${userName} has been approved and can now access the platform`,
      isRead: false
    })
    // In real app, would make API call
    console.log("Approved user:", userId)
  }

  const handleRejectUser = (userId: string, userName: string) => {
    addNotification({
      type: "system", 
      title: "User rejected",
      description: `${userName}'s profile has been rejected`,
      isRead: false
    })
    // In real app, would make API call
    console.log("Rejected user:", userId)
  }

  const handleUserAction = (action: string, user: any) => {
    switch (action) {
      case "view":
        setSelectedUser(user)
        setShowUserProfile(true)
        break
      case "approve":
        handleApproveUser(user.id, user.name)
        break
      case "reject":
        handleRejectUser(user.id, user.name)
        break
      case "suspend":
        addNotification({
          type: "system",
          title: "User suspended",
          description: `${user.name} has been temporarily suspended`,
          isRead: false
        })
        break
      case "activate":
        addNotification({
          type: "system",
          title: "User activated",
          description: `${user.name} has been reactivated`,
          isRead: false
        })
        break
      case "message":
        // Open message dialog
        break
      default:
        break
    }
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, approvals, and platform access
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => setShowCreateUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-lg font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-lg font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-lg font-bold">{stats.suspended}</p>
              <p className="text-xs text-muted-foreground">Suspended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold">{stats.alumni}</p>
              <p className="text-xs text-muted-foreground">Alumni</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-lg font-bold">{stats.students}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Approval 
              {pendingProfiles.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingProfiles.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                        <SelectItem value="student">Students</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedUsers.length > 0 && (
                      <Button 
                        variant="outline"
                        onClick={() => setShowBulkActions(true)}
                      >
                        Actions ({selectedUsers.length})
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{user.name}</p>
                                {user.verified && (
                                  <CheckCircle className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              {user.company && (
                                <p className="text-xs text-muted-foreground">
                                  {user.position} at {user.company}
                                </p>
                              )}
                              {user.major && (
                                <p className="text-xs text-muted-foreground">
                                  {user.major} • Class of {user.graduationYear}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(user.joinDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(user.lastLogin)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            {user.role === "alumni" ? (
                              <>
                                {user.stats.mentorships} mentorships • {user.stats.events} events
                              </>
                            ) : (
                              <>
                                {user.stats.applications} applications • {user.stats.connections} connections
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUserAction("view", user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction("message", user)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "pending" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleUserAction("approve", user)}>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUserAction("reject", user)}>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {user.status === "active" && (
                                <DropdownMenuItem onClick={() => handleUserAction("suspend", user)}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              )}
                              {user.status === "suspended" && (
                                <DropdownMenuItem onClick={() => handleUserAction("activate", user)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Profile Approvals</CardTitle>
                <CardContent className="p-0">
                  Profiles waiting for admin review and approval
                </CardContent>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingProfiles.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile.avatar} alt={profile.name} />
                          <AvatarFallback>
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{profile.name}</h4>
                          <p className="text-sm text-muted-foreground">{profile.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleColor(profile.role)}>
                              {profile.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {profile.major} • Class of {profile.graduationYear}
                            </span>
                          </div>
                          {profile.company && (
                            <p className="text-xs text-muted-foreground">
                              {profile.position} at {profile.company}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Submitted {formatDate(profile.submittedDate)} • {profile.reason}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUserAction("view", profile)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleUserAction("approve", profile)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUserAction("reject", profile)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <UserProfileDialog
        open={showUserProfile}
        onOpenChange={setShowUserProfile}
        user={selectedUser}
      />

      <CreateUserDialog
        open={showCreateUser}
        onOpenChange={setShowCreateUser}
      />

      <BulkActionDialog
        open={showBulkActions}
        onOpenChange={setShowBulkActions}
        selectedUsers={selectedUsers}
        onComplete={() => setSelectedUsers([])}
      />
    </div>
  )
}