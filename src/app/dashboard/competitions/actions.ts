'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function joinCompetition(competitionId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('competition_participants')
    .insert({
      competition_id: competitionId,
      user_id: user!.id,
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Du er allerede med i denne konkurransen.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/competitions')
  revalidatePath(`/dashboard/competitions/${competitionId}`)
  return { success: true }
}

export async function leaveCompetition(competitionId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('competition_participants')
    .delete()
    .eq('competition_id', competitionId)
    .eq('user_id', user!.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/competitions')
  revalidatePath(`/dashboard/competitions/${competitionId}`)
  return { success: true }
}

export async function giveKudos(toUserId: string, activityId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user!.id)
    .single()

  const { error } = await supabase
    .from('kudos')
    .insert({
      from_user_id: user!.id,
      to_user_id: toUserId,
      activity_id: activityId,
      company_id: profile!.company_id!,
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Du har allerede gitt kudos for denne aktiviteten.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/leaderboard')
  return { success: true }
}
