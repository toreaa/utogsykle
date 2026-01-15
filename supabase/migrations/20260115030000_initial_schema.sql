-- utogsykle Initial Schema
-- Multi-tenant corporate wellness competition platform

-- Enable pgcrypto for gen_random_uuid() and gen_random_bytes()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('system_admin', 'company_admin', 'user');
CREATE TYPE competition_type AS ENUM ('individual', 'team', 'department');
CREATE TYPE competition_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE activity_unit AS ENUM ('steps', 'km', 'minutes', 'sessions');

-- ============================================
-- COMPANIES (Tenants)
-- ============================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE, -- For email domain whitelist
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for domain lookup during registration
CREATE INDEX idx_companies_domain ON companies(domain);

-- ============================================
-- PROFILES (Users linked to auth.users)
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user',
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- System admins have NULL company_id
    CONSTRAINT valid_role_company CHECK (
        (role = 'system_admin' AND company_id IS NULL) OR
        (role != 'system_admin' AND company_id IS NOT NULL)
    )
);

-- Index for company lookups
CREATE INDEX idx_profiles_company ON profiles(company_id);

-- ============================================
-- ACTIVITY TYPES
-- ============================================

CREATE TABLE activity_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    unit activity_unit NOT NULL,
    points_per_unit DECIMAL(10,2) DEFAULT 1.0,
    icon TEXT,
    is_default BOOLEAN DEFAULT FALSE, -- System-wide defaults have NULL company_id
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Default activity types have NULL company_id
    CONSTRAINT valid_activity_type CHECK (
        (is_default = TRUE AND company_id IS NULL) OR
        (is_default = FALSE)
    )
);

-- Seed default activity types
INSERT INTO activity_types (name, description, unit, points_per_unit, icon, is_default) VALUES
    ('Gange', 'Gå tur, gå til jobb, etc.', 'steps', 0.01, 'walking', TRUE),
    ('Løping', 'Jogging eller løping', 'km', 10.0, 'running', TRUE),
    ('Sykling', 'Sykkel til jobb eller trening', 'km', 5.0, 'cycling', TRUE),
    ('Svømming', 'Svømmetrening', 'minutes', 2.0, 'swimming', TRUE),
    ('Styrketrening', 'Gym eller hjemmetrening', 'sessions', 15.0, 'gym', TRUE),
    ('Generell trening', 'Annen fysisk aktivitet', 'minutes', 1.0, 'exercise', TRUE);

-- ============================================
-- ACTIVITIES (Logged by users)
-- ============================================

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    activity_type_id UUID NOT NULL REFERENCES activity_types(id),
    value DECIMAL(10,2) NOT NULL, -- Amount in the activity's unit
    points DECIMAL(10,2) NOT NULL, -- Calculated points
    notes TEXT,
    source TEXT DEFAULT 'manual', -- 'manual', 'strava', etc.
    external_id TEXT, -- ID from external source
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate imports
    UNIQUE(external_id, source)
);

-- Indexes for common queries
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_company ON activities(company_id);
CREATE INDEX idx_activities_date ON activities(activity_date);
CREATE INDEX idx_activities_company_date ON activities(company_id, activity_date);

-- ============================================
-- COMPETITIONS
-- ============================================

CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type competition_type DEFAULT 'individual',
    status competition_status DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    activity_type_id UUID REFERENCES activity_types(id), -- NULL = all activities
    settings JSONB DEFAULT '{}', -- Flexible settings (daily cap, team size, etc.)
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Indexes
CREATE INDEX idx_competitions_company ON competitions(company_id);
CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_dates ON competitions(start_date, end_date);

-- ============================================
-- COMPETITION PARTICIPANTS
-- ============================================

CREATE TABLE competition_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    team_id UUID, -- For team competitions
    joined_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(competition_id, user_id)
);

-- Indexes
CREATE INDEX idx_competition_participants_competition ON competition_participants(competition_id);
CREATE INDEX idx_competition_participants_user ON competition_participants(user_id);

-- ============================================
-- TEAMS
-- ============================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, name)
);

-- Index
CREATE INDEX idx_teams_company ON teams(company_id);

-- ============================================
-- TEAM MEMBERS
-- ============================================

CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_captain BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(team_id, user_id)
);

-- Indexes
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ============================================
-- KUDOS (Social recognition)
-- ============================================

CREATE TABLE kudos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- One kudos per user per activity
    UNIQUE(from_user_id, activity_id)
);

-- Indexes
CREATE INDEX idx_kudos_to_user ON kudos(to_user_id);
CREATE INDEX idx_kudos_activity ON kudos(activity_id);
CREATE INDEX idx_kudos_company ON kudos(company_id);

-- ============================================
-- INVITATIONS (For company admins to invite users)
-- ============================================

CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role DEFAULT 'user',
    invited_by UUID REFERENCES profiles(id),
    token TEXT UNIQUE DEFAULT md5(random()::text || clock_timestamp()::text),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, email)
);

-- Index
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_company ON invitations(company_id);

-- ============================================
-- STREAKS (Track user consistency)
-- ============================================

CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Index
CREATE INDEX idx_streaks_company ON streaks(company_id);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- CALCULATE POINTS TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION calculate_activity_points()
RETURNS TRIGGER AS $$
DECLARE
    points_multiplier DECIMAL(10,2);
BEGIN
    -- Get points per unit from activity type
    SELECT points_per_unit INTO points_multiplier
    FROM activity_types
    WHERE id = NEW.activity_type_id;

    -- Calculate points
    NEW.points = NEW.value * COALESCE(points_multiplier, 1.0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_points_before_insert
    BEFORE INSERT ON activities
    FOR EACH ROW EXECUTE FUNCTION calculate_activity_points();

CREATE TRIGGER calculate_points_before_update
    BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION calculate_activity_points();

-- ============================================
-- UPDATE STREAK TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_date DATE;
    current_str INTEGER;
BEGIN
    -- Get current streak info
    SELECT last_activity_date, current_streak INTO last_date, current_str
    FROM streaks
    WHERE user_id = NEW.user_id;

    IF NOT FOUND THEN
        -- Create new streak record
        INSERT INTO streaks (user_id, company_id, current_streak, longest_streak, last_activity_date)
        VALUES (NEW.user_id, NEW.company_id, 1, 1, NEW.activity_date);
    ELSIF last_date IS NULL OR NEW.activity_date > last_date THEN
        -- Update streak
        IF last_date IS NULL OR NEW.activity_date = last_date + 1 THEN
            -- Consecutive day - increment streak
            UPDATE streaks
            SET current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak + 1),
                last_activity_date = NEW.activity_date
            WHERE user_id = NEW.user_id;
        ELSIF NEW.activity_date > last_date + 1 THEN
            -- Streak broken - reset to 1
            UPDATE streaks
            SET current_streak = 1,
                last_activity_date = NEW.activity_date
            WHERE user_id = NEW.user_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_streak_after_activity
    AFTER INSERT ON activities
    FOR EACH ROW EXECUTE FUNCTION update_user_streak();
