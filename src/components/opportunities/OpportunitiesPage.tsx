import { useState } from "react"
import { Search, Filter, Briefcase, GraduationCap, Users, Plus, TrendingUp, MapPin, Clock, Building2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { useAuth } from "../../contexts/AuthContext"
import { JobBoard } from "./JobBoard"
import { InternshipBoard } from "./InternshipBoard"
import { MentorshipHub } from "./MentorshipHub"
import { PostOpportunityDialog } from "./PostOpportunityDialog"

interface OpportunitiesPageProps {
  className?: string
}

export function OpportunitiesPage({ className }: OpportunitiesPageProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showPostDialog, setShowPostDialog] = useState(false)

  // Mock statistics data
  const stats = {
    totalJobs: 127,
    newJobsThisWeek: 18,
    totalInternships: 43,
    newInternshipsThisWeek: 8,
    activeMentorships: 89,
    newMentorshipRequests: 12
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Explore Opportunities</h1>
            <p className="text-muted-foreground">
              Discover jobs, internships, and mentorship opportunities from our alumni network
            </p>
          </div>
          {user?.role === 'alumni' && (
            <Button onClick={() => setShowPostDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post Opportunity
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Job Opportunities</p>
                  <p className="font-medium">{stats.totalJobs} available</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{stats.newJobsThisWeek} this week</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Internships</p>
                  <p className="font-medium">{stats.totalInternships} available</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{stats.newInternshipsThisWeek} this week</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mentorships</p>
                  <p className="font-medium">{stats.activeMentorships} connections</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{stats.newMentorshipRequests} requests</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search all opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs
              <Badge variant="secondary" className="ml-1">{stats.totalJobs}</Badge>
            </TabsTrigger>
            <TabsTrigger value="internships" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Internships
              <Badge variant="secondary" className="ml-1">{stats.totalInternships}</Badge>
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Mentorship
              <Badge variant="secondary" className="ml-1">{stats.activeMentorships}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <JobBoard searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="internships">
            <InternshipBoard searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="mentorship">
            <MentorshipHub searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Opportunity Dialog */}
      <PostOpportunityDialog 
        open={showPostDialog} 
        onOpenChange={setShowPostDialog}
      />
    </div>
  )
}