import { createClient } from '@/lib/supabase/server'

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user!.id)
    .single()

  const companyId = profile?.company_id

  // Calculate date ranges
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0)

  // Get all company users (only if companyId exists)
  let companyUsers: { id: string; full_name: string | null }[] = []
  let monthlyActivities: { user_id: string; points: number | null }[] = []
  let weeklyActivities: { user_id: string; points: number | null }[] = []
  let streaks: { user_id: string; current_streak: number | null }[] = []

  if (companyId) {
    const [usersRes, monthlyRes, weeklyRes, streaksRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name')
        .eq('company_id', companyId),
      supabase
        .from('activities')
        .select('user_id, points')
        .eq('company_id', companyId)
        .gte('activity_date', startOfMonth.toISOString().split('T')[0]),
      supabase
        .from('activities')
        .select('user_id, points')
        .eq('company_id', companyId)
        .gte('activity_date', startOfWeek.toISOString().split('T')[0]),
      supabase
        .from('streaks')
        .select('user_id, current_streak')
        .eq('company_id', companyId)
        .order('current_streak', { ascending: false })
    ])

    companyUsers = usersRes.data || []
    monthlyActivities = monthlyRes.data || []
    weeklyActivities = weeklyRes.data || []
    streaks = streaksRes.data || []
  }

  // Create user lookup
  const userLookup: Record<string, string> = {}
  companyUsers?.forEach((u) => {
    userLookup[u.id] = u.full_name || 'Ukjent'
  })

  // Aggregate monthly points
  const monthlyPoints: Record<string, number> = {}
  monthlyActivities?.forEach((a) => {
    monthlyPoints[a.user_id] = (monthlyPoints[a.user_id] || 0) + (a.points || 0)
  })

  const monthlyLeaderboard = Object.entries(monthlyPoints)
    .map(([userId, points]) => ({ userId, name: userLookup[userId], points }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)

  // Aggregate weekly points
  const weeklyPoints: Record<string, number> = {}
  weeklyActivities?.forEach((a) => {
    weeklyPoints[a.user_id] = (weeklyPoints[a.user_id] || 0) + (a.points || 0)
  })

  const weeklyLeaderboard = Object.entries(weeklyPoints)
    .map(([userId, points]) => ({ userId, name: userLookup[userId], points }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)

  // Streak leaderboard
  const streakLeaderboard = streaks
    ?.filter((s) => s.current_streak && s.current_streak > 0)
    .map((s) => ({
      userId: s.user_id,
      name: userLookup[s.user_id],
      streak: s.current_streak!,
    }))
    .slice(0, 10) || []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ledertavle</h1>
        <p className="mt-1 text-sm text-gray-500">
          Se hvem som leder i bedriften din.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly leaderboard */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Denne uken</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {weeklyLeaderboard.length > 0 ? (
              weeklyLeaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`px-6 py-4 flex justify-between items-center ${
                    entry.userId === user!.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-200 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(entry.points)} p
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Ingen aktivitet denne uken.
              </div>
            )}
          </div>
        </div>

        {/* Monthly leaderboard */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Denne måneden</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {monthlyLeaderboard.length > 0 ? (
              monthlyLeaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`px-6 py-4 flex justify-between items-center ${
                    entry.userId === user!.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-200 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(entry.points)} p
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Ingen aktivitet denne måneden.
              </div>
            )}
          </div>
        </div>

        {/* Streak leaderboard */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Beste streaks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {streakLeaderboard.length > 0 ? (
              streakLeaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`px-6 py-4 flex justify-between items-center ${
                    entry.userId === user!.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-200 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {entry.streak} dager
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Ingen aktive streaks.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
