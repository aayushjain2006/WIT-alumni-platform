import { useState } from "react"
import { Users, CheckCircle, XCircle, Mail, AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { useNotifications } from "../../contexts/NotificationContext"

interface BulkActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUsers: string[]
  onComplete: () => void
}

export function BulkActionDialog({ 
  open, 
  onOpenChange, 
  selectedUsers, 
  onComplete 
}: BulkActionDialogProps) {
  const { addNotification } = useNotifications()
  const [selectedAction, setSelectedAction] = useState("")
  const [message, setMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const actions = [
    {
      value: "approve",
      label: "Approve Users",
      description: "Approve selected pending users",
      icon: CheckCircle,
      color: "text-green-600",
      requiresMessage: false
    },
    {
      value: "reject",
      label: "Reject Users", 
      description: "Reject selected pending users",
      icon: XCircle,
      color: "text-red-600",
      requiresMessage: true
    },
    {
      value: "suspend",
      label: "Suspend Users",
      description: "Temporarily suspend selected users",
      icon: AlertTriangle,
      color: "text-yellow-600",
      requiresMessage: true
    },
    {
      value: "activate",
      label: "Activate Users",
      description: "Reactivate selected suspended users",
      icon: CheckCircle,
      color: "text-green-600",
      requiresMessage: false
    },
    {
      value: "message",
      label: "Send Message",
      description: "Send a message to selected users",
      icon: Mail,
      color: "text-blue-600",
      requiresMessage: true
    },
    {
      value: "delete",
      label: "Delete Users",
      description: "Permanently delete selected users",
      icon: Trash2,
      color: "text-red-600",
      requiresMessage: true
    }
  ]

  const selectedActionData = actions.find(action => action.value === selectedAction)

  const handleExecute = async () => {
    if (!selectedAction || (selectedActionData?.requiresMessage && !message.trim())) {
      return
    }

    setIsProcessing(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Add notification based on action
    const actionLabels: { [key: string]: string } = {
      approve: "approved",
      reject: "rejected", 
      suspend: "suspended",
      activate: "activated",
      message: "messaged",
      delete: "deleted"
    }

    addNotification({
      type: "system",
      title: `Bulk action completed`,
      description: `${selectedUsers.length} users have been ${actionLabels[selectedAction]}`,
      isRead: false
    })

    setIsProcessing(false)
    setSelectedAction("")
    setMessage("")
    onComplete()
    onOpenChange(false)

    // In real app, this would make an API call to perform the bulk action
    console.log("Bulk action:", { action: selectedAction, users: selectedUsers, message })
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "approve":
      case "activate":
        return "bg-green-50 border-green-200"
      case "reject":
      case "delete":
        return "bg-red-50 border-red-200"
      case "suspend":
        return "bg-yellow-50 border-yellow-200"
      case "message":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Actions
          </DialogTitle>
          <DialogDescription>
            Perform actions on {selectedUsers.length} selected user{selectedUsers.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Users Count */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{selectedUsers.length} users selected</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Selection */}
          <div className="space-y-2">
            <Label>Select Action</Label>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an action to perform" />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => {
                  const Icon = action.icon
                  return (
                    <SelectItem key={action.value} value={action.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${action.color}`} />
                        <span>{action.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Action Preview */}
          {selectedActionData && (
            <Card className={getActionColor(selectedAction)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <selectedActionData.icon className={`h-5 w-5 ${selectedActionData.color}`} />
                  <div>
                    <p className="font-medium">{selectedActionData.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedActionData.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message/Reason Input */}
          {selectedActionData?.requiresMessage && (
            <div className="space-y-2">
              <Label htmlFor="message">
                {selectedAction === "message" ? "Message" : "Reason"} *
              </Label>
              <Textarea
                id="message"
                placeholder={
                  selectedAction === "message" 
                    ? "Enter your message to send to selected users..."
                    : "Enter a reason for this action..."
                }
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              {selectedAction === "delete" && (
                <p className="text-sm text-red-600">
                  Warning: This action cannot be undone. User data will be permanently deleted.
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExecute}
              disabled={
                !selectedAction || 
                (selectedActionData?.requiresMessage && !message.trim()) ||
                isProcessing
              }
              variant={
                selectedAction === "delete" || selectedAction === "reject" || selectedAction === "suspend"
                  ? "destructive" 
                  : "default"
              }
            >
              {isProcessing ? "Processing..." : (
                selectedAction === "delete" ? "Delete Users" :
                selectedAction === "reject" ? "Reject Users" :
                selectedAction === "suspend" ? "Suspend Users" :
                "Execute Action"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}