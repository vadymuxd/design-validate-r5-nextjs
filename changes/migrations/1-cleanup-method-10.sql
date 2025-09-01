-- ============================================================================
-- STEP 1: Clean up method_id = 10 (Concept Testing) 
-- ============================================================================
-- Remove all tool associations with method_id = 10 to reset it to clean state
-- This will allow us to properly reassign User Interview tools to method_id = 16
-- ============================================================================

-- Start transaction for safety
BEGIN;

-- First, delete from child table (tool_pros_and_cons)
DELETE FROM tool_pros_and_cons 
WHERE method_id = 10;

-- Then delete from parent table (tools_leaderboard) 
DELETE FROM tools_leaderboard 
WHERE method_id = 10;

-- Verify cleanup - should return 0 rows
SELECT COUNT(*) as remaining_method_10_leaderboard 
FROM tools_leaderboard 
WHERE method_id = 10;

SELECT COUNT(*) as remaining_method_10_pros_cons 
FROM tool_pros_and_cons 
WHERE method_id = 10;

-- Show method 10 info to confirm it still exists but has no tools
SELECT id, name, slug 
FROM methods 
WHERE id = 10;

COMMIT;
