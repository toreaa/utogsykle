'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function createCompany(formData: FormData) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const name = formData.get('name') as string
  const domain = formData.get('domain') as string
  const adminName = formData.get('adminName') as string
  const adminEmail = formData.get('adminEmail') as string
  const adminPassword = formData.get('adminPassword') as string

  // Validate required fields
  if (!name || !adminName || !adminEmail || !adminPassword) {
    return { error: 'Alle obligatoriske felt må fylles ut' }
  }

  if (adminPassword.length < 8) {
    return { error: 'Passordet må være minst 8 tegn' }
  }

  // 1. Create the company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({
      name,
      domain: domain || null,
    })
    .select()
    .single()

  if (companyError) {
    return { error: `Kunne ikke opprette bedrift: ${companyError.message}` }
  }

  // 2. Create the admin user using service role
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      full_name: adminName,
    },
  })

  if (authError) {
    // Rollback: delete the company if user creation fails
    await supabase.from('companies').delete().eq('id', company.id)
    return { error: `Kunne ikke opprette bruker: ${authError.message}` }
  }

  // 3. Update the profile with company_id and role
  // The profile is created automatically by the database trigger,
  // but we need to update it with company_id and role
  const { error: profileError } = await adminSupabase
    .from('profiles')
    .update({
      company_id: company.id,
      role: 'company_admin',
      full_name: adminName,
    })
    .eq('id', authData.user.id)

  if (profileError) {
    // Don't rollback here, the company and user exist - just log the issue
    console.error('Failed to update profile:', profileError)
  }

  revalidatePath('/admin/companies')
  redirect(`/admin/companies/${company.id}`)
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
