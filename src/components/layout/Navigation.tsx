import { useState } from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { useMobile } from '../ui/use-mobile'
import { Bell, Search, Menu, Home, Users, Calendar, Briefcase, MessageSquare, Settings, LogOut, User, BookOpen, Award, BarChart3, UserCheck, PlusCircle, Heart, Megaphone, MoreHorizontal, Newspaper } from 'lucide-react'

interface NavigationProps {
  currentScreen: string
  onScreenChange: (screen: string) => void
}

export function Navigation({ currentScreen, onScreenChange }: NavigationProps) {
  const { user, logout } = useAuth()
  const { unreadCount, messageCount } = useNotifications()
  const { isMobile, isTablet } = useMobile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getNavigationItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Home', icon: Home, priority: 1 },
      { id: 'directory', label: 'Directory', icon: Users, priority: 2 },
      { id: 'events', label: 'Events', icon: Calendar, priority: 3 },
      { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messageCount, priority: 4 },
    ]

    const roleSpecificItems = {
      student: [
        { id: 'opportunities', label: 'Jobs', icon: Briefcase, priority: 5 },
        { id: 'connect', label: 'Connect', icon: UserCheck, priority: 6 },
        { id: 'campus-news', label: 'News', icon: BookOpen, priority: 7 },
      ],
      alumni: [
        { id: 'jobs', label: 'Jobs', icon: Briefcase, priority: 5 },
        { id: 'post-opportunity', label: 'Post', icon: PlusCircle, priority: 6 },
        { id: 'mentorship', label: 'Mentor', icon: Award, priority: 7 },
      ],
      admin: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3, priority: 5 },
        { id: 'user-management', label: 'Users', icon: Users, priority: 6 },
        { id: 'news-management', label: 'News', icon: Newspaper, priority: 7 },
        { id: 'content-moderation', label: 'Moderate', icon: UserCheck, priority: 8 },
      ]
    }

    const allItems = [...commonItems, ...(roleSpecificItems[user?.role!] || [])]
    
    // For mobile, show only top 4 items plus a "More" option
    if (isMobile) {
      const primaryItems = allItems.sort((a, b) => a.priority - b.priority).slice(0, 4)
      const remainingItems = allItems.filter(item => !primaryItems.includes(item))
      
      if (remainingItems.length > 0) {
        primaryItems.push({ 
          id: 'more', 
          label: 'More', 
          icon: MoreHorizontal, 
          priority: 9,
          isMore: true,
          items: remainingItems 
        })
      }
      
      return primaryItems
    }
    
    return allItems
  }

  const navigationItems = getNavigationItems()

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-2 pt-2' : 'hidden lg:flex items-center space-x-2'}`}>
      {navigationItems.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.id}
            variant={currentScreen === item.id ? 'default' : 'ghost'}
            size={mobile ? 'default' : 'sm'}
            className={`${mobile ? 'justify-start h-11' : 'h-9 px-3'} ${currentScreen === item.id ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent/50'} relative transition-all duration-200`}
            onClick={() => {
              onScreenChange(item.id)
              if (mobile) setIsMobileMenuOpen(false)
            }}
          >
            <Icon className={`${mobile ? 'h-5 w-5 mr-3' : 'h-4 w-4 mr-2'}`} />
            <span className={mobile ? 'font-medium' : 'text-sm font-medium'}>{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                {item.badge > 99 ? '99+' : item.badge}
              </Badge>
            )}
          </Button>
        )
      })}
    </nav>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Top Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b mobile-sticky iphone-safe">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-semibold">AU</span>
              </div>
              <span className="text-lg font-semibold">AlumniUnite</span>
            </div>

            {/* Search & User */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 rounded-full"
                onClick={() => {/* Handle search */}}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                      <AvatarFallback className="text-xs font-medium">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                      <Badge variant="secondary" className="w-fit text-xs mt-1 capitalize">
                        {user?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onScreenChange('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onScreenChange('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t mobile-nav iphone-safe">
          <div className="flex items-center justify-around px-2 py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentScreen === item.id
              
              if (item.isMore) {
                return (
                  <Sheet key={item.id}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex-1 flex flex-col items-center justify-center h-16 max-w-20 relative"
                      >
                        <Icon className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium truncate">{item.label}</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-auto">
                      <SheetHeader>
                        <SheetTitle>More Options</SheetTitle>
                      </SheetHeader>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {item.items?.map((moreItem) => {
                          const MoreIcon = moreItem.icon
                          return (
                            <Button
                              key={moreItem.id}
                              variant={currentScreen === moreItem.id ? 'default' : 'ghost'}
                              className="h-16 flex flex-col items-center justify-center relative"
                              onClick={() => onScreenChange(moreItem.id)}
                            >
                              <MoreIcon className="h-5 w-5 mb-1" />
                              <span className="text-xs font-medium">{moreItem.label}</span>
                              {moreItem.badge && moreItem.badge > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                                  {moreItem.badge > 99 ? '99+' : moreItem.badge}
                                </Badge>
                              )}
                            </Button>
                          )
                        })}
                      </div>
                    </SheetContent>
                  </Sheet>
                )
              }

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`flex-1 flex flex-col items-center justify-center h-16 max-w-20 relative transition-all duration-200 ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                  onClick={() => onScreenChange(item.id)}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </nav>
      </>
    )
  }

  // Desktop/Tablet Navigation
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mr-8">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">AU</span>
          </div>
          <span className="text-xl font-semibold hidden sm:block">AlumniUnite</span>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 flex justify-center">
          <NavItems />
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-3 ml-8">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64 h-9 bg-background/50 border-border/50 focus:bg-background focus:border-border transition-all"
            />
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-9 w-9 rounded-full hover:bg-accent/50 transition-colors"
            onClick={() => onScreenChange('notifications')}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-accent/50 transition-colors">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                  <AvatarFallback className="text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <p className="font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge variant="secondary" className="w-fit text-xs mt-2 capitalize">
                    {user?.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onScreenChange('profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onScreenChange('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}