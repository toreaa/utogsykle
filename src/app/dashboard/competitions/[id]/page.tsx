import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import JoinLeaveButton from '../JoinLeaveButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CompetitionDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get competition
  const { data: competition } = await supabase
    .from('competitions')
    .select('*, activity_types(name, unit)')
    .eq('id', id)
    .single()

  if (!competition) {
    notFound()
  }

  // Check if user is participating
  const { data: participation } = await supabase
    .from('competition_participants')
    .select('id')
    .eq('competition_id', id)
    .eq('user_id', user!.id)
    .single()

  const isParticipating = !!participation

  // Get participants with their points
  const { data: participants } = await supabase
    .from('competition_participants')
    .select('*, profiles(id, full_name)')
    .eq('competition_id', id)

  // Get activities for leaderboard
  const { data: activities } = await supabase
    .from('activities')
    .select('user_id, points')
    .eq('company_id', competition.company_id)
    .gte('activity_date', competition.start_date)
    .lte('activity_date', competition.end_date)

  // Filter by activity type if specified
  const filteredActivities = competition.activity_type_id
    ? activities?.filter(a => a.user_id) // Would need to add activity_type_id filter
    : activities

  // Aggregate points per user
  const participantIds = new Set(participants?.map(p => (p.profiles as unknown as { id: string })?.id) || [])

  const userPoints: Record<string, { name: string; points: number }> = {}

  participants?.forEach((p) => {
    const profile = p.profiles as unknown as { id: string; full_name: string }
    if (profile?.id) {
      userPoints[profile.id] = {
        name: profile.full_name || 'Ukjent',
        points: 0,
      }
    }
  })

  filteredActivities?.forEach((activity) => {
    if (participantIds.has(activity.user_id) && userPoints[activity.user_id]) {
      userPoints[activity.user_id].points += activity.points || 0
    }
  })

  const sortedLeaderboard = Object.entries(userPoints)
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.points - a.points)

  // Calculate user's rank
  const userRank = sortedLeaderboard.findIndex(e => e.userId === user!.id) + 1

  // Days remaining
  const daysLeft = Math.ceil((new Date(competition.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/competitions"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          &larr; Tilbake til konkurranser
        </Link>
        <div className="mt-2 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{competition.name}</h1>
            <p className="text-sm text-gray-500">
              {competition.type === 'individual' ? 'Individuell konkurranse' :
               competition.type === 'team' ? 'Lagkonkurranse' : 'Avdelingskonkurranse'}
              {competition.activity_types && ` • ${competition.activity_types.name}`}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            competition.status === 'active'
              ? 'bg-green-100 text-green-800'
              : competition.status === 'completed'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {competition.status === 'active' ? 'Aktiv' :
             competition.status === 'completed' ? 'Fullført' : 'Kommer'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Deltakere</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{participants?.length || 0}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Dager igjen</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">
            {daysLeft > 0 ? daysLeft : 0}
          </dd>
        </div>
        {isParticipating && userRank > 0 && (
          <>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Din plassering</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">#{userRank}</dd>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Dine poeng</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {Math.round(userPoints[user!.id]?.points || 0)}
              </dd>
            </div>
          </>
        )}
      </div>

      {/* Description and join button */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Om konkurransen</h2>
            {competition.description ? (
              <p className="text-gray-600">{competition.description}</p>
            ) : (
              <p className="text-gray-400 italic">Ingen beskrivelse.</p>
            )}
            <div className="mt-4 text-sm text-gray-500">
              <p>
                <strong>Periode:</strong>{' '}
                {new Date(competition.start_date).toLocaleDateString('nb-NO')} -{' '}
                {new Date(competition.end_date).toLocaleDateString('nb-NO')}
              </p>
              {competition.activity_types && (
                <p className="mt-1">
                  <strong>Aktivitetstype:</strong> {competition.activity_types.name}
                </p>
              )}
            </div>
          </div>
          <div className="ml-6">
            <JoinLeaveButton
              competitionId={competition.id}
              isParticipating={isParticipating}
              isActive={competition.status === 'active'}
            />
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Ledertavle</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedLeaderboard.length > 0 ? (
            sortedLeaderboard.map((entry, index) => (
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
                    {entry.userId === user!.id && (
                      <span className="ml-2 text-xs text-blue-600">(deg)</span>
                    )}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(entry.points)} poeng
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              Ingen deltakere med aktivitet ennå.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
