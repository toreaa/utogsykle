import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', user!.id)
    .single()

  // Get user's recent activities
  const { data: recentActivities } = await supabase
    .from('activities')
    .select('*, activity_types(*)')
    .eq('user_id', user!.id)
    .order('activity_date', { ascending: false })
    .limit(5)

  // Get user's active competitions
  const { data: myCompetitions } = await supabase
    .from('competition_participants')
    .select('*, competitions(*)')
    .eq('user_id', user!.id)

  const activeCompetitions = myCompetitions?.filter(
    cp => cp.competitions?.status === 'active'
  ) || []

  // Get user's streak
  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  // Get total points this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: monthlyStats } = await supabase
    .from('activities')
    .select('points')
    .eq('user_id', user!.id)
    .gte('activity_date', startOfMonth.toISOString().split('T')[0])

  const totalPointsThisMonth = monthlyStats?.reduce((sum, a) => sum + (a.points || 0), 0) || 0

  // Get kudos received
  const { count: kudosReceived } = await supabase
    .from('kudos')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', user!.id)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Hei, {profile?.full_name || 'der'}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Her er din aktivitetsoversikt.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-card overflow-hidden shadow rounded-lg p-5 border border-border">
          <dt className="text-sm font-medium text-muted-foreground truncate">Streak</dt>
          <dd className="mt-1 text-3xl font-semibold text-foreground">
            {streak?.current_streak || 0} dager
          </dd>
          <dd className="text-xs text-muted-foreground">
            Lengste: {streak?.longest_streak || 0} dager
          </dd>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg p-5 border border-border">
          <dt className="text-sm font-medium text-muted-foreground truncate">Poeng denne måneden</dt>
          <dd className="mt-1 text-3xl font-semibold text-foreground">
            {Math.round(totalPointsThisMonth)}
          </dd>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg p-5 border border-border">
          <dt className="text-sm font-medium text-muted-foreground truncate">Aktive konkurranser</dt>
          <dd className="mt-1 text-3xl font-semibold text-foreground">
            {activeCompetitions.length}
          </dd>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg p-5 border border-border">
          <dt className="text-sm font-medium text-muted-foreground truncate">Kudos mottatt</dt>
          <dd className="mt-1 text-3xl font-semibold text-foreground">
            {kudosReceived || 0}
          </dd>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activities */}
        <div className="bg-card shadow rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-medium text-foreground">Siste aktiviteter</h2>
            <Link href="/dashboard/activities" className="text-sm text-primary hover:text-primary/80">
              Se alle
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.activity_types?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.value} {activity.activity_types?.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-400">
                        +{Math.round(activity.points || 0)} poeng
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.activity_date).toLocaleDateString('nb-NO')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                <p>Ingen aktiviteter registrert ennå.</p>
                <Link
                  href="/dashboard/activities"
                  className="mt-2 inline-block text-sm text-primary hover:text-primary/80"
                >
                  Registrer din første aktivitet
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Active competitions */}
        <div className="bg-card shadow rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-medium text-foreground">Mine konkurranser</h2>
            <Link href="/dashboard/competitions" className="text-sm text-primary hover:text-primary/80">
              Se alle
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activeCompetitions.length > 0 ? (
              activeCompetitions.map((cp) => (
                <Link
                  key={cp.id}
                  href={`/dashboard/competitions/${cp.competitions?.id}`}
                  className="block px-6 py-4 hover:bg-muted/50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {cp.competitions?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cp.competitions?.type === 'individual' ? 'Individuell' :
                         cp.competitions?.type === 'team' ? 'Lag' : 'Avdeling'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Slutter {new Date(cp.competitions?.end_date || '').toLocaleDateString('nb-NO')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                <p>Du deltar ikke i noen konkurranser.</p>
                <Link
                  href="/dashboard/competitions"
                  className="mt-2 inline-block text-sm text-primary hover:text-primary/80"
                >
                  Finn en konkurranse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
