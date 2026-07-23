import { useState } from "react"
import { Plus, Briefcase, Calendar, Users, Zap } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { PostOpportunityDialog } from "./PostOpportunityDialog"

interface QuickPostWidgetProps {
  className?: string
}

export function QuickPostWidget({ className }: QuickPostWidgetProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedType, setSelectedType] = useState<"job" | "internship" | "project">("job")

  const quickOptions = [
    {
      type: "job" as const,
      title: "Post Job",
      description: "Full-time or part-time positions",
      icon: Briefcase,
      color: "bg-blue-500",
      gradient: "from-blue-500/10 to-blue-600/5"
    },
    {
      type: "internship" as const,
      title: "Post Internship",
      description: "Summer, fall, or spring programs",
      icon: Calendar,
      color: "bg-green-500",
      gradient: "from-green-500/10 to-green-600/5"
    },
    {
      type: "project" as const,
      title: "Post Project",
      description: "Research or collaboration opportunities",
      icon: Users,
      color: "bg-purple-500",
      gradient: "from-purple-500/10 to-purple-600/5"
    }
  ]

  const handleQuickPost = (type: "job" | "internship" | "project") => {
    setSelectedType(type)
    setShowDialog(true)
  }

  return (
    <>
      <Card className={`${className} border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 hover:border-primary/30 transition-all duration-200`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Quick Post
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quickly post a new opportunity to reach talented students
          </p>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {quickOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.type}
                variant="ghost"
                className={`w-full h-auto p-4 sm:p-5 justify-start bg-gradient-to-r ${option.gradient} hover:bg-gradient-to-r hover:${option.gradient.replace('/10', '/15').replace('/5', '/10')} border border-border/50 hover:border-border transition-all duration-200`}
                onClick={() => handleQuickPost(option.type)}
              >
                <div className="flex items-center gap-3 sm:gap-4 w-full">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg ${option.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-medium text-sm sm:text-base">{option.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      <PostOpportunityDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        initialType={selectedType}
      />
    </>
  )
}