-- ============================================================================
-- CLEAN REMOVAL OF ALL ZOHO ENTRIES
-- Date: August 29, 2025
-- Purpose: Remove all Zoho entries from all tables to prepare for clean re-insertion
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Identify all Zoho-related tool_ids for verification
-- ============================================================================

-- Show current Zoho-related data before removal
SELECT 'BEFORE REMOVAL - All Zoho-related tools:' as status;
SELECT id, name, description, logo_url, website_url FROM tools WHERE name LIKE '%Zoho%';

SELECT 'BEFORE REMOVAL - All Zoho-related tools in leaderboard:' as status;
SELECT tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes 
FROM tools_leaderboard 
WHERE tool_id IN (SELECT id FROM tools WHERE name LIKE '%Zoho%');

SELECT 'BEFORE REMOVAL - All Zoho-related tools in pros/cons:' as status;
SELECT tool_id, method_id, LEFT(pro_text, 50) as pro_preview, LEFT(con_text, 50) as con_preview
FROM tool_pros_and_cons 
WHERE tool_id IN (SELECT id FROM tools WHERE name LIKE '%Zoho%');

-- ============================================================================
-- STEP 2: Remove all Zoho-related references from related tables
-- ============================================================================

-- Remove from tool_pros_and_cons first (foreign key dependencies)
DELETE FROM tool_pros_and_cons 
WHERE tool_id IN (SELECT id FROM tools WHERE name LIKE '%Zoho%');

-- Remove from tools_leaderboard
DELETE FROM tools_leaderboard 
WHERE tool_id IN (SELECT id FROM tools WHERE name LIKE '%Zoho%');

-- Remove from votes table if any votes exist for these tools
DELETE FROM votes 
WHERE vote_type = 'tool' 
AND entity_id IN (SELECT id::text FROM tools WHERE name LIKE '%Zoho%');

-- ============================================================================
-- STEP 3: Remove from tools table (this will be the last step)
-- ============================================================================

-- Remove all Zoho-related tools
DELETE FROM tools WHERE name LIKE '%Zoho%';

-- ============================================================================
-- STEP 4: Verification - should show no results
-- ============================================================================

SELECT 'AFTER REMOVAL - All Zoho-related tools should be gone:' as status;

SELECT 'Tools table:' as table_name, COUNT(*) as zoho_count 
FROM tools WHERE name LIKE '%Zoho%'
UNION ALL
SELECT 'Leaderboard table:' as table_name, COUNT(*) as zoho_count 
FROM tools_leaderboard WHERE tool_id IN (SELECT id FROM tools WHERE name LIKE '%Zoho%')
UNION ALL
SELECT 'Pros/Cons table:' as table_name, COUNT(*) as zoho_count 
FROM tool_pros_and_cons WHERE tool_id IN (SELECT id FROM tools WHERE name LIKE '%Zoho%')
UNION ALL
SELECT 'Votes table:' as table_name, COUNT(*) as zoho_count 
FROM votes WHERE vote_type = 'tool' AND entity_id IN (SELECT id::text FROM tools WHERE name LIKE '%Zoho%');

-- Success message
SELECT 'All Zoho-related tools have been completely removed from all tables. Ready for clean re-insertion.' as result;

COMMIT;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- After running this script:
-- 1. All Zoho-related entries (Zoho, Zoho Survey, etc.) will be completely removed
-- 2. You can then run the second script to add Zoho back properly
-- 3. The second script will add one unified "Zoho" tool for multiple methods
-- 4. Each method (User Data Intelligence, Surveys) will have unique feature_description and pros/cons
-- ============================================================================
