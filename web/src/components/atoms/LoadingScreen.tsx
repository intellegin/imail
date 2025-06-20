import { Spinner } from '../ui/spinner'

export const LoadingScreen = ({ className }: { className?: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner size="lg" className={className} />
    </div>
  )
}
