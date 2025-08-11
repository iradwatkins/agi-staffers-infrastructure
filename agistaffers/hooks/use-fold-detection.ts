'use client'

import { useState, useEffect, useCallback } from 'react'

interface FoldState {
  isFolded: boolean
  isUnfolded: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
  width: number
  height: number
}

const FOLD_THRESHOLD = 653 // Samsung Galaxy Fold 6 folded width
const UNFOLDED_THRESHOLD = 768 // Unfolded width threshold

export function useFoldDetection() {
  // Always initialize with desktop state to prevent hydration mismatch
  const [foldState, setFoldState] = useState<FoldState>({
    isFolded: false,
    isUnfolded: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape',
    width: 1024,
    height: 768,
  })

  const detectState = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    
    setFoldState({
      isFolded: width <= FOLD_THRESHOLD,
      isUnfolded: width > FOLD_THRESHOLD && width <= UNFOLDED_THRESHOLD,
      isTablet: width > UNFOLDED_THRESHOLD && width <= 1023,
      isDesktop: width > 1023,
      orientation: width > height ? 'landscape' : 'portrait',
      width,
      height,
    })
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(detectState, 150)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    // Initial detection
    detectState()

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [detectState])

  return foldState
}