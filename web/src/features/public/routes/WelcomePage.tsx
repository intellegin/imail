import { useAuth0 } from '@auth0/auth0-react'
import { Inbox, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const WelcomePage = () => {
  const { loginWithRedirect, isLoading } = useAuth0()

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
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Use your Auth0 account to securely sign in to your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => loginWithRedirect()}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Login'
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} INTELLEGIN. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default WelcomePage
