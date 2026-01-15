import { createClient } from '@/lib/supabase/server'
import LogActivityForm from './LogActivityForm'
import ActivitiesList from './ActivitiesList'

export default async function ActivitiesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get activity types
  const { data: activityTypes } = await supabase
    .from('activity_types')
    .select('*')
    .eq('is_default', true)
    .order('name')

  // Get user's activities
  const { data: activities } = await supabase
    .from('activities')
    .select('*, activity_types(*)')
    .eq('user_id', user!.id)
    .order('activity_date', { ascending: false })
    .limit(50)

  // Calculate stats
  const totalActivities = activities?.length || 0
  const totalPoints = activities?.reduce((sum, a) => sum + (a.points || 0), 0) || 0

  // This month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const thisMonthActivities = activities?.filter(
    a => new Date(a.activity_date) >= startOfMonth
  )
  const thisMonthPoints = thisMonthActivities?.reduce((sum, a) => sum + (a.points || 0), 0) || 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mine aktiviteter</h1>
        <p className="mt-1 text-sm text-gray-500">
          Registrer nye aktiviteter og se din historikk.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Totalt antall</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{totalActivities}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Totale poeng</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{Math.round(totalPoints)}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Denne måneden</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{Math.round(thisMonthPoints)} poeng</dd>
        </div>
      </div>

      {/* Log activity form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Registrer aktivitet</h2>
        <LogActivityForm activityTypes={activityTypes || []} />
      </div>

      {/* Activities list */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Aktivitetshistorikk</h2>
        </div>
        <ActivitiesList activities={activities || []} />
      </div>
    </div>
  )
}
