import { useState } from "react"
import { Heart, CreditCard, Building, Lock, Gift } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { useNotifications } from "../../contexts/NotificationContext"

const predefinedAmounts = [25, 50, 100, 250, 500, 1000]
const donationPurposes = [
  "General Fund",
  "Student Emergency Fund", 
  "Scholarship Fund",
  "Innovation Lab",
  "Campus Infrastructure",
  "Alumni Programs",
  "Research Initiatives"
]

interface DonationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign?: any
  initialAmount?: number
}

export function DonationDialog({ open, onOpenChange, campaign, initialAmount }: DonationDialogProps) {
  const { addNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(initialAmount?.toString() || "")
  
  const [formData, setFormData] = useState({
    amount: initialAmount?.toString() || "",
    customAmount: "",
    purpose: campaign?.title || "",
    paymentMethod: "credit-card",
    dedication: "",
    anonymous: false,
    updates: true,
    coverFees: true,
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
    const amount = parseFloat(formData.amount || formData.customAmount || "0")
    const fees = formData.coverFees ? amount * 0.029 + 0.30 : 0 // Typical payment processing fees
    return { amount, fees, total: amount + fees }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))

    const finalAmount = getFinalAmount()
    
    // Add notification
    addNotification({
      type: "system",
      title: "Donation successful!",
      description: `Thank you for your ₹${finalAmount.amount} donation${campaign ? ` to ${campaign.title}` : ''}. Your generosity makes a difference!`,
      isRead: false,
      actionUrl: "/donations"
    })

    // Reset form
    setFormData({
      amount: "",
      customAmount: "",
      purpose: "",
      paymentMethod: "credit-card",
      dedication: "",
      anonymous: false,
      updates: true,
      coverFees: true,
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

    // In real app, this would process the payment
    console.log("Donation processed:", { ...formData, campaign, finalAmount })
  }

  const { amount, fees, total } = getFinalAmount()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Make a Donation
          </DialogTitle>
          <DialogDescription>
            {campaign 
              ? `Support the ${campaign.title} campaign and make a difference`
              : "Your contribution helps support students and improve our university"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div className="flex items-center gap-4 text-sm">
                      <span>₹{campaign.raised?.toLocaleString()} raised</span>
                      <span>•</span>
                      <span>{campaign.donors} donors</span>
                      <span>•</span>
                      <span>{Math.round((campaign.raised / campaign.goal) * 100)}% of goal</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Donation Amount */}
          <div className="space-y-4">
            <Label>Donation Amount</Label>
            
            {/* Predefined Amounts */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount.toString() ? "default" : "outline"}
                  className="h-16 flex-col"
                  onClick={() => handleAmountSelect(amount)}
                >
                  <span className="font-bold">₹{amount}</span>
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

          {/* Purpose */}
          {!campaign && (
            <div className="space-y-2">
              <Label htmlFor="purpose">Donation Purpose</Label>
              <Select value={formData.purpose} onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select where your donation should go" />
                </SelectTrigger>
                <SelectContent>
                  {donationPurposes.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                  <div className="space-y-2">
                    <Label htmlFor="billingZip">ZIP Code</Label>
                    <Input
                      id="billingZip"
                      placeholder="12345"
                      value={formData.billingZip}
                      onChange={(e) => setFormData(prev => ({ ...prev, billingZip: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dedication */}
          <div className="space-y-2">
            <Label htmlFor="dedication">Dedication (Optional)</Label>
            <Textarea
              id="dedication"
              placeholder="In honor of... or In memory of..."
              rows={3}
              value={formData.dedication}
              onChange={(e) => setFormData(prev => ({ ...prev, dedication: e.target.value }))}
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coverFees"
                checked={formData.coverFees}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, coverFees: !!checked }))}
              />
              <Label htmlFor="coverFees">
                Cover processing fees (+₹{fees.toFixed(2)}) so 100% goes to the cause
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.anonymous}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: !!checked }))}
              />
              <Label htmlFor="anonymous">Make this donation anonymous</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="updates"
                checked={formData.updates}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, updates: !!checked }))}
              />
              <Label htmlFor="updates">Receive updates on how your donation is being used</Label>
            </div>
          </div>

          {/* Order Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Donation Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Donation Amount</span>
                  <span>₹{amount.toFixed(2)}</span>
                </div>
                {formData.coverFees && (
                  <div className="flex justify-between text-sm">
                    <span>Processing Fees</span>
                    <span>₹{fees.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
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
              disabled={isSubmitting || amount === 0}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Processing..." : `Donate ₹${total.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}