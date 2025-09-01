-- ============================================================================
-- FIX: Update User Interview tools to use correct method_id
-- ============================================================================
-- Problem: Previous migration used hardcoded method_id = 10, but method ID 10 
-- is actually "Concept Testing". User Interviews method has ID = 16.
-- We need to move only the User Interview tools from method_id=10 to method_id=16
-- Solution: Update records for User Interview tools specifically
-- ============================================================================

-- ============================================================================
-- FIX: Update User Interview tools to use correct method_id
-- ============================================================================
-- Problem: Previous migration used hardcoded method_id = 10, but method ID 10 
-- is actually "Concept Testing". User Interviews method has ID = 16.
-- We need to move only the User Interview tools from method_id=10 to method_id=16
-- Solution: Use transaction with constraint deferring to safely update both tables
-- ============================================================================

-- Start transaction
BEGIN;

-- Temporarily defer foreign key constraint checks
SET CONSTRAINTS ALL DEFERRED;

-- First, let's see what tools were incorrectly assigned to method_id = 10
-- These should be User Interview tools that belong to method_id = 16
SELECT t.name, t.id, tl.method_id
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id
WHERE tl.method_id = 10
AND t.name IN (
  'Lookback', 'UserTesting', 'User Testing', 'Maze', 'UserZoom', 'User Zoom', 'Lyssna', 
  'UXTweak', 'UX Tweak', 'Userfeel', 'Respondent', 'Ethnio', 'Dovetail', 'Dscout', 
  'Loop11', 'Hotjar', 'Contentsquare', 'Trymata', 'GreatQuestion', 'Wondering'
);

-- Update tools_leaderboard for User Interview tools
UPDATE tools_leaderboard 
SET method_id = 16 
WHERE method_id = 10
AND tool_id IN (
  SELECT t.id 
  FROM tools t
  WHERE t.name IN (
    'Lookback', 'UserTesting', 'User Testing', 'Maze', 'UserZoom', 'User Zoom', 'Lyssna', 
    'UXTweak', 'UX Tweak', 'Userfeel', 'Respondent', 'Ethnio', 'Dovetail', 'Dscout', 
    'Loop11', 'Hotjar', 'Contentsquare', 'Trymata', 'GreatQuestion', 'Wondering'
  )
);

-- Update tool_pros_and_cons for User Interview tools
UPDATE tool_pros_and_cons 
SET method_id = 16 
WHERE method_id = 10
AND tool_id IN (
  SELECT t.id 
  FROM tools t
  WHERE t.name IN (
    'Lookback', 'UserTesting', 'User Testing', 'Maze', 'UserZoom', 'User Zoom', 'Lyssna', 
    'UXTweak', 'UX Tweak', 'Userfeel', 'Respondent', 'Ethnio', 'Dovetail', 'Dscout', 
    'Loop11', 'Hotjar', 'Contentsquare', 'Trymata', 'GreatQuestion', 'Wondering'
  )
);

-- Commit transaction (this will check all constraints at once)
COMMIT;

-- Verify the fix worked - this should return the count of User Interview tools
SELECT COUNT(*) as user_interview_tools_count 
FROM tools_leaderboard tl 
JOIN methods m ON tl.method_id = m.id 
WHERE m.slug = 'user-interviews';

-- List all User Interview tools to confirm they're connected
SELECT t.name, m.name as method_name, tl.net_score
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id
JOIN methods m ON tl.method_id = m.id
WHERE m.slug = 'user-interviews'
ORDER BY tl.net_score DESC;
