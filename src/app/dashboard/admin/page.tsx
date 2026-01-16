import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function CompanyAdminDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, companies(*)')
    .eq('id', user!.id)
    .single()

  const companyId = profile?.company_id

  // Get stats (only if companyId exists)
  let usersCount = 0
  let activeCompetitionsCount = 0
  let activitiesThisWeek = 0
  let pendingInvitations = 0
  let activeUsersThisWeek = 0

  if (companyId) {
    const [usersRes, competitionsRes, activitiesRes, invitationsRes, activeUsersRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId),
      supabase
        .from('competitions')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('status', 'active'),
      supabase
        .from('activities')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('activity_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString()),
      supabase
        .from('activities')
        .select('user_id', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('activity_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    ])

    usersCount = usersRes.count || 0
    activeCompetitionsCount = competitionsRes.count || 0
    activitiesThisWeek = activitiesRes.count || 0
    pendingInvitations = invitationsRes.count || 0
    activeUsersThisWeek = activeUsersRes.count || 0
  }

  const participationRate = usersCount && usersCount > 0
    ? Math.round((activeUsersThisWeek || 0) / usersCount * 100)
    : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Bedriftsadministrasjon</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administrer {profile?.companies?.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">Brukere</dt>
                  <dd className="text-lg font-semibold text-foreground">{usersCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-muted px-5 py-3">
            <Link href="/dashboard/admin/users" className="text-sm font-medium text-primary hover:text-primary/80">
              Administrer brukere
            </Link>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">Aktive konkurranser</dt>
                  <dd className="text-lg font-semibold text-foreground">{activeCompetitionsCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-muted px-5 py-3">
            <Link href="/dashboard/admin/competitions" className="text-sm font-medium text-primary hover:text-primary/80">
              Administrer konkurranser
            </Link>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">Aktiviteter denne uken</dt>
                  <dd className="text-lg font-semibold text-foreground">{activitiesThisWeek || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">Deltakelse</dt>
                  <dd className="text-lg font-semibold text-foreground">{participationRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-card shadow rounded-lg p-6 mb-8 border border-border">
        <h2 className="text-lg font-medium text-foreground mb-4">Hurtighandlinger</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="glow-primary">
            <Link href="/dashboard/admin/users?invite=true">
              Inviter brukere
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/competitions/new">
              Opprett konkurranse
            </Link>
          </Button>
        </div>
      </div>

      {/* Pending invitations */}
      {(pendingInvitations || 0) > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-400">
                {pendingInvitations} ventende invitasjoner
              </h3>
              <p className="mt-1 text-sm text-yellow-400/80">
                Det er invitasjoner som venter på å bli akseptert.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
