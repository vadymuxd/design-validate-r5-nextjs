-- ============================================================================
-- FIX VOTING SYSTEM: UNIFY TOOL AND METHOD VOTING
-- ============================================================================
-- This script fixes the database constraint to allow method votes in votes table
-- and prepares for unified voting logic

-- ============================================================================
-- STEP 1: Fix the NOT NULL constraint on tool_id in votes table
-- ============================================================================

-- Check current constraint
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'tool_id';

-- Drop the NOT NULL constraint to allow method votes (tool_id = NULL)
ALTER TABLE votes ALTER COLUMN tool_id DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'tool_id';

-- ============================================================================
-- STEP 2: Update foreign key constraint to handle NULL tool_id
-- ============================================================================

-- Drop existing foreign key constraint
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_tool_id_fkey;

-- Recreate foreign key constraint that allows NULL values
-- NULL values will not be checked against the foreign key
ALTER TABLE votes 
ADD CONSTRAINT votes_tool_id_fkey 
FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;

-- ============================================================================
-- STEP 3: Test the new constraint by inserting a method vote
-- ============================================================================

-- Test insert with NULL tool_id (method vote)
INSERT INTO votes (method_id, tool_id, sentiment, device_id, ip_address)
VALUES (1, NULL, 'UPVOTE', 'test-device-123', 'test-ip')
ON CONFLICT DO NOTHING;

-- Verify the test insert worked
SELECT 
    id, 
    method_id, 
    tool_id, 
    sentiment, 
    device_id,
    CASE 
        WHEN tool_id IS NULL THEN 'Method Vote'
        ELSE 'Tool Vote'
    END as vote_type
FROM votes 
WHERE device_id = 'test-device-123';

-- Clean up test data
DELETE FROM votes WHERE device_id = 'test-device-123';

-- ============================================================================
-- STEP 4: Create helper function to count method votes from votes table only
-- ============================================================================

-- Drop existing function first (if it exists)
DROP FUNCTION IF EXISTS count_method_votes(bigint);

-- Create new method vote counting function
CREATE OR REPLACE FUNCTION count_method_votes(method_id_param BIGINT)
RETURNS TABLE (
    upvotes BIGINT,
    downvotes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE sentiment = 'UPVOTE') as upvotes,
        COUNT(*) FILTER (WHERE sentiment = 'DOWNVOTE') as downvotes
    FROM votes 
    WHERE method_id = method_id_param AND tool_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Test the helper function
SELECT * FROM count_method_votes(1);

-- ============================================================================
-- STEP 5: Verification queries
-- ============================================================================

-- Check votes table structure (using standard SQL instead of psql \d command)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'votes' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show all constraints on votes table
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'votes' 
    AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;

-- Summary
SELECT 
    'Voting system fix completed!' as status,
    'tool_id can now be NULL for method votes' as change_made,
    'All votes will be stored in votes table' as result; 