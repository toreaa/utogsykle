-- Create system admin user directly
-- This bypasses the trigger by inserting into auth.users with a specific approach

-- Ensure pgcrypto extension is enabled in extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- First, temporarily disable the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the admin user if not exists
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@utogsykle.no';

  IF admin_user_id IS NULL THEN
    -- Generate new UUID
    admin_user_id := gen_random_uuid();

    -- Create the admin user in auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      'admin@utogsykle.no',
      extensions.crypt('Admin123!', extensions.gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"System Administrator"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    RAISE NOTICE 'Created admin user with ID: %', admin_user_id;
  ELSE
    RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
  END IF;

  -- Ensure profile exists for admin user
  INSERT INTO profiles (id, company_id, role, full_name)
  VALUES (admin_user_id, NULL, 'system_admin', 'System Administrator')
  ON CONFLICT (id) DO UPDATE SET role = 'system_admin', company_id = NULL;

END $$;

-- Re-enable the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
