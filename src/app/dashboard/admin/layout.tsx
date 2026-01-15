import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CompanyAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is company admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'company_admin' && profile?.role !== 'system_admin') {
    redirect('/dashboard')
  }

  return <>{children}</>
}
