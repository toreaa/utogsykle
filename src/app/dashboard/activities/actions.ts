'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function logActivity(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user!.id)
    .single()

  const activityTypeId = formData.get('activityTypeId') as string
  const value = parseFloat(formData.get('value') as string)
  const notes = formData.get('notes') as string
  const activityDate = formData.get('activityDate') as string

  const { error } = await supabase
    .from('activities')
    .insert({
      user_id: user!.id,
      company_id: profile!.company_id!,
      activity_type_id: activityTypeId,
      value,
      points: 0, // Will be calculated by trigger
      notes: notes || null,
      activity_date: activityDate,
      source: 'manual',
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/activities')
  return { success: true }
}

export async function deleteActivity(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/activities')
  return { success: true }
}
