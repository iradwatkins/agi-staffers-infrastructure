'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import type * as DialogTypes from './dialog'

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100" />
  </div>
)

// Client-only wrapper for Dialog components
function ClientDialogWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <>{children}</>
}

// Re-export the original Dialog components but wrapped to be client-only
const DynamicDialog = dynamic(
  () => import('./dialog').then((mod) => mod.Dialog),
  { ssr: false }
)

const DynamicDialogTrigger = dynamic(
  () => import('./dialog').then((mod) => mod.DialogTrigger),
  { ssr: false }
)

const DynamicDialogContent = dynamic(
  () => import('./dialog').then((mod) => mod.DialogContent),
  { ssr: false, loading: () => <LoadingSpinner /> }
)

const DynamicDialogHeader = dynamic(
  () => import('./dialog').then((mod) => mod.DialogHeader),
  { ssr: false }
)

const DynamicDialogFooter = dynamic(
  () => import('./dialog').then((mod) => mod.DialogFooter),
  { ssr: false }
)

const DynamicDialogTitle = dynamic(
  () => import('./dialog').then((mod) => mod.DialogTitle),
  { ssr: false }
)

const DynamicDialogDescription = dynamic(
  () => import('./dialog').then((mod) => mod.DialogDescription),
  { ssr: false }
)

const DynamicDialogClose = dynamic(
  () => import('./dialog').then((mod) => mod.DialogClose),
  { ssr: false }
)

// Export with same names for drop-in replacement
export const Dialog = DynamicDialog
export const DialogTrigger = DynamicDialogTrigger
export const DialogContent = DynamicDialogContent
export const DialogHeader = DynamicDialogHeader
export const DialogFooter = DynamicDialogFooter
export const DialogTitle = DynamicDialogTitle
export const DialogDescription = DynamicDialogDescription
export const DialogClose = DynamicDialogClose

// Also export the wrapper for direct use if needed
export { ClientDialogWrapper }