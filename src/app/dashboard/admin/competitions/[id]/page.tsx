import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CompetitionEditForm from './CompetitionEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CompetitionDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Get competition
  const { data: competition } = await supabase
    .from('competitions')
    .select('*, activity_types(name)')
    .eq('id', id)
    .single()

  if (!competition) {
    notFound()
  }

  // Get participants
  const { data: participants } = await supabase
    .from('competition_participants')
    .select('*, profiles(full_name)')
    .eq('competition_id', id)
    .order('joined_at', { ascending: false })

  // Get leaderboard
  const { data: leaderboard } = await supabase
    .from('activities')
    .select('user_id, profiles(full_name), points')
    .eq('company_id', competition.company_id)
    .gte('activity_date', competition.start_date)
    .lte('activity_date', competition.end_date)

  // Aggregate points per user
  const userPoints: Record<string, { name: string; points: number }> = {}

  leaderboard?.forEach((activity) => {
    const userId = activity.user_id
    if (!userPoints[userId]) {
      userPoints[userId] = {
        name: (activity.profiles as unknown as { full_name: string })?.full_name || 'Ukjent',
        points: 0,
      }
    }
    userPoints[userId].points += activity.points || 0
  })

  const sortedLeaderboard = Object.entries(userPoints)
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/admin/competitions"
          className="text-sm text-primary hover:text-primary/80"
        >
          &larr; Tilbake til konkurranser
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">{competition.name}</h1>
        <p className="text-sm text-muted-foreground">
          {competition.type === 'individual' ? 'Individuell' :
           competition.type === 'team' ? 'Lag' : 'Avdeling'}
          {competition.activity_types && ` • ${competition.activity_types.name}`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Edit form */}
        <div className="bg-card shadow sm:rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">Innstillinger</h2>
          </div>
          <CompetitionEditForm competition={competition} />
        </div>

        {/* Leaderboard */}
        <div className="bg-card shadow sm:rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">Ledertavle</h2>
          </div>
          <div className="divide-y divide-border">
            {sortedLeaderboard.length > 0 ? (
              sortedLeaderboard.map((entry, index) => (
                <div key={entry.userId} className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-muted text-muted-foreground' :
                      index === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-muted/50 text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="ml-3 text-sm font-medium text-foreground">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {Math.round(entry.points)} poeng
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                Ingen aktiviteter registrert i denne perioden.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="mt-6 bg-card shadow sm:rounded-lg border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">
            Deltakere ({participants?.length || 0})
          </h2>
        </div>
        <div className="divide-y divide-border">
          {participants && participants.length > 0 ? (
            participants.map((participant) => (
              <div key={participant.id} className="px-6 py-4 flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  {(participant.profiles as unknown as { full_name: string })?.full_name || 'Ukjent'}
                </span>
                <span className="text-sm text-muted-foreground">
                  Ble med {participant.joined_at ? new Date(participant.joined_at).toLocaleDateString('nb-NO') : '-'}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-muted-foreground">
              Ingen deltakere ennå.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
