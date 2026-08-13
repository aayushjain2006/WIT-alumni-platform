import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import { AuthScreen } from "./components/auth/AuthScreen"
import { ProfileSetup } from "./components/onboarding/ProfileSetup"
import { MainApp } from "./components/MainApp"

function AppContent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen app-bg bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-xs w-full">
          {/* Mobile-optimized loading */}
          <div className="relative mb-8">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
              <span className="text-primary-foreground text-lg sm:text-xl font-bold">AU</span>
            </div>
            <div className="absolute inset-0 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary/20 animate-ping mx-auto"></div>
          </div>
          <h3 className="font-medium mb-2 text-lg">Welcome back</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Loading your alumni network...
          </p>
          {/* Mobile loading indicators */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  if (!user.isProfileComplete) {
    return <ProfileSetup />
  }

  return <MainApp />
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen app-bg bg-background">
          {/* Mobile-first app container */}
          <div className="max-w-md mx-auto lg:max-w-none lg:mx-0">
            <AppContent />
          </div>
        </div>
      </NotificationProvider>
    </AuthProvider>
  )
}