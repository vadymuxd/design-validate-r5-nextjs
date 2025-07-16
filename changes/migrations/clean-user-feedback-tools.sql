-- Clean Slate: Remove User Feedback Tools Data
-- Date: July 16, 2025
-- Purpose: Remove all User Feedback tools data to start fresh

-- Begin transaction
BEGIN;

-- Remove pros and cons data for User Feedback method
DELETE FROM tool_pros_and_cons 
WHERE method_id = 9;

-- Remove leaderboard data for User Feedback method
DELETE FROM tools_leaderboard 
WHERE method_id = 9;

-- Remove tools that were added for User Feedback (excluding existing ones like Hotjar, Pendo)
DELETE FROM tools 
WHERE name IN ('Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Dovetail')
AND id NOT IN (
    -- Keep any tools that might exist in other methods
    SELECT DISTINCT tl.tool_id 
    FROM tools_leaderboard tl 
    WHERE tl.method_id != 9
);

-- Verify cleanup
SELECT 
    'User Feedback Tools Cleaned' as status,
    (SELECT COUNT(*) FROM tools WHERE name IN ('Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Dovetail')) as tools_remaining,
    (SELECT COUNT(*) FROM tools_leaderboard WHERE method_id = 9) as leaderboard_entries,
    (SELECT COUNT(*) FROM tool_pros_and_cons WHERE method_id = 9) as pros_cons_entries;

-- Commit the transaction
COMMIT;
