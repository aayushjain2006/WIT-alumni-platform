import { useState } from "react"
import { Heart, Calendar, CreditCard, Building, Lock, Gift, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { useNotifications } from "../../contexts/NotificationContext"

const monthlyAmounts = [25, 50, 100, 250, 500]
const frequencies = [
  { value: "monthly", label: "Monthly", description: "12 donations per year" },
  { value: "quarterly", label: "Quarterly", description: "4 donations per year" },
  { value: "annually", label: "Annually", description: "1 donation per year" }
]

interface RecurringDonationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign?: any
}

export function RecurringDonationDialog({ open, onOpenChange, campaign }: RecurringDonationDialogProps) {
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("")
  
  const [formData, setFormData] = useState({
    amount: "",
    customAmount: "",
    frequency: "monthly",
    purpose: campaign?.title || "General Fund",
    paymentMethod: "credit-card",
    startDate: "",
    endDate: "",
    anonymous: false,
    updates: true,
    // Payment details
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: ""
  })

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount.toString())
    setFormData(prev => ({ ...prev, amount: amount.toString(), customAmount: "" }))
  }

  const handleCustomAmount = (value: string) => {
    setSelectedAmount("")
    setFormData(prev => ({ ...prev, customAmount: value, amount: "" }))
  }

  const getFinalAmount = () => {
    return parseFloat(formData.amount || formData.customAmount || "0")
  }

  const getAnnualTotal = () => {
    const amount = getFinalAmount()
    switch (formData.frequency) {
      case "monthly": return amount * 12
      case "quarterly": return amount * 4
      case "annually": return amount
      default: return amount * 12
    }
  }

  const getNextPaymentDate = () => {
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    return nextMonth.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))

    const amount = getFinalAmount()
    const annualTotal = getAnnualTotal()
    
    // Add notification
    addNotification({
      type: "system",
      title: "Recurring donation set up successfully!",
      description: `Your ${formData.frequency} ₹${amount} donation${campaign ? ` to ${campaign.title}` : ''} is now active. Thank you for your ongoing support!`,
      isRead: false,
      actionUrl: "/donations"
    })

    // Reset form
    setFormData({
      amount: "",
      customAmount: "",
      frequency: "monthly",
      purpose: campaign?.title || "General Fund",
      paymentMethod: "credit-card",
      startDate: "",
      endDate: "",
      anonymous: false,
      updates: true,
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingName: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZip: ""
    })
    setSelectedAmount("")

    setIsSubmitting(false)
    onOpenChange(false)

    // In real app, this would set up the recurring payment
    console.log("Recurring donation set up:", { ...formData, campaign, amount, annualTotal })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Set Up Recurring Donation
          </DialogTitle>
          <DialogDescription>
            {campaign 
              ? `Set up automatic recurring donations to support ${campaign.title}`
              : "Make a lasting impact with automatic recurring donations"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Benefits Banner */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Why Give Monthly?</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Provides predictable funding for ongoing programs</li>
                    <li>• Spreads your impact throughout the year</li>
                    <li>• Easy to manage and modify anytime</li>
                    <li>• Maximize your annual giving with smaller amounts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Info */}
          {campaign && (
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {campaign.image && (
                    <img 
                      src={campaign.image} 
                      alt={campaign.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{campaign.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                    <Badge className="bg-green-100 text-green-800">
                      Ongoing Campaign
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Donation Amount */}
          <div className="space-y-4">
            <Label>Donation Amount</Label>
            
            {/* Predefined Amounts */}
            <div className="grid grid-cols-5 gap-3">
              {monthlyAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount.toString() ? "default" : "outline"}
                  className="h-16 flex-col"
                  onClick={() => handleAmountSelect(amount)}
                >
                  <span className="font-bold">₹{amount}</span>
                  <span className="text-xs">per month</span>
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="customAmount">Custom Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="customAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={formData.customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-4">
            <Label>Donation Frequency</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {frequencies.map((freq) => (
                <Card 
                  key={freq.value}
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    formData.frequency === freq.value ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, frequency: freq.value }))}
                >
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-medium">{freq.label}</p>
                    <p className="text-xs text-muted-foreground">{freq.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Impact Projection */}
          {getFinalAmount() > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-3">Your Annual Impact</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Per {formData.frequency.replace('ly', '')}</p>
                    <p className="font-bold text-blue-800">₹{getFinalAmount()}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Annual Total</p>
                    <p className="font-bold text-blue-800">₹{getAnnualTotal()}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  Your ₹{getAnnualTotal()} annual contribution could help support approximately {Math.floor(getAnnualTotal() / 500)} students!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.startDate || getNextPaymentDate()}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                min={formData.startDate || getNextPaymentDate()}
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Leave blank for ongoing donations</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  formData.paymentMethod === "credit-card" ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "credit-card" }))}
              >
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">Credit Card</p>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  formData.paymentMethod === "bank-transfer" ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "bank-transfer" }))}
              >
                <CardContent className="p-4 text-center">
                  <Building className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">Bank Transfer</p>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  formData.paymentMethod === "paypal" ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "paypal" }))}
              >
                <CardContent className="p-4 text-center">
                  <Gift className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">PayPal</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Details - Credit Card */}
          {formData.paymentMethod === "credit-card" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Secure SSL encrypted payment</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Billing Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="billingName">Full Name</Label>
                    <Input
                      id="billingName"
                      placeholder="John Doe"
                      value={formData.billingName}
                      onChange={(e) => setFormData(prev => ({ ...prev, billingName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="billingAddress">Address</Label>
                    <Input
                      id="billingAddress"
                      placeholder="123 Main Street"
                      value={formData.billingAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, billingAddress: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingCity">City</Label>
                    <Input
                      id="billingCity"
                      placeholder="City"
                      value={formData.billingCity}
                      onChange={(e) => setFormData(prev => ({ ...prev, billingCity: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingState">State</Label>
                    <Input
                      id="billingState"
                      placeholder="State"
                      value={formData.billingState}
                      onChange={(e) => setFormData(prev => ({ ...prev, billingState: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.anonymous}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: !!checked }))}
              />
              <Label htmlFor="anonymous">Make donations anonymous</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="updates"
                checked={formData.updates}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, updates: !!checked }))}
              />
              <Label htmlFor="updates">Receive updates on impact and program progress</Label>
            </div>
          </div>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Recurring Donation Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount per {formData.frequency.replace('ly', '')}</span>
                  <span>₹{getFinalAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frequency</span>
                  <span>{formData.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Annual Total</span>
                  <span>${getAnnualTotal().toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>First Payment</span>
                  <span>{formData.startDate || getNextPaymentDate()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || getFinalAmount() === 0}
              className="min-w-[140px]"
            >
              {isSubmitting ? "Setting up..." : "Set Up Recurring Donation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}