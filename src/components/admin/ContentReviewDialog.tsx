import { useState } from "react"
import { Eye, CheckCircle, XCircle, Flag, User, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Card, CardContent } from "../ui/card"
import { Separator } from "../ui/separator"
import { useNotifications } from "../../contexts/NotificationContext"

interface ContentReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content?: any
}

export function ContentReviewDialog({ open, onOpenChange, content }: ContentReviewDialogProps) {
  const { addNotification } = useNotifications()
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!content) return null

  const handleAction = async (action: "approve" | "reject" | "flag") => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const actionMessages = {
      approve: "approved and published",
      reject: "rejected",
      flag: "flagged for further review"
    }

    addNotification({
      type: "system",
      title: `Content ${action}d`,
      description: `"${content.title}" has been ${actionMessages[action]}`,
      isRead: false
    })

    setIsSubmitting(false)
    setReviewNotes("")
    onOpenChange(false)

    // In real app, would make API call
    console.log(`Content ${action}:`, { contentId: content.id, notes: reviewNotes })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const getContentTypeDisplay = (type: string) => {
    const types: { [key: string]: string } = {
      alumni_story: "Alumni Story",
      job_posting: "Job Posting",
      event: "Event",
      announcement: "Announcement"
    }
    return types[type] || type
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "under_review": return "bg-orange-100 text-orange-800"
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Content Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2>{content.title}</h2>
                    <Badge className={getStatusColor(content.status)}>
                      {content.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(content.priority)}>
                      {content.priority} priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>Type: {getContentTypeDisplay(content.type)}</span>
                    <span>•</span>
                    <span>Submitted: {formatDate(content.submittedDate)}</span>
                    {content.category && (
                      <>
                        <span>•</span>
                        <span>Category: {content.category}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Flags */}
                  {content.flags && content.flags.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Content Flags:</span>
                      <div className="flex flex-wrap gap-2">
                        {content.flags.map((flag: string) => (
                          <Badge key={flag} className="bg-red-100 text-red-800 text-xs">
                            {flag.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Information */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={content.author.avatar} alt={content.author.name} />
                  <AvatarFallback>
                    {content.author.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{content.author.name}</h4>
                  <p className="text-sm text-muted-foreground">{content.author.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{content.author.role}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4">Content Details</h3>
              
              {/* Content Text */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Content</Label>
                  <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{content.content}</p>
                  </div>
                </div>

                {/* Additional Fields based on content type */}
                {content.type === "job_posting" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {content.company && (
                      <div>
                        <Label className="text-sm font-medium">Company</Label>
                        <p className="text-sm mt-1">{content.company}</p>
                      </div>
                    )}
                    {content.salary && (
                      <div>
                        <Label className="text-sm font-medium">Salary</Label>
                        <p className="text-sm mt-1">{content.salary}</p>
                      </div>
                    )}
                    {content.location && (
                      <div>
                        <Label className="text-sm font-medium">Location</Label>
                        <p className="text-sm mt-1">{content.location}</p>
                      </div>
                    )}
                  </div>
                )}

                {content.type === "event" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.eventDate && (
                      <div>
                        <Label className="text-sm font-medium">Event Date</Label>
                        <p className="text-sm mt-1">{formatDate(content.eventDate)}</p>
                      </div>
                    )}
                    {content.location && (
                      <div>
                        <Label className="text-sm font-medium">Location</Label>
                        <p className="text-sm mt-1">{content.location}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Report Information (if reported content) */}
          {content.reporter && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <h3 className="text-red-800 font-medium mb-4">Report Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-red-800">Reported By</Label>
                    <p className="text-sm text-red-700">{content.reporter.name} ({content.reporter.email})</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-red-800">Report Reason</Label>
                    <p className="text-sm text-red-700">{content.reportReason}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-red-800">Report Date</Label>
                    <p className="text-sm text-red-700">{formatDate(content.reportDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Notes */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <Textarea
                    id="reviewNotes"
                    placeholder="Add notes about your decision (optional)..."
                    rows={4}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => handleAction("flag")}
                disabled={isSubmitting}
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag for Review
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleAction("reject")}
                disabled={isSubmitting}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? "Processing..." : "Reject"}
              </Button>
              <Button 
                onClick={() => handleAction("approve")}
                disabled={isSubmitting}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? "Processing..." : "Approve & Publish"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}