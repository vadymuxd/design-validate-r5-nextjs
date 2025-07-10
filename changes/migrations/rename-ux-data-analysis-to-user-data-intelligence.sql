-- ============================================================================
-- RENAME UX DATA ANALYSIS TO USER DATA INTELLIGENCE
-- ============================================================================
-- This script updates the method name, slug, and description to better reflect
-- the method's purpose focused on database analysis for UX validation

-- ============================================================================
-- STEP 1: Update the methods table
-- ============================================================================

-- Update the method name, slug, and description
UPDATE methods 
SET 
  name = 'User Data Intelligence',
  slug = 'user-data-intelligence',
  description = 'Examining user-generated data stored in databases to validate design decisions and understand behavior patterns. This method focuses on analyzing structured data such as user selections, purchases, feature interactions, and form inputs. Teams create dashboards and reports to visualize user behavior trends, helping them validate design hypotheses and identify opportunities for product improvement based on actual usage data.'
WHERE slug = 'ux-data-analysis';

-- ============================================================================
-- STEP 2: Update tools_leaderboard references (if using method_id)
-- ============================================================================

-- The tools_leaderboard table uses method_id (not slug), so this should be automatic
-- But let's verify the method_id remains consistent
SELECT 
  id,
  name,
  slug,
  LEFT(description, 50) || '...' as description_preview
FROM methods 
WHERE slug = 'user-data-intelligence';

-- ============================================================================
-- STEP 3: Update any app_feedback references that might use method_slug
-- ============================================================================

-- Update app_feedback table if it has method_slug references
UPDATE app_feedback 
SET method_slug = 'user-data-intelligence'
WHERE method_slug = 'ux-data-analysis';

-- ============================================================================
-- STEP 4: Update votes table if it has method references by slug
-- ============================================================================

-- Update votes table for any method votes that reference the old slug
UPDATE votes 
SET entity_id = (SELECT id::text FROM methods WHERE slug = 'user-data-intelligence')
WHERE vote_type = 'method' 
  AND entity_id = (SELECT id::text FROM methods WHERE slug = 'user-data-intelligence');

-- ============================================================================
-- STEP 5: Verification queries
-- ============================================================================

-- Verify the method was updated correctly
SELECT 
  id,
  name,
  slug,
  LEFT(description, 100) || '...' as description_preview,
  metadata
FROM methods 
WHERE slug = 'user-data-intelligence';

-- Check that tools are still properly linked
SELECT 
  COUNT(*) as tool_count,
  'Tools linked to User Data Intelligence' as description
FROM tools_leaderboard tl
JOIN methods m ON tl.method_id = m.id
WHERE m.slug = 'user-data-intelligence';

-- Check tools names for this method
SELECT 
  t.name as tool_name,
  tl.initial_upvotes - tl.initial_downvotes as net_score
FROM tools_leaderboard tl
JOIN methods m ON tl.method_id = m.id
JOIN tools t ON tl.tool_id = t.id
WHERE m.slug = 'user-data-intelligence'
ORDER BY net_score DESC
LIMIT 5;

-- Success message
SELECT 'Method successfully renamed to User Data Intelligence!' as result; 