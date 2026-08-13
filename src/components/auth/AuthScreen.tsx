import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen app-bg bg-background relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl"></div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-primary-foreground font-bold text-xl">AU</span>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">AlumniUnite</span>
          </div>
          <p className="text-muted-foreground">
            Connect with your alumni network
          </p>
        </div>

        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}