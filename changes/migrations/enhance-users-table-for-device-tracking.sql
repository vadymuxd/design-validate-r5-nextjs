-- ============================================================================
-- ENHANCE USERS TABLE FOR DEVICE TRACKING
-- ============================================================================
-- This migration enhances the users table to support device-based user tracking
-- without authentication, adding device type, OS, browser, and location data

-- ============================================================================
-- STEP 1: Add new columns to users table
-- ============================================================================

-- Add device and system information columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS device_type TEXT, -- 'mobile', 'desktop', 'tablet'
ADD COLUMN IF NOT EXISTS os TEXT, -- 'macOS', 'Windows', 'iOS', 'Android', 'Linux'
ADD COLUMN IF NOT EXISTS browser TEXT, -- 'Chrome', 'Firefox', 'Safari', 'Edge', etc.
ADD COLUMN IF NOT EXISTS city TEXT, -- City from IP geolocation
ADD COLUMN IF NOT EXISTS region TEXT, -- Region/State from IP geolocation
ADD COLUMN IF NOT EXISTS country TEXT, -- Country from IP geolocation
ADD COLUMN IF NOT EXISTS user_agent TEXT, -- Full user agent string for analysis
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(), -- Track when user was last active
ADD COLUMN IF NOT EXISTS first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(); -- Track when user was first seen

-- ============================================================================
-- STEP 2: Remove email requirement (since we're using device-based tracking)
-- ============================================================================

-- Make email optional since we're doing device-based tracking without auth
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- ============================================================================
-- STEP 3: Add indexes for better performance
-- ============================================================================

-- Index on device_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_device_id ON users (device_id);

-- Index on device_type for analytics
CREATE INDEX IF NOT EXISTS idx_users_device_type ON users (device_type);

-- Index on os for analytics
CREATE INDEX IF NOT EXISTS idx_users_os ON users (os);

-- Index on city for analytics
CREATE INDEX IF NOT EXISTS idx_users_city ON users (city);

-- Index on region for analytics
CREATE INDEX IF NOT EXISTS idx_users_region ON users (region);

-- Index on country for analytics
CREATE INDEX IF NOT EXISTS idx_users_country ON users (country);

-- Index on last_seen_at for activity tracking
CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users (last_seen_at);

-- ============================================================================
-- STEP 4: Update the database function comments and constraints
-- ============================================================================

-- Add comments to document the new schema
COMMENT ON COLUMN users.device_id IS 'Unique device identifier generated from user agent';
COMMENT ON COLUMN users.device_type IS 'Device type: mobile, desktop, or tablet';
COMMENT ON COLUMN users.os IS 'Operating system: macOS, Windows, iOS, Android, Linux, etc.';
COMMENT ON COLUMN users.browser IS 'Browser: Chrome, Firefox, Safari, Edge, etc.';
COMMENT ON COLUMN users.city IS 'City determined from IP geolocation';
COMMENT ON COLUMN users.region IS 'Region/State determined from IP geolocation';
COMMENT ON COLUMN users.country IS 'Country determined from IP geolocation';
COMMENT ON COLUMN users.user_agent IS 'Full user agent string for detailed analysis';
COMMENT ON COLUMN users.last_seen_at IS 'Timestamp of when user was last active';
COMMENT ON COLUMN users.first_seen_at IS 'Timestamp of when user was first seen';
COMMENT ON COLUMN users.email IS 'Optional email address (for contact forms, etc.)';

-- ============================================================================
-- STEP 5: Create helper function to upsert users
-- ============================================================================

-- Create or replace function to handle user upsert operations
CREATE OR REPLACE FUNCTION upsert_user(
    p_device_id TEXT,
    p_device_type TEXT,
    p_os TEXT,
    p_browser TEXT,
    p_city TEXT,
    p_region TEXT,
    p_country TEXT,
    p_user_agent TEXT,
    p_ip_address TEXT
)
RETURNS TABLE (
    user_id BIGINT,
    is_new_user BOOLEAN
) AS $$
DECLARE
    v_user_id BIGINT;
    v_is_new_user BOOLEAN := FALSE;
BEGIN
    -- Try to find existing user by device_id
    SELECT id INTO v_user_id
    FROM users
    WHERE device_id = p_device_id;
    
    IF v_user_id IS NULL THEN
        -- New user - insert
        INSERT INTO users (
            device_id,
            device_type,
            os,
            browser,
            city,
            region,
            country,
            user_agent,
            ip_address,
            first_seen_at,
            last_seen_at
        ) VALUES (
            p_device_id,
            p_device_type,
            p_os,
            p_browser,
            p_city,
            p_region,
            p_country,
            p_user_agent,
            p_ip_address,
            now(),
            now()
        )
        RETURNING id INTO v_user_id;
        
        v_is_new_user := TRUE;
    ELSE
        -- Existing user - update last_seen_at and other fields if they've changed
        UPDATE users
        SET 
            last_seen_at = now(),
            device_type = COALESCE(p_device_type, device_type),
            os = COALESCE(p_os, os),
            browser = COALESCE(p_browser, browser),
            city = COALESCE(p_city, city),
            region = COALESCE(p_region, region),
            country = COALESCE(p_country, country),
            user_agent = COALESCE(p_user_agent, user_agent),
            ip_address = COALESCE(p_ip_address, ip_address)
        WHERE id = v_user_id;
    END IF;
    
    -- Return the user info
    RETURN QUERY SELECT v_user_id, v_is_new_user;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 6: Create analytics functions for user tracking
-- ============================================================================

-- Function to get user statistics by device type
CREATE OR REPLACE FUNCTION get_user_stats_by_device_type()
RETURNS TABLE (
    device_type TEXT,
    total_users BIGINT,
    active_last_7_days BIGINT,
    active_last_30_days BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.device_type,
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '7 days') as active_last_7_days,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '30 days') as active_last_30_days
    FROM users u
    WHERE u.device_type IS NOT NULL
    GROUP BY u.device_type
    ORDER BY total_users DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics by OS
