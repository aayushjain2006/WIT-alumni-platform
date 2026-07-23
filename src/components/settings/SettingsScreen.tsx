import { useState } from "react"
import { 
  Bell, 
  Shield, 
  User, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  Mail, 
  Smartphone, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  Download,
  AlertTriangle
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Switch } from "../ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { useMobile } from "../ui/use-mobile"
import { toast } from "sonner@2.0.3"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "../ui/alert-dialog"

interface SettingsScreenProps {
  onBack?: () => void
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { user, logout } = useAuth()
  const { isMobile } = useMobile()
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      jobAlerts: true,
      eventReminders: true,
      messageNotifications: true,
      weeklyDigest: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'public', // public, alumni-only, private
      showEmail: false,
      showLocation: true,
      showGraduation: true,
      allowMessaging: true,
      allowMentorshipRequests: true
    },
    appearance: {
      darkMode: false,
      language: 'en',
      timezone: 'auto'
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: '30days'
    }
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    toast.success("Setting updated!")
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  const handleDeleteAccount = () => {
    // In real app, this would call an API to delete the account
    toast.error("Account deletion is not implemented in this demo")
  }

  const handleExportData = () => {
    // In real app, this would trigger a data export
    toast.success("Data export will be sent to your email")
  }

  if (!user) return null

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    children, 
    badge 
  }: { 
    icon: any, 
    title: string, 
    description?: string, 
    children: React.ReactNode,
    badge?: string 
  }) => (
    <div className={`flex items-center justify-between ${isMobile ? 'py-4' : 'py-3'}`}>
      <div className="flex items-start space-x-3 flex-1">
        <Icon className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-muted-foreground mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className={`font-medium ${isMobile ? 'text-base' : 'text-sm'}`}>{title}</h4>
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
          </div>
          {description && (
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-xs'} mt-1`}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="mobile-sticky bg-background/95 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">Settings</h1>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="space-y-1">
          {/* Account Section */}
          <div className="bg-background">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-muted-foreground">Account</h2>
            </div>
            <div className="divide-y">
              <div className="px-4">
                <SettingItem
                  icon={User}
                  title="Profile Information"
                  description="Update your personal details"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </SettingItem>
              </div>
              
              <div className="px-4">
                <SettingItem
                  icon={Lock}
                  title="Password & Security"
                  description="Manage your account security"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={Shield}
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security"
                  badge={settings.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                >
                  <Switch
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => 
                      updateSetting('security', 'twoFactorEnabled', checked)
                    }
                  />
                </SettingItem>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-background">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-muted-foreground">Notifications</h2>
            </div>
            <div className="divide-y">
              <div className="px-4">
                <SettingItem
                  icon={Smartphone}
                  title="Push Notifications"
                  description="Receive notifications on your device"
                >
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      updateSetting('notifications', 'pushNotifications', checked)
                    }
                  />
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive updates via email"
                >
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      updateSetting('notifications', 'emailNotifications', checked)
                    }
                  />
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={Bell}
                  title="Job Alerts"
                  description="Get notified about new opportunities"
                >
                  <Switch
                    checked={settings.notifications.jobAlerts}
                    onCheckedChange={(checked) => 
                      updateSetting('notifications', 'jobAlerts', checked)
                    }
                  />
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={Bell}
                  title="Event Reminders"
                  description="Reminders for upcoming events"
                >
                  <Switch
                    checked={settings.notifications.eventReminders}
                    onCheckedChange={(checked) => 
                      updateSetting('notifications', 'eventReminders', checked)
                    }
                  />
                </SettingItem>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-background">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-muted-foreground">Privacy</h2>
            </div>
            <div className="divide-y">
              <div className="px-4">
                <SettingItem
                  icon={Eye}
                  title="Profile Visibility"
                  description="Who can see your profile"
                >
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => 
                      updateSetting('privacy', 'profileVisibility', value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="alumni-only">Alumni Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={Mail}
                  title="Show Email Address"
                  description="Allow others to see your email"
                >
                  <Switch
                    checked={settings.privacy.showEmail}
                    onCheckedChange={(checked) => 
                      updateSetting('privacy', 'showEmail', checked)
                    }
                  />
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={User}
                  title="Allow Messages"
                  description="Let others send you messages"
                >
                  <Switch
                    checked={settings.privacy.allowMessaging}
                    onCheckedChange={(checked) => 
                      updateSetting('privacy', 'allowMessaging', checked)
                    }
                  />
                </SettingItem>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-background">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-muted-foreground">Appearance</h2>
            </div>
            <div className="divide-y">
              <div className="px-4">
                <SettingItem
                  icon={settings.appearance.darkMode ? Moon : Sun}
                  title="Dark Mode"
                  description="Switch to dark theme"
                >
                  <Switch
                    checked={settings.appearance.darkMode}
                    onCheckedChange={(checked) => {
                      updateSetting('appearance', 'darkMode', checked)
                      // In real app, this would toggle the actual dark mode
                      document.documentElement.classList.toggle('dark', checked)
                    }}
                  />
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={Globe}
                  title="Language"
                  description="Choose your preferred language"
                >
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) => 
                      updateSetting('appearance', 'language', value)
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">EN</SelectItem>
                      <SelectItem value="es">ES</SelectItem>
                      <SelectItem value="fr">FR</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingItem>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-background">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-muted-foreground">Support</h2>
            </div>
            <div className="divide-y">
              <div className="px-4">
                <SettingItem
                  icon={HelpCircle}
                  title="Help & Support"
                  description="Get help and contact support"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={Download}
                  title="Export Data"
                  description="Download your account data"
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportData}
                  >
                    Export
                  </Button>
                </SettingItem>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-background">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-destructive">Danger Zone</h2>
            </div>
            <div className="divide-y">
              <div className="px-4">
                <SettingItem
                  icon={LogOut}
                  title="Sign Out"
                  description="Sign out of your account"
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </SettingItem>
              </div>

              <div className="px-4">
                <SettingItem
                  icon={Trash2}
                  title="Delete Account"
                  description="Permanently delete your account"
                >
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </SettingItem>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">AlumniUnite v1.0.0</p>
            <p className="text-xs mt-1">© 2024 Alumni Platform</p>
          </div>
        </div>
      </div>
    )
  }

  // Desktop version
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem
              icon={User}
              title="Profile Information"
              description="Update your personal details and professional information"
            >
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Lock}
              title="Password & Security"
              description="Change your password and manage security settings"
            >
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Shield}
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              badge={settings.security.twoFactorEnabled ? "Enabled" : "Disabled"}
            >
              <Switch
                checked={settings.security.twoFactorEnabled}
                onCheckedChange={(checked) => 
                  updateSetting('security', 'twoFactorEnabled', checked)
                }
              />
            </SettingItem>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem
              icon={Smartphone}
              title="Push Notifications"
              description="Receive notifications on your device"
            >
              <Switch
                checked={settings.notifications.pushNotifications}
                onCheckedChange={(checked) => 
                  updateSetting('notifications', 'pushNotifications', checked)
                }
              />
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Mail}
              title="Email Notifications"
              description="Receive updates and alerts via email"
            >
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => 
                  updateSetting('notifications', 'emailNotifications', checked)
                }
              />
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Bell}
              title="Job Alerts"
              description="Get notified about new job opportunities"
            >
              <Switch
                checked={settings.notifications.jobAlerts}
                onCheckedChange={(checked) => 
                  updateSetting('notifications', 'jobAlerts', checked)
                }
              />
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Bell}
              title="Event Reminders"
              description="Receive reminders for upcoming events"
            >
              <Switch
                checked={settings.notifications.eventReminders}
                onCheckedChange={(checked) => 
                  updateSetting('notifications', 'eventReminders', checked)
                }
              />
            </SettingItem>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem
              icon={Eye}
              title="Profile Visibility"
              description="Control who can see your profile information"
            >
              <Select
                value={settings.privacy.profileVisibility}
                onValueChange={(value) => 
                  updateSetting('privacy', 'profileVisibility', value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="alumni-only">Alumni Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Mail}
              title="Show Email Address"
              description="Allow other users to see your email address"
            >
              <Switch
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked) => 
                  updateSetting('privacy', 'showEmail', checked)
                }
              />
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={User}
              title="Allow Direct Messages"
              description="Let other users send you direct messages"
            >
              <Switch
                checked={settings.privacy.allowMessaging}
                onCheckedChange={(checked) => 
                  updateSetting('privacy', 'allowMessaging', checked)
                }
              />
            </SettingItem>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Language</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem
              icon={settings.appearance.darkMode ? Moon : Sun}
              title="Dark Mode"
              description="Switch between light and dark themes"
            >
              <Switch
                checked={settings.appearance.darkMode}
                onCheckedChange={(checked) => {
                  updateSetting('appearance', 'darkMode', checked)
                  document.documentElement.classList.toggle('dark', checked)
                }}
              />
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Globe}
              title="Language"
              description="Choose your preferred language"
            >
              <Select
                value={settings.appearance.language}
                onValueChange={(value) => 
                  updateSetting('appearance', 'language', value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </SettingItem>
          </CardContent>
        </Card>

        {/* Support & Help */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              description="Get help, contact support, or view documentation"
            >
              <Button variant="outline" size="sm">
                Get Help
              </Button>
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Download}
              title="Export Account Data"
              description="Download a copy of your account data and activity"
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportData}
              >
                Export Data
              </Button>
            </SettingItem>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Danger Zone</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem
              icon={LogOut}
              title="Sign Out"
              description="Sign out of your account on this device"
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </SettingItem>
            
            <Separator />
            
            <SettingItem
              icon={Trash2}
              title="Delete Account"
              description="Permanently delete your account and all associated data"
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SettingItem>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}