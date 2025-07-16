-- Fix User Feedback Tools Voting Columns
-- Date: July 16, 2025
-- Purpose: Move vote data from current_* to initial_* columns for proper backfill architecture

-- Begin transaction
BEGIN;

-- Update existing tools_leaderboard entries to move current votes to initial votes
-- This fixes the case where backfill data was incorrectly placed in current_* columns
-- IMPORTANT: Only move votes to initial_* if current_* columns contain the backfill data
-- If current_* already contains real user votes, preserve them
UPDATE tools_leaderboard 
SET 
    initial_upvotes = CASE 
        WHEN initial_upvotes IS NULL OR initial_upvotes = 0 THEN
            CASE t.name
                WHEN 'Hotjar' THEN 320
                WHEN 'Sprig' THEN 260
                WHEN 'Qualtrics' THEN 300
                WHEN 'SurveyMonkey' THEN 280
                WHEN 'Typeform' THEN 240
                WHEN 'Delighted' THEN 210
                WHEN 'Medallia' THEN 240
                WHEN 'UserVoice' THEN 220
                WHEN 'Pendo' THEN 200
                WHEN 'Dovetail' THEN 180
                ELSE COALESCE(initial_upvotes, 0)
            END
        ELSE initial_upvotes
    END,
    initial_downvotes = CASE 
        WHEN initial_downvotes IS NULL OR initial_downvotes = 0 THEN
            CASE t.name
                WHEN 'Hotjar' THEN 70
                WHEN 'Sprig' THEN 50
                WHEN 'Qualtrics' THEN 100
                WHEN 'SurveyMonkey' THEN 90
                WHEN 'Typeform' THEN 60
                WHEN 'Delighted' THEN 40
                WHEN 'Medallia' THEN 80
                WHEN 'UserVoice' THEN 70
                WHEN 'Pendo' THEN 70
                WHEN 'Dovetail' THEN 100
                ELSE COALESCE(initial_downvotes, 0)
            END
        ELSE initial_downvotes
    END,
    current_upvotes = CASE 
        -- If current_upvotes matches expected backfill data, reset to 0
        WHEN current_upvotes = CASE t.name
            WHEN 'Hotjar' THEN 320
            WHEN 'Sprig' THEN 260
            WHEN 'Qualtrics' THEN 300
            WHEN 'SurveyMonkey' THEN 280
            WHEN 'Typeform' THEN 240
            WHEN 'Delighted' THEN 210
            WHEN 'Medallia' THEN 240
            WHEN 'UserVoice' THEN 220
            WHEN 'Pendo' THEN 200
            WHEN 'Dovetail' THEN 180
            ELSE -1
        END THEN 0
        -- Otherwise preserve existing user votes
        ELSE COALESCE(current_upvotes, 0)
    END,
    current_downvotes = CASE 
        -- If current_downvotes matches expected backfill data, reset to 0
        WHEN current_downvotes = CASE t.name
            WHEN 'Hotjar' THEN 70
            WHEN 'Sprig' THEN 50
            WHEN 'Qualtrics' THEN 100
            WHEN 'SurveyMonkey' THEN 90
            WHEN 'Typeform' THEN 60
            WHEN 'Delighted' THEN 40
            WHEN 'Medallia' THEN 80
            WHEN 'UserVoice' THEN 70
            WHEN 'Pendo' THEN 70
            WHEN 'Dovetail' THEN 100
            ELSE -1
        END THEN 0
        -- Otherwise preserve existing user votes
        ELSE COALESCE(current_downvotes, 0)
    END
FROM tools t
WHERE tools_leaderboard.method_id = 9 
AND tools_leaderboard.tool_id = t.id
AND t.name IN ('Hotjar', 'Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Pendo', 'Dovetail');

-- Verify the fix
SELECT 
    t.name as tool_name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    (tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    ((tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes)) as net_sentiment_score
FROM tools t
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 9
WHERE t.name IN ('Hotjar', 'Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Pendo', 'Dovetail')
ORDER BY net_sentiment_score DESC;

-- Commit the transaction
COMMIT;

-- Final verification
SELECT 
    'User Feedback Voting Columns Fixed' as status,
    COUNT(DISTINCT t.id) as tools_fixed,
    SUM(tl.initial_upvotes) as total_initial_upvotes,
    SUM(tl.initial_downvotes) as total_initial_downvotes,
    SUM(tl.current_upvotes) as total_current_upvotes,
    SUM(tl.current_downvotes) as total_current_downvotes
FROM tools t
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 9
WHERE t.name IN ('Hotjar', 'Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Pendo', 'Dovetail');
