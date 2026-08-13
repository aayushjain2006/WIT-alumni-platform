import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigation } from './layout/Navigation'
import { ResponsiveContainer } from './ui/responsive-container'
import { StudentDashboard } from './dashboard/StudentDashboard'
import { AlumniDashboard } from './dashboard/AlumniDashboard'
import { AdminDashboard as OldAdminDashboard } from './dashboard/AdminDashboard'
import { AlumniDirectory } from './directory/AlumniDirectory'
import { EventsPage } from './events/EventsPage'
import { MessagesPage } from './messages/MessagesPage'
import { NotificationsPage } from './notifications/NotificationsPage'
import { OpportunitiesPage } from './opportunities/OpportunitiesPage'
import { AlumniConnect } from './connect/AlumniConnect'
import { CampusNews } from './news/CampusNews'
import { PostOpportunitiesPage } from './opportunities/PostOpportunitiesPage'
import { MentorshipDashboard } from './mentorship/MentorshipDashboard'
import { DonationPortal } from './donations/DonationPortal'
import { AlumniStories } from './stories/AlumniStories'
import { AdminDashboard } from './admin/AdminDashboard'
import { UserManagement } from './admin/UserManagement'
import { EventManagement } from './admin/EventManagement'
import { ContentModeration } from './admin/ContentModeration'
import { ReportsAnalytics } from './admin/ReportsAnalytics'
import { BroadcastAnnouncements } from './admin/BroadcastAnnouncements'
import { ExploreOpportunities } from './explore/ExploreOpportunities'
import { ConnectWithAlumni } from './connect/ConnectWithAlumni'
import { PostLoginPopup } from './PostLoginPopup'
import { FullScreenAlumniProfile } from './directory/FullScreenAlumniProfile'
import { mockAlumni } from './directory/AlumniDirectory'
import { ProfileScreen } from './profile/ProfileScreen'
import { SettingsScreen } from './settings/SettingsScreen'
import { NewsManagement } from './admin/NewsManagement'

