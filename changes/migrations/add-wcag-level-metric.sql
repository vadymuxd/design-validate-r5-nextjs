-- Add WCAG Level Metric and Backfill
-- This script adds the WCAG Level metric and sets proper metadata categorization
-- Date: July 21, 2025

BEGIN;

-- ====================================================================
-- ADD WCAG LEVEL METRIC
-- ====================================================================

-- Add WCAG Level metric if it doesn't exist
INSERT INTO metrics (name, slug, description, type, metadata)
SELECT 
    'WCAG Level', 
    'wcag-level', 
    'Web Content Accessibility Guidelines compliance level (A, AA, AAA) measuring overall accessibility standards adherence',
    'Composite',
    '{}'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM metrics WHERE slug = 'wcag-level'
);

-- ====================================================================
-- BACKFILL WCAG LEVEL METADATA
-- ====================================================================

-- User Data: Non-User Evaluation (expert analysis)
UPDATE metrics 
SET metadata = jsonb_set(metadata, '{user_data}', '["non-user evaluation"]', true)
WHERE slug = 'wcag-level';

-- Design Goal: Usability (accessibility is part of usability)
UPDATE metrics 
SET metadata = jsonb_set(metadata, '{design_goal}', '["usability"]', true)
WHERE slug = 'wcag-level';

-- Business Goal: Satisfaction (accessibility improves user satisfaction)
UPDATE metrics 
SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction"]', true)
WHERE slug = 'wcag-level';

-- User Journey Stage: Onboarding (accessibility is crucial during initial use)
UPDATE metrics 
SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["onboarding"]', true)
WHERE slug = 'wcag-level';

-- Measurement Timing: Post-task (evaluated after implementation/audit)
UPDATE metrics 
SET metadata = jsonb_set(metadata, '{measurement_timing}', '["post-task"]', true)
WHERE slug = 'wcag-level';

-- ====================================================================
-- VERIFICATION QUERIES
-- ====================================================================

-- Verify WCAG Level was added successfully
SELECT 
    'WCAG Level Verification' as category,
    slug,
    name,
    type,
    description,
    metadata
FROM metrics 
WHERE slug = 'wcag-level';

-- Check that WCAG Level appears in correct categories
SELECT 
    'WCAG Level Categories' as category,
    'User Data' as metadata_type,
    jsonb_array_elements_text(metadata->'user_data') as value
FROM metrics 
WHERE slug = 'wcag-level' AND metadata->'user_data' IS NOT NULL

UNION ALL

SELECT 
    'WCAG Level Categories' as category,
    'Design Goal' as metadata_type,
    jsonb_array_elements_text(metadata->'design_goal') as value
FROM metrics 
WHERE slug = 'wcag-level' AND metadata->'design_goal' IS NOT NULL

UNION ALL

SELECT 
    'WCAG Level Categories' as category,
    'Business Goal' as metadata_type,
    jsonb_array_elements_text(metadata->'business_goal') as value
FROM metrics 
WHERE slug = 'wcag-level' AND metadata->'business_goal' IS NOT NULL

UNION ALL

SELECT 
    'WCAG Level Categories' as category,
    'User Journey Stage' as metadata_type,
    jsonb_array_elements_text(metadata->'user_journey_stage') as value
FROM metrics 
WHERE slug = 'wcag-level' AND metadata->'user_journey_stage' IS NOT NULL

UNION ALL

SELECT 
    'WCAG Level Categories' as category,
    'Measurement Timing' as metadata_type,
    jsonb_array_elements_text(metadata->'measurement_timing') as value
FROM metrics 
WHERE slug = 'wcag-level' AND metadata->'measurement_timing' IS NOT NULL

ORDER BY metadata_type, value;

-- Verify total metrics count
SELECT 
    'Total Metrics Count' as category,
    COUNT(*) as total_metrics,
    COUNT(CASE WHEN type = 'Composite' THEN 1 END) as composite_metrics
FROM metrics;

COMMIT;