CREATE OR REPLACE FUNCTION get_user_stats_by_os()
RETURNS TABLE (
    os TEXT,
    total_users BIGINT,
    active_last_7_days BIGINT,
    active_last_30_days BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.os,
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '7 days') as active_last_7_days,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '30 days') as active_last_30_days
    FROM users u
    WHERE u.os IS NOT NULL
    GROUP BY u.os
    ORDER BY total_users DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics by country
CREATE OR REPLACE FUNCTION get_user_stats_by_country()
RETURNS TABLE (
    country TEXT,
    total_users BIGINT,
    active_last_7_days BIGINT,
    active_last_30_days BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.country,
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '7 days') as active_last_7_days,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '30 days') as active_last_30_days
    FROM users u
    WHERE u.country IS NOT NULL
    GROUP BY u.country
    ORDER BY total_users DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics by city
CREATE OR REPLACE FUNCTION get_user_stats_by_city()
RETURNS TABLE (
    city TEXT,
    region TEXT,
    country TEXT,
    total_users BIGINT,
    active_last_7_days BIGINT,
    active_last_30_days BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.city,
        u.region,
        u.country,
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '7 days') as active_last_7_days,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '30 days') as active_last_30_days
    FROM users u
    WHERE u.city IS NOT NULL
    GROUP BY u.city, u.region, u.country
    ORDER BY total_users DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics by region
CREATE OR REPLACE FUNCTION get_user_stats_by_region()
RETURNS TABLE (
    region TEXT,
    country TEXT,
    total_users BIGINT,
    active_last_7_days BIGINT,
    active_last_30_days BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.region,
        u.country,
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '7 days') as active_last_7_days,
        COUNT(*) FILTER (WHERE u.last_seen_at >= now() - interval '30 days') as active_last_30_days
    FROM users u
    WHERE u.region IS NOT NULL
    GROUP BY u.region, u.country
    ORDER BY total_users DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 7: Verification queries
-- ============================================================================

-- Show updated table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test the upsert function
SELECT 
    'Testing upsert_user function...' as status,
    user_id,
    is_new_user
FROM upsert_user(
    'test-device-123',
    'desktop',
    'macOS',
    'Chrome',
    'San Francisco',
    'California',
    'United States',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    '192.168.1.1'
);

-- Clean up test data
DELETE FROM users WHERE device_id = 'test-device-123';

-- Show example of user stats functions
SELECT 'User statistics by device type:' as info;
SELECT * FROM get_user_stats_by_device_type();

SELECT 'User statistics by OS:' as info;
SELECT * FROM get_user_stats_by_os();

SELECT 'User statistics by country:' as info;
SELECT * FROM get_user_stats_by_country();

-- Success message
SELECT 'Users table enhanced successfully for device tracking!' as result;
