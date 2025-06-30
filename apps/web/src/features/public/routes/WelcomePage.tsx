import { Inbox } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoginButton } from '@/components/atoms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

const WelcomePage = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Inbox className="mx-auto h-12 w-auto text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome to iMAIL
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your secure and modern experience.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to access your dashboard securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginButton className="w-full" size="lg">
              Sign In with Auth0
            </LoginButton>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} iMAIL. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default WelcomePage
