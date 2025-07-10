-- ============================================================================
-- SIMPLE VOTING FIX: Allow method votes in the votes table
-- ============================================================================
-- This script only fixes the NOT NULL constraint on tool_id to allow method votes
-- Safe to run in any SQL environment (Supabase, pgAdmin, etc.)

-- Step 1: Check current constraint (optional - just for reference)
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'tool_id';

-- Step 2: Fix the NOT NULL constraint to allow method votes
ALTER TABLE votes ALTER COLUMN tool_id DROP NOT NULL;

-- Step 3: Update foreign key constraint to handle NULL values properly
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_tool_id_fkey;
ALTER TABLE votes 
ADD CONSTRAINT votes_tool_id_fkey 
FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;

-- Step 4: Verify the fix worked
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'tool_id';

-- Step 5: Test with a method vote (tool_id = NULL)
INSERT INTO votes (method_id, tool_id, sentiment, device_id, ip_address)
VALUES (1, NULL, 'UPVOTE', 'test-method-vote', 'test-ip')
ON CONFLICT DO NOTHING;

-- Step 6: Verify test vote was inserted
SELECT COUNT(*) as method_votes_count 
FROM votes 
WHERE tool_id IS NULL AND device_id = 'test-method-vote';

-- Step 7: Clean up test data
DELETE FROM votes WHERE device_id = 'test-method-vote';

-- Success message
SELECT 'Voting system unified! Method votes can now be stored in votes table.' as result; 