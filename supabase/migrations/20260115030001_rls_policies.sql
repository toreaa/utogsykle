-- utogsykle Row Level Security Policies
-- Multi-tenant isolation + role-based access

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
    SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is system admin
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'system_admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is company admin (or higher)
CREATE OR REPLACE FUNCTION is_company_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role IN ('system_admin', 'company_admin')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COMPANIES POLICIES
-- ============================================

-- System admins can see all companies
CREATE POLICY "System admins can view all companies"
    ON companies FOR SELECT
    TO authenticated
    USING (is_system_admin());

-- Users can see their own company
CREATE POLICY "Users can view own company"
    ON companies FOR SELECT
    TO authenticated
    USING (id = get_user_company_id());

-- System admins can create companies
CREATE POLICY "System admins can create companies"
    ON companies FOR INSERT
    TO authenticated
    WITH CHECK (is_system_admin());

-- System admins can update companies
CREATE POLICY "System admins can update companies"
    ON companies FOR UPDATE
    TO authenticated
    USING (is_system_admin());

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- System admins can see all profiles
CREATE POLICY "System admins can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (is_system_admin());

-- Users can see profiles in their company
CREATE POLICY "Users can view company profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (company_id = get_user_company_id());

-- Users can see their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        -- Can't change own role or company
        company_id = get_user_company_id()
    );

-- Allow insert during signup (handled by trigger)
CREATE POLICY "Allow profile creation on signup"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

-- Company admins can update profiles in their company
CREATE POLICY "Company admins can update company profiles"
    ON profiles FOR UPDATE
    TO authenticated
    USING (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- ============================================
-- ACTIVITY TYPES POLICIES
-- ============================================

-- Everyone can see default activity types
CREATE POLICY "Anyone can view default activity types"
    ON activity_types FOR SELECT
    TO authenticated
    USING (is_default = TRUE);

-- Users can see company activity types
CREATE POLICY "Users can view company activity types"
    ON activity_types FOR SELECT
    TO authenticated
    USING (company_id = get_user_company_id());

-- Company admins can create activity types
CREATE POLICY "Company admins can create activity types"
    ON activity_types FOR INSERT
    TO authenticated
    WITH CHECK (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- Company admins can update activity types
CREATE POLICY "Company admins can update activity types"
    ON activity_types FOR UPDATE
    TO authenticated
    USING (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- ============================================
-- ACTIVITIES POLICIES
-- ============================================

-- Users can see activities in their company
CREATE POLICY "Users can view company activities"
    ON activities FOR SELECT
    TO authenticated
    USING (company_id = get_user_company_id());

-- Users can create their own activities
CREATE POLICY "Users can create own activities"
    ON activities FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        company_id = get_user_company_id()
    );

-- Users can update their own activities
CREATE POLICY "Users can update own activities"
    ON activities FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Users can delete their own activities
CREATE POLICY "Users can delete own activities"
    ON activities FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ============================================
-- COMPETITIONS POLICIES
-- ============================================

-- Users can see competitions in their company
CREATE POLICY "Users can view company competitions"
    ON competitions FOR SELECT
    TO authenticated
    USING (company_id = get_user_company_id());

-- Company admins can create competitions
CREATE POLICY "Company admins can create competitions"
    ON competitions FOR INSERT
    TO authenticated
    WITH CHECK (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- Company admins can update competitions
CREATE POLICY "Company admins can update competitions"
    ON competitions FOR UPDATE
    TO authenticated
    USING (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- Company admins can delete competitions
CREATE POLICY "Company admins can delete competitions"
    ON competitions FOR DELETE
    TO authenticated
    USING (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- ============================================
-- COMPETITION PARTICIPANTS POLICIES
-- ============================================

-- Users can see participants in their company's competitions
CREATE POLICY "Users can view competition participants"
    ON competition_participants FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM competitions c
            WHERE c.id = competition_id
            AND c.company_id = get_user_company_id()
        )
    );

-- Users can join competitions
CREATE POLICY "Users can join competitions"
    ON competition_participants FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM competitions c
            WHERE c.id = competition_id
            AND c.company_id = get_user_company_id()
            AND c.status = 'active'
        )
    );

-- Users can leave competitions
CREATE POLICY "Users can leave competitions"
    ON competition_participants FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ============================================
-- TEAMS POLICIES
-- ============================================

-- Users can see teams in their company
CREATE POLICY "Users can view company teams"
    ON teams FOR SELECT
    TO authenticated
    USING (company_id = get_user_company_id());

-- Company admins can create teams
CREATE POLICY "Company admins can create teams"
    ON teams FOR INSERT
    TO authenticated
    WITH CHECK (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- Company admins can update teams
CREATE POLICY "Company admins can update teams"
    ON teams FOR UPDATE
    TO authenticated
    USING (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- Company admins can delete teams
CREATE POLICY "Company admins can delete teams"
    ON teams FOR DELETE
    TO authenticated
    USING (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- ============================================
-- TEAM MEMBERS POLICIES
-- ============================================

-- Users can see team members in their company
CREATE POLICY "Users can view team members"
    ON team_members FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_id
            AND t.company_id = get_user_company_id()
        )
    );

-- Users can join teams
CREATE POLICY "Users can join teams"
    ON team_members FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_id
            AND t.company_id = get_user_company_id()
        )
    );

-- Users can leave teams
CREATE POLICY "Users can leave teams"
    ON team_members FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Company admins can manage team members
CREATE POLICY "Company admins can manage team members"
    ON team_members FOR ALL
    TO authenticated
    USING (
        is_company_admin() AND
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_id
            AND t.company_id = get_user_company_id()
        )
    );

-- ============================================
-- KUDOS POLICIES
-- ============================================

-- Users can see kudos in their company
CREATE POLICY "Users can view company kudos"
    ON kudos FOR SELECT
    TO authenticated
    USING (company_id = get_user_company_id());

-- Users can give kudos
CREATE POLICY "Users can give kudos"
    ON kudos FOR INSERT
    TO authenticated
    WITH CHECK (
        from_user_id = auth.uid() AND
        company_id = get_user_company_id() AND
        -- Can only give kudos to users in same company
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = to_user_id
            AND p.company_id = get_user_company_id()
        )
    );

-- Users can remove their own kudos
CREATE POLICY "Users can remove own kudos"
    ON kudos FOR DELETE
    TO authenticated
    USING (from_user_id = auth.uid());

-- ============================================
-- INVITATIONS POLICIES
-- ============================================

-- Company admins can see invitations
CREATE POLICY "Company admins can view invitations"
    ON invitations FOR SELECT
    TO authenticated
    USING (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- Company admins can create invitations
CREATE POLICY "Company admins can create invitations"
    ON invitations FOR INSERT
    TO authenticated
    WITH CHECK (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- Company admins can delete invitations
CREATE POLICY "Company admins can delete invitations"
    ON invitations FOR DELETE
    TO authenticated
    USING (
        is_company_admin() AND
        company_id = get_user_company_id()
    );

-- Allow anonymous access to check invitation by token
CREATE POLICY "Anyone can check invitation by token"
    ON invitations FOR SELECT
    TO anon
    USING (token IS NOT NULL);

-- ============================================
-- STREAKS POLICIES
-- ============================================

-- Users can see streaks in their company
CREATE POLICY "Users can view company streaks"
    ON streaks FOR SELECT
    TO authenticated
    USING (company_id = get_user_company_id());

-- System manages streaks (via trigger)
CREATE POLICY "System can manage streaks"
    ON streaks FOR ALL
    TO authenticated
    USING (user_id = auth.uid());
