import { createClient } from '@supabase/supabase-js'

// Load from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'admin@utogsykle.no'
  const password = 'Admin123!' // Change this after first login

  console.log('Creating admin user...')

  // First check if user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing users:', listError)
    return
  }

  const existingUser = users.find(u => u.email === email)

  if (existingUser) {
    console.log('User already exists with ID:', existingUser.id)

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', existingUser.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError)
    }

    if (!profile) {
      // Create profile manually
      console.log('Creating profile for existing user...')
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: existingUser.id,
          company_id: null,
          role: 'system_admin',
          full_name: 'System Administrator'
        })

      if (insertError) {
        console.error('Error creating profile:', insertError)
        return
      }
    } else if (profile.role !== 'system_admin') {
      // Update to system_admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'system_admin', company_id: null })
        .eq('id', existingUser.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return
      }
    }

    console.log('✅ Admin account ready!')
    console.log(`Email: ${email}`)
    console.log(`Password: (use existing or reset via Supabase)`)
    return
  }

  // User doesn't exist, create new user
  // Use raw SQL to create user and profile in one transaction via RPC
  const userId = crypto.randomUUID()

  // Insert into auth.users directly (bypassing trigger issues)
  const { error: sqlError } = await supabase.rpc('create_system_admin', {
    admin_id: userId,
    admin_email: email,
    admin_password: password
  })

  if (sqlError) {
    console.log('RPC not available, trying admin API...')

    // Try admin API with more options
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'System Administrator' }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      console.log('\nTrying alternative approach...')

      // Try creating profile first, then user might auto-work
      console.log('Please create the user manually via Supabase Dashboard:')
      console.log('1. Go to https://supabase.com/dashboard')
      console.log('2. Select utogsykle project')
      console.log('3. Go to Authentication > Users')
      console.log('4. Click "Add user"')
      console.log(`5. Enter email: ${email}`)
      console.log(`6. Enter password: ${password}`)
      console.log('7. Check "Auto Confirm User"')
      console.log('8. Click "Create user"')
      console.log('\nThe trigger should automatically create the profile as system_admin!')
      return
    }

    console.log('User created:', user.user?.id)
    console.log('✅ Admin user created successfully!')
  } else {
    console.log('✅ Admin user created via RPC!')
  }

  console.log(`\nEmail: ${email}`)
  console.log(`Password: ${password}`)
  console.log('\n⚠️  Remember to change the password after first login!')
}

createAdminUser()
