'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { useAlertMonitoring } from '@/hooks/use-alert-monitoring'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'

function AlertMonitor({ children }: { children: React.ReactNode }) {
  useAlertMonitoring()
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchInterval: 5000, // Refetch every 5 seconds for real-time data
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        enableColorScheme
        storageKey="agi-theme"
      >
        <LanguageProvider>
          <AlertMonitor>
            {children}
          </AlertMonitor>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}