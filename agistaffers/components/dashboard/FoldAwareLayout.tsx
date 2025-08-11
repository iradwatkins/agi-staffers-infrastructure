'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useFoldDetection } from '@/hooks/use-fold-detection'
import { cn } from '@/lib/utils'

interface FoldAwareLayoutProps {
  children: ReactNode
  className?: string
}

export function FoldAwareLayout({ children, className }: FoldAwareLayoutProps) {
  const { isFolded, isUnfolded, isTablet, isDesktop, orientation } = useFoldDetection()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use default desktop styles until mounted to prevent hydration mismatch
  const shouldUseDesktopStyles = !mounted || isDesktop
  const effectiveOrientation = mounted ? orientation : 'landscape'

  return (
    <div
      className={cn(
        'transition-all duration-300',
        {
          // Apply responsive styles only after mounting
          'px-4 py-2': mounted && isFolded,
          'px-6 py-4': mounted && isUnfolded,
          'px-8 py-6': mounted && isTablet,
          'px-12 py-8': shouldUseDesktopStyles,
          // Orientation specific styles
          'max-w-full': effectiveOrientation === 'portrait',
          'max-w-7xl mx-auto': effectiveOrientation === 'landscape' && (!mounted || !isFolded),
        },
        className
      )}
    >
      {/* Device state indicator (only in development and after mounting) */}
      {mounted && process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs z-50">
          {isFolded && 'Folded'}
          {isUnfolded && 'Unfolded'}
          {isTablet && 'Tablet'}
          {isDesktop && 'Desktop'}
          {' - '}
          {orientation}
        </div>
      )}
      
      {children}
    </div>
  )
}

// Grid component that adapts to fold state
export function FoldAwareGrid({ children, className }: FoldAwareLayoutProps) {
  const { isFolded, isUnfolded, isTablet } = useFoldDetection()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        'grid gap-4',
        {
          // Apply responsive styles only after mounting
          'grid-cols-1': mounted && isFolded,
          'grid-cols-1 md:grid-cols-2': mounted && isUnfolded,
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': mounted && isTablet,
          // Default grid until mounted
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': !mounted,
        },
        className
      )}
    >
      {children}
    </div>
  )
}

// Stack component that changes direction based on fold state
export function FoldAwareStack({ children, className }: FoldAwareLayoutProps) {
  const { isFolded } = useFoldDetection()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        'flex gap-4',
        {
          // Apply responsive styles only after mounting
          'flex-col': mounted && isFolded,
          'flex-col md:flex-row': !mounted || !isFolded,
        },
        className
      )}
    >
      {children}
    </div>
  )
}