'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCompany(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const domain = formData.get('domain') as string

  const { data, error } = await supabase
    .from('companies')
    .insert({
      name,
      domain: domain || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/companies')
  redirect(`/admin/companies/${data.id}`)
}

export async function updateCompany(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const domain = formData.get('domain') as string
  const isActive = formData.get('isActive') === 'true'

  const { error } = await supabase
    .from('companies')
    .update({
      name,
      domain: domain || null,
      is_active: isActive,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/companies')
  revalidatePath(`/admin/companies/${id}`)
  return { success: true }
}

export async function deleteCompany(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/companies')
  redirect('/admin/companies')
}
