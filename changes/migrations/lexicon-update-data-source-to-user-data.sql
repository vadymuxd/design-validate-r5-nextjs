-- Lexicon Update Migration: "Data Type" -> "Metric Type" and "Data Source" -> "User Data"
-- This script updates the database schema and data to reflect the new naming convention
-- Date: July 21, 2025

BEGIN;

-- ====================================================================
-- STEP 1: RENAME METADATA FIELD FROM data_source TO user_data
-- ====================================================================

-- First, copy data_source content to user_data field
UPDATE metrics 
SET metadata = jsonb_set(
    metadata, 
    '{user_data}', 
    COALESCE(metadata->'data_source', '[]'::jsonb), 
    true
)
WHERE metadata IS NOT NULL;

-- Remove the old data_source field
UPDATE metrics 
SET metadata = metadata - 'data_source'
WHERE metadata ? 'data_source';

-- ====================================================================
-- VERIFICATION QUERIES
-- ====================================================================

-- Verify the migration worked correctly
SELECT 
    'Migration Verification' as category,
    COUNT(*) as total_metrics,
    COUNT(CASE WHEN metadata ? 'user_data' THEN 1 END) as metrics_with_user_data,
    COUNT(CASE WHEN metadata ? 'data_source' THEN 1 END) as metrics_with_old_data_source
FROM metrics;

-- Show sample of migrated data
SELECT 
    slug,
    name,
    metadata->'user_data' as user_data_new,
    metadata->'data_source' as data_source_old
FROM metrics 
WHERE metadata ? 'user_data'
LIMIT 10;

-- Check User Data distribution
SELECT 
    'User Data Distribution' as category,
    jsonb_array_elements_text(metadata->'user_data') as subcategory,
    COUNT(*) as metric_count
FROM metrics 
WHERE metadata->'user_data' IS NOT NULL AND metadata->'user_data' != '[]'::jsonb
GROUP BY jsonb_array_elements_text(metadata->'user_data')
ORDER BY subcategory;

COMMIT;
