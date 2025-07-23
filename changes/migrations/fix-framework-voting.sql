-- ============================================================================
-- FIX FRAMEWORK VOTING ISSUE
-- ============================================================================
-- The votes table method_id column has a NOT NULL constraint that prevents
-- framework votes from being saved since frameworks don't have method context.

-- Make method_id nullable to support framework votes
ALTER TABLE votes ALTER COLUMN method_id DROP NOT NULL;

-- Test framework voting
SELECT 'Testing framework vote insertion:' as test_name;

-- Test insert a framework vote
INSERT INTO votes (
  vote_type, 
  entity_id, 
  sentiment, 
  ip_address, 
  device_id
) VALUES (
  'framework', 
  '1', 
  'UPVOTE', 
  'test-ip', 
  'test-device'
);

-- Verify the insert worked
SELECT COUNT(*) as framework_votes_count 
FROM votes 
WHERE vote_type = 'framework';

-- Clean up test data
DELETE FROM votes 
WHERE vote_type = 'framework' 
  AND ip_address = 'test-ip' 
  AND device_id = 'test-device';

SELECT 'Framework voting fix complete' as status;
