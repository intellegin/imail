import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ErrorCardProps {
  title: string
  description: string
  error: string
  onRetry: () => void
}

export const ErrorCard = ({
  title,
  description,
  error,
  onRetry,
}: ErrorCardProps) => (
  <div className="w-full mt-10 px-2 md:px-4 mx-auto">
    <Card className="border-destructive w-full">
      <CardHeader>
        <CardTitle className="text-destructive">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline">
          Retry
        </Button>
      </CardContent>
    </Card>
  </div>
)
