-- ============================================================================
-- REPLACE "REACT" WITH "FEEL" IN COGNITIVE STAGE METADATA
-- ============================================================================
-- This script updates all references to "react" to "feel" in the cognitive_stage metadata

-- ============================================================================
-- STEP 1: Update methods table metadata
-- ============================================================================

-- Update all methods that have cognitive_stage = "react" to "feel"
UPDATE methods 
SET metadata = jsonb_set(metadata, '{cognitive_stage}', '"feel"', true)
WHERE metadata->>'cognitive_stage' = 'react';

-- ============================================================================
-- STEP 2: Verification
-- ============================================================================

-- Check the updated records
SELECT 
    name,
    slug,
    metadata->'cognitive_stage' as cognitive_stage
FROM methods 
WHERE metadata->>'cognitive_stage' = 'feel'
ORDER BY name;

-- Count by cognitive stage
SELECT 
    metadata->'cognitive_stage' as cognitive_stage,
    COUNT(*) as count
FROM methods 
WHERE collection_id = (SELECT id FROM collections WHERE slug = 'tools')
GROUP BY metadata->'cognitive_stage'
ORDER BY count DESC;

-- Success message
SELECT 'Successfully replaced "react" with "feel" in cognitive stage metadata!' as result;
