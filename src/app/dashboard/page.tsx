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
        <h1 className="text-2xl font-bold text-gray-900">
          Hei, {profile?.full_name || 'der'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Her er din aktivitetsoversikt.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Streak</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {streak?.current_streak || 0} dager
          </dd>
          <dd className="text-xs text-gray-500">
            Lengste: {streak?.longest_streak || 0} dager
          </dd>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Poeng denne måneden</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {Math.round(totalPointsThisMonth)}
          </dd>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Aktive konkurranser</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {activeCompetitions.length}
          </dd>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Kudos mottatt</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {kudosReceived || 0}
          </dd>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Siste aktiviteter</h2>
            <Link href="/dashboard/activities" className="text-sm text-blue-600 hover:text-blue-500">
              Se alle
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.activity_types?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.value} {activity.activity_types?.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        +{Math.round(activity.points || 0)} poeng
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.activity_date).toLocaleDateString('nb-NO')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>Ingen aktiviteter registrert ennå.</p>
                <Link
                  href="/dashboard/activities"
                  className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-500"
                >
                  Registrer din første aktivitet
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Active competitions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Mine konkurranser</h2>
            <Link href="/dashboard/competitions" className="text-sm text-blue-600 hover:text-blue-500">
              Se alle
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {activeCompetitions.length > 0 ? (
              activeCompetitions.map((cp) => (
                <Link
                  key={cp.id}
                  href={`/dashboard/competitions/${cp.competitions?.id}`}
                  className="block px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {cp.competitions?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cp.competitions?.type === 'individual' ? 'Individuell' :
                         cp.competitions?.type === 'team' ? 'Lag' : 'Avdeling'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Slutter {new Date(cp.competitions?.end_date || '').toLocaleDateString('nb-NO')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>Du deltar ikke i noen konkurranser.</p>
                <Link
                  href="/dashboard/competitions"
                  className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-500"
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
