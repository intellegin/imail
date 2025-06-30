import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      default: 'size-8',
      sm: 'size-4',
      lg: 'size-12',
      icon: 'size-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', className)}
      >
        <Loader2 className={cn(spinnerVariants({ size }))} />
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

export { Spinner, spinnerVariants }
