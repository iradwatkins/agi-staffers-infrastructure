// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}