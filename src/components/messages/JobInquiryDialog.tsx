import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { MessageSquare, Briefcase, Building, Send, X } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface JobInquiry {
  jobId: string
  jobTitle: string
  company: string
  companyContact?: {
    id: string
    name: string
    title: string
    avatar?: string
  }
}

interface JobInquiryDialogProps {
  isOpen: boolean
  onClose: () => void
  jobInquiry: JobInquiry
  onConversationStart: (conversationId: string) => void
}

// Mock company contacts - in a real app, this would come from the job posting data
const getCompanyContact = (company: string) => {
  const contacts = {
    'TechCorp': {
      id: 'hr_techcorp',
      name: 'Sarah Chen',
      title: 'Senior Recruiter',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    'StartupX': {
      id: 'hr_startupx',
      name: 'Michael Rodriguez',
      title: 'HR Manager',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    'Goldman Sachs': {
      id: 'hr_goldman',
      name: 'Emily Watson',
      title: 'Talent Acquisition',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    'DesignStudio': {
      id: 'hr_design',
      name: 'James Park',
      title: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  }
  
  return contacts[company as keyof typeof contacts] || {
    id: 'hr_generic',
    name: 'HR Representative',
    title: 'Recruiter',
    avatar: undefined
  }
}

export function JobInquiryDialog({ isOpen, onClose, jobInquiry, onConversationStart }: JobInquiryDialogProps) {
  const [subject, setSubject] = useState(`Inquiry about ${jobInquiry.jobTitle} position`)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const companyContact = jobInquiry.companyContact || getCompanyContact(jobInquiry.company)

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create conversation ID
      const conversationId = `job_inquiry_${jobInquiry.jobId}_${Date.now()}`
      
      toast.success(`Message sent to ${companyContact.name}`)
      onConversationStart(conversationId)
      handleClose()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSubject(`Inquiry about ${jobInquiry.jobTitle} position`)
    setMessage('')
    setIsSubmitting(false)
    onClose()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  // Pre-written message templates
  const messageTemplates = [
    `Hi ${companyContact.name},

I'm very interested in the ${jobInquiry.jobTitle} position at ${jobInquiry.company}. I believe my background and skills would be a great fit for this role.

Could we schedule a time to discuss this opportunity further?

Best regards,`,
    
    `Hello ${companyContact.name},

I came across the ${jobInquiry.jobTitle} opening at ${jobInquiry.company} and I'm excited about the possibility of joining your team.

I'd love to learn more about the role requirements and share how my experience aligns with what you're looking for.

Thank you for your time,`,

    `Hi ${companyContact.name},

I'm reaching out regarding the ${jobInquiry.jobTitle} position. I'm particularly drawn to ${jobInquiry.company}'s mission and would appreciate the opportunity to discuss how I can contribute to your team.

Would you be available for a brief conversation?

Best,`
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact About Job Opportunity
          </DialogTitle>
          <DialogDescription>
            Send a message to the hiring team about this position
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          {/* Job Context Card */}
          <Card className="border-2 border-primary/10 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{jobInquiry.jobTitle}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{jobInquiry.company}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={companyContact.avatar} alt={companyContact.name} />
              <AvatarFallback>{getInitials(companyContact.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{companyContact.name}</p>
              <p className="text-sm text-muted-foreground">{companyContact.title}</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              {jobInquiry.company}
            </Badge>
          </div>

          {/* Message Templates */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Templates:</label>
            <div className="grid grid-cols-1 gap-2">
              {messageTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-2 justify-start text-xs"
                  onClick={() => setMessage(template)}
                >
                  Template {index + 1}: "{template.split('\n')[2]?.trim() || 'Professional inquiry'}"
                </Button>
              ))}
            </div>
          </div>

          {/* Subject Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject:</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line for your message"
              className="mobile-input"
            />
          </div>

          {/* Message Input */}
          <div className="space-y-2 flex-1 flex flex-col min-h-0">
            <label className="text-sm font-medium">Message:</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="flex-1 min-h-[120px] resize-none mobile-input"
            />
            <p className="text-xs text-muted-foreground">
              Be professional and specific about your interest in the role
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isSubmitting || !message.trim()}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}