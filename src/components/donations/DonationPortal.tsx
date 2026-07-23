import { useState, useMemo } from "react"
import { Heart, Users, Award, TrendingUp, Calendar, Target, Gift, CreditCard, Building } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Separator } from "../ui/separator"
import { useAuth } from "../../contexts/AuthContext"
import { DonationDialog } from "./DonationDialog"
import { RecurringDonationDialog } from "./RecurringDonationDialog"
import { CampaignCard } from "./CampaignCard"

const mockCampaigns = [
  {
    id: "campaign-1",
    title: "Student Emergency Fund",
    description: "Supporting students facing unexpected financial hardships with emergency grants for tuition, housing, and basic needs.",
    category: "Student Support",
    goal: 100000,
    raised: 78500,
    donors: 156,
    daysLeft: 45,
    featured: true,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
    urgency: "high",
    impact: "Direct financial assistance to 50+ students this semester"
  },
  {
    id: "campaign-2",
    title: "New Innovation Lab",
    description: "Building a state-of-the-art innovation lab with cutting-edge technology for engineering and computer science students.",
    category: "Infrastructure", 
    goal: 500000,
    raised: 245000,
    donors: 89,
    daysLeft: 120,
    featured: true,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    urgency: "medium",
    impact: "Enhanced learning for 500+ students annually"
  },
  {
    id: "campaign-3",
    title: "Diversity & Inclusion Scholarship",
    description: "Providing full scholarships to underrepresented students in STEM fields to promote diversity and inclusion.",
    category: "Scholarships",
    goal: 200000,
    raised: 167000,
    donors: 234,
    daysLeft: 30,
    featured: false,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    urgency: "high",
    impact: "10 full scholarships for qualified students"
  },
  {
    id: "campaign-4",
    title: "Alumni Mentorship Program",
    description: "Expanding our mentorship program to connect more alumni with current students for career guidance and support.",
    category: "Programs",
    goal: 75000,
    raised: 52000,
    donors: 67,
    daysLeft: 75,
    featured: false,
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=400&fit=crop",
    urgency: "low",
    impact: "200+ new mentor-mentee connections"
  }
]

const mockDonationHistory = [
  {
    id: "donation-1",
    amount: 500,
    date: "2024-02-10T10:00:00Z",
    campaign: "Student Emergency Fund",
    type: "one-time",
    method: "Credit Card",
    status: "completed"
  },
  {
    id: "donation-2",
    amount: 100,
    date: "2024-01-15T14:00:00Z",
    campaign: "General Fund",
    type: "recurring",
    method: "Bank Transfer",
    status: "active"
  },
  {
    id: "donation-3",
    amount: 250,
    date: "2023-12-20T09:00:00Z",
    campaign: "Innovation Lab",
    type: "one-time", 
    method: "Credit Card",
    status: "completed"
  }
]

const impactStats = {
  totalDonated: 2850,
  studentsHelped: 12,
  campaignsSupported: 5,
  donationsSinceGraduation: 8,
  rank: "Gold Supporter",
  yearlyGoal: 5000,
  monthlyAverage: 237
}

const quickDonationAmounts = [25, 50, 100, 250, 500, 1000]

interface DonationPortalProps {
  className?: string
}

export function DonationPortal({ className }: DonationPortalProps) {
  const { user } = useAuth()
  const [showDonationDialog, setShowDonationDialog] = useState(false)
  const [showRecurringDialog, setShowRecurringDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("campaigns")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    if (categoryFilter === "all") return mockCampaigns
    return mockCampaigns.filter(campaign => campaign.category === categoryFilter)
  }, [categoryFilter])

  const categories = [...new Set(mockCampaigns.map(c => c.category))]

  const handleDonate = (campaign?: any, amount?: number) => {
    setSelectedCampaign(campaign)
    setShowDonationDialog(true)
  }

  const handleRecurringDonation = (campaign?: any) => {
    setSelectedCampaign(campaign)
    setShowRecurringDialog(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const calculateProgress = (raised: number, goal: number) => {
    return (raised / goal) * 100
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Make a Difference</h1>
            <p className="text-muted-foreground">
              Support your alma mater and help current students achieve their dreams
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleRecurringDonation()}>
              <Heart className="h-4 w-4 mr-2" />
              Monthly Giving
            </Button>
            <Button onClick={() => handleDonate()}>
              <Gift className="h-4 w-4 mr-2" />
              Donate Now
            </Button>
          </div>
        </div>

        {/* Impact Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Impact Summary
              </h3>
              <Badge className="bg-yellow-100 text-yellow-800">
                {impactStats.rank}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">₹{impactStats.totalDonated.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Donated</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{impactStats.studentsHelped}</p>
                <p className="text-sm text-muted-foreground">Students Helped</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{impactStats.campaignsSupported}</p>
                <p className="text-sm text-muted-foreground">Campaigns Supported</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{impactStats.donationsSinceGraduation}</p>
                <p className="text-sm text-muted-foreground">Donations Made</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>2024 Goal Progress</span>
                <span>₹{impactStats.totalDonated} / ₹{impactStats.yearlyGoal}</span>
              </div>
              <Progress value={(impactStats.totalDonated / impactStats.yearlyGoal) * 100} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Donation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l-1 18H7L6 3z"/>
                <path d="M9 7h6"/>
                <path d="M9 11h4"/>
              </svg>
              Quick Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {quickDonationAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="h-16 flex-col"
                  onClick={() => handleDonate(null, amount)}
                >
                  <span className="font-bold">₹{amount}</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handleDonate()}>
                Custom Amount
              </Button>
              <Button variant="outline" onClick={() => handleRecurringDonation()}>
                Monthly Giving
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="history">Donation History</TabsTrigger>
            <TabsTrigger value="impact">Impact Report</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {/* Campaign Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={categoryFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter("all")}
                  >
                    All Campaigns
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Campaigns */}
            <div>
              <h3 className="mb-4">Featured Campaigns</h3>
              <div className="grid gap-6">
                {filteredCampaigns
                  .filter(campaign => campaign.featured)
                  .map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onDonate={handleDonate}
                      featured
                    />
                  ))}
              </div>
            </div>

            {/* All Campaigns */}
            <div>
              <h3 className="mb-4">All Campaigns</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCampaigns
                  .filter(campaign => !campaign.featured)
                  .map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onDonate={handleDonate}
                    />
                  ))}
              </div>
            </div>

            {filteredCampaigns.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="mb-2">No campaigns found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    No campaigns match your current filter criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDonationHistory.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Heart className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">₹{donation.amount}</h4>
                          <p className="text-sm text-muted-foreground">{donation.campaign}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(donation.date)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {donation.type}
                            </Badge>
                            <Badge 
                              className={`text-xs ${
                                donation.status === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {donation.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{donation.method}</p>
                        {donation.type === "recurring" && donation.status === "active" && (
                          <Button variant="outline" size="sm" className="mt-2">
                            Manage
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid gap-6">
              {/* Annual Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your 2024 Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{impactStats.studentsHelped}</p>
                      <p className="text-sm text-muted-foreground">Students Directly Helped</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Through emergency grants and scholarships
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <Award className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">3</p>
                      <p className="text-sm text-muted-foreground">Scholarships Funded</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Full or partial scholarship support
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <Building className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">2</p>
                      <p className="text-sm text-muted-foreground">Facilities Improved</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lab upgrades and new equipment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recognition */}
              <Card>
                <CardHeader>
                  <CardTitle>Recognition & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                      <Award className="h-8 w-8 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">Gold Supporter Status</h4>
                        <p className="text-sm text-muted-foreground">
                          Achieved through consistent annual giving above ₹2,500
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <Heart className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">5-Year Giving Society</h4>
                        <p className="text-sm text-muted-foreground">
                          Member since 2019 - Thank you for your continued support!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goal Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    2024 Giving Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress toward annual goal</span>
                      <span>₹{impactStats.totalDonated} / ₹{impactStats.yearlyGoal}</span>
                    </div>
                    <Progress value={(impactStats.totalDonated / impactStats.yearlyGoal) * 100} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Monthly Average</p>
                      <p className="font-medium">₹{impactStats.monthlyAverage}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-medium">₹{impactStats.yearlyGoal - impactStats.totalDonated}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <DonationDialog
        open={showDonationDialog}
        onOpenChange={setShowDonationDialog}
        campaign={selectedCampaign}
      />

      <RecurringDonationDialog
        open={showRecurringDialog}
        onOpenChange={setShowRecurringDialog}
        campaign={selectedCampaign}
      />
    </div>
  )
}