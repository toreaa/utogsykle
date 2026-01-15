-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_company_id UUID;
    user_role user_role;
    invitation_record RECORD;
BEGIN
    -- Check if user was invited
    SELECT * INTO invitation_record
    FROM invitations
    WHERE email = NEW.email
    AND accepted_at IS NULL
    AND expires_at > NOW()
    LIMIT 1;

    IF FOUND THEN
        -- User was invited - use invitation data
        user_company_id := invitation_record.company_id;
        user_role := invitation_record.role;

        -- Mark invitation as accepted
        UPDATE invitations
        SET accepted_at = NOW()
        WHERE id = invitation_record.id;
    ELSE
        -- Check if user's email domain matches a company
        SELECT id INTO user_company_id
        FROM companies
        WHERE domain = split_part(NEW.email, '@', 2)
        AND is_active = TRUE
        LIMIT 1;

        IF FOUND THEN
            user_role := 'user';
        ELSE
            -- No company found - user needs to be assigned manually or create company
            user_company_id := NULL;
            user_role := 'user';
        END IF;
    END IF;

    -- Create profile
    INSERT INTO profiles (id, company_id, role, full_name)
    VALUES (
        NEW.id,
        user_company_id,
        user_role,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
