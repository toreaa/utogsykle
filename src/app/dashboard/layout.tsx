import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/(auth)/actions/auth'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile with company
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) {
    // User has no company - show message
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow border">
          <h1 className="text-xl font-bold text-foreground mb-4">Ingen bedrift tilknyttet</h1>
          <p className="text-muted-foreground mb-4">
            Kontoen din er ikke tilknyttet noen bedrift ennå. Be din administrator om å sende deg en invitasjon.
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-primary hover:underline"
            >
              Logg ut
            </button>
          </form>
        </div>
      </div>
    )
  }

  const isAdmin = profile.role === 'company_admin' || profile.role === 'system_admin'

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          id: profile.id,
          full_name: profile.full_name,
          role: profile.role,
          companies: profile.companies,
        }}
        variant={isAdmin ? "admin" : "user"}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