export function MainApp() {
  const { user } = useAuth()
  const [currentScreen, setCurrentScreen] = useState('dashboard')
  const [visitedScreens, setVisitedScreens] = useState<Set<string>>(() => new Set(['dashboard']))
  const [isMobile, setIsMobile] = useState(false)
  const [showPostLoginPopup, setShowPostLoginPopup] = useState(false)
  const [selectedAlumniId, setSelectedAlumniId] = useState<string | null>(null)

  // Mobile detection and responsive handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show post-login popup on first visit
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenPostLoginPopup')
    if (!hasSeenPopup && user) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setShowPostLoginPopup(true)
        sessionStorage.setItem('hasSeenPostLoginPopup', 'true')
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [user])

  // Prevent zoom on double tap for mobile
  useEffect(() => {
    let lastTouchEnd = 0
    const preventZoom = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }
    
    document.addEventListener('touchend', preventZoom, { passive: false })
    return () => document.removeEventListener('touchend', preventZoom)
  }, [])

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard onNavigate={handleNavigate} />
      case 'alumni':
        return <AlumniDashboard onNavigate={handleNavigate} />
      case 'admin':
        return <AdminDashboard />
      default:
        return <StudentDashboard onNavigate={handleNavigate} />
    }
  }

  const getScreenElement = (screen: string) => {
    switch (screen) {
      case 'dashboard':
        return renderDashboard()
      case 'directory':
        return <AlumniDirectory onNavigate={handleNavigate} />
      case 'alumni-profile':
        const selectedAlumni = selectedAlumniId ? mockAlumni.find(a => a.id === selectedAlumniId) : null
        if (selectedAlumni) {
          return <FullScreenAlumniProfile 
            alumni={selectedAlumni} 
            onBack={() => {
              setCurrentScreen('directory')
              setSelectedAlumniId(null)
            }} 
          />
        }
        return <div className="p-8 text-center text-muted-foreground">Alumni not found</div>
      case 'events':
        return <EventsPage />
      case 'messages':
        return <MessagesPage />
      case 'notifications':
        return <NotificationsPage />
      case 'profile':
        return <ProfileScreen />
      case 'settings':
        return <SettingsScreen />
      
      // Student specific
      case 'opportunities':
        return <OpportunitiesPage />
      case 'connect':
        return <AlumniConnect />
      case 'campus-news':
        return <CampusNews />
      
      // Alumni specific
      case 'jobs':
        return <OpportunitiesPage />
      case 'post-opportunity':
        return <PostOpportunitiesPage />
      case 'mentorship':
        return <MentorshipDashboard />
      case 'donations':
        return <DonationPortal />
      case 'alumni-stories':
        return <AlumniStories />
      
      // Admin specific
      case 'analytics':
        return <ReportsAnalytics />
      case 'user-management':
        return <UserManagement />
      case 'event-management':
        return <EventManagement />
      case 'content-moderation':
        return <ContentModeration />
      case 'broadcast':
        return <BroadcastAnnouncements />
      case 'news-management':
        return <NewsManagement />
      
      // Special screens from dashboard
      case 'explore-opportunities':
        return <ExploreOpportunities onBack={() => setCurrentScreen('dashboard')} onNavigate={handleNavigate} />
      case 'connect-alumni':
        return <ConnectWithAlumni onBack={() => setCurrentScreen('dashboard')} />
      
      default:
        return renderDashboard()
    }
  }

  const allScreenIds = [
    'dashboard', 'directory', 'alumni-profile', 'events', 'messages', 'notifications',
    'profile', 'settings', 'opportunities', 'connect', 'campus-news',
    'jobs', 'post-opportunity', 'mentorship', 'donations', 'alumni-stories',
    'analytics', 'user-management', 'event-management', 'content-moderation',
    'broadcast', 'news-management', 'explore-opportunities', 'connect-alumni'
  ]

  const renderScreens = () => (
    <>
      {allScreenIds.filter(id => visitedScreens.has(id)).map(id => (
        <div key={id} className={id === currentScreen ? '' : 'hidden'}>
          {getScreenElement(id)}
        </div>
      ))}
    </>
  )

  const handleNavigateToJobs = () => {
    handleNavigate('opportunities')
  }

  const handleNavigateToEvents = () => {
    handleNavigate('events')
  }

  const handleNavigate = (screen: string, alumniId?: string) => {
    setVisitedScreens(prev => prev.has(screen) ? prev : new Set(prev).add(screen))
    setCurrentScreen(screen)
    if (alumniId) {
      setSelectedAlumniId(alumniId)
    }
  }

  return (
    <div className="min-h-screen app-bg bg-background">
      {/* Mobile-first navigation */}
      <Navigation currentScreen={currentScreen} onScreenChange={handleNavigate} />
      
      {/* Mobile-optimized main content */}
      <main className={`w-full ${isMobile ? 'mobile-app-container' : 'pb-6'}`}>
        {isMobile ? (
          <div className="px-4 py-4 space-y-4">
            {renderScreens()}
          </div>
        ) : (
          <ResponsiveContainer 
            size="full" 
            padding="xl"
            className="py-6 sm:py-8 lg:py-12"
          >
            <div className="space-y-6 sm:space-y-8">
              {renderScreens()}
            </div>
          </ResponsiveContainer>
        )}
      </main>

      {/* Mobile pull-to-refresh indicator */}
      {isMobile && (
        <div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 pointer-events-none transition-opacity duration-200 z-50"
          id="pull-to-refresh-indicator"
        />
      )}

      {/* Mobile-specific scroll indicator */}
      {isMobile && (
        <div className="fixed bottom-24 right-4 w-1 h-16 bg-border/20 rounded-full overflow-hidden">
          <div 
            className="w-full bg-primary transition-all duration-200 ease-out"
            style={{ 
              height: '20%',
              transform: 'translateY(0%)'
            }}
          />
        </div>
      )}

      {/* Post-login popup */}
      <PostLoginPopup
        isOpen={showPostLoginPopup}
        onClose={() => setShowPostLoginPopup(false)}
        onNavigateToJobs={handleNavigateToJobs}
        onNavigateToEvents={handleNavigateToEvents}
      />
    </div>
  )
}