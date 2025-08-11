import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/lib/providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || 'AGI Client Website',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'AGI Client Website'}`,
  },
  description: 'Complete React website stack built by AGI Staffers',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'AGI Staffers' }],
  creator: 'AGI Staffers',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: process.env.NEXT_PUBLIC_APP_NAME || 'AGI Client Website',
    description: 'Complete React website stack built by AGI Staffers',
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'AGI Client Website',
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'AGI Client Website',
    description: 'Complete React website stack built by AGI Staffers',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}