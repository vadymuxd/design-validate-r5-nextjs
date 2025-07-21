-- Complete Lexicon Update and Metadata Backfill
-- This script updates lexicon ("Data Type" -> "Metric Type", "Data Source" -> "User Data") 
-- and sets all metadata fields for proper categorization across all views
-- Date: July 21, 2025

BEGIN;

-- ====================================================================
-- STEP 1: LEXICON UPDATE - RENAME METADATA FIELDS
-- ====================================================================

-- Copy data_source content to user_data field (if it exists)
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
-- STEP 2: ADD NEW METRICS (if they don't exist)
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
-- STEP 3: CLEAR ALL EXISTING METADATA ARRAYS
-- ====================================================================
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_data}', '[]'::jsonb, true);
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '[]'::jsonb, true);
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '[]'::jsonb, true);
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '[]'::jsonb, true);
UPDATE metrics SET metadata = jsonb_set(metadata, '{measurement_timing}', '[]'::jsonb, true);

-- ====================================================================
-- USER DATA METADATA
-- ====================================================================

-- User Behaviours: Observable user interactions and behaviors
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_data}', '["user behaviours"]', true)
WHERE slug IN (
  'time-to-load', 'time-to-onboard', 'time-to-first-action', 'time-to-first-success', 'time-to-value', 'time-on-task', 'time-on-page', 'time-per-session',
  'active-user-rate', 'bounce-rate', 'click-through-rate', 'conversion-rate', 'drop-off-rate', 'error-rate', 'exit-rate', 'feature-adoption-rate', 'feature-discovery-rate',
  'completion-rate-onboarding', 'completion-rate-form', 'completion-rate-funnel', 'retention-rate', 'return-visit-rate', 'success-rate-task', 'success-rate-search', 'success-rate-first-click',
  'users', 'sessions', 'clicks', 'page-views', 'errors', 'feature-usage', 'interaction-depth', 'transactions-number', 'transaction-value', 'average-order-value', 'revenue-per-user',
  'customer-lifetime-value', 'error-recovery-rate', 'confusion-rate'
);

-- User Attitudes: Subjective feedback and opinions  
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_data}', '["user attitudes"]', true)
WHERE slug IN (
  'aesthetic-appeal', 'brand-perception', 'confidence', 'customer-effort-score', 'customer-satisfaction-score', 'first-impression', 'net-promoter-score',
  'perceived-task-difficulty', 'trust', 'user-satisfaction', 'visual-design', 'system-usability-scale', 'usability-metric-for-user-experience'
);

-- Non-User Evaluation: Expert analysis and system-generated evaluations
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_data}', '["non-user evaluation"]', true)
WHERE slug IN (
  'accessibility-compliance-score', 'heuristic-evaluation-score', 'customer-acquisition-cost', 'learnability', 'navigation-efficiency-score',
  'path-efficiency-score', 'single-usability-metric', 'user-engagement-score', 'workflow-efficiency-score', 'wcag-level'
);

-- Multi-source metrics that can come from both User Behaviours and User Attitudes
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_data}', '["user behaviours", "user attitudes"]', true)
WHERE slug IN (
  'time-on-page', 'time-per-session', 'user-engagement-score'
);

-- ====================================================================
-- DESIGN GOAL METADATA
-- ====================================================================

-- Single-category metrics first
-- Discoverability only
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["discoverability"]', true)
WHERE slug IN (
  'time-to-onboard', 'feature-adoption-rate', 'feature-discovery-rate', 'completion-rate-onboarding', 'success-rate-search',
  'time-to-first-action'
);

-- Desirability only
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["desirability"]', true)
WHERE slug IN (
  'aesthetic-appeal', 'brand-perception', 'first-impression', 'trust', 'visual-design'
);

-- Usability only
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["usability"]', true)
WHERE slug IN (
  'time-to-load', 'time-to-first-success', 'time-on-task', 'confusion-rate', 'drop-off-rate', 'error-rate', 'error-recovery-rate',
  'completion-rate-form', 'completion-rate-funnel', 'success-rate-task', 'success-rate-first-click', 'errors', 'confidence',
  'customer-effort-score', 'perceived-task-difficulty', 'accessibility-compliance-score', 'learnability', 'heuristic-evaluation-score',
  'navigation-efficiency-score', 'path-efficiency-score', 'single-usability-metric', 'system-usability-scale',
  'usability-metric-for-user-experience', 'workflow-efficiency-score', 'wcag-level'
);

-- Engagement only
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["engagement"]', true)
WHERE slug IN (
  'time-to-value', 'time-per-session', 'click-through-rate', 'feature-usage', 'interaction-depth', 'user-engagement-score', 'net-promoter-score',
  'return-visit-rate', 'active-user-rate'
);

-- Multi-category metrics
-- Clicks: Discoverability + Usability + Engagement
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["discoverability", "usability", "engagement"]', true)
WHERE slug = 'clicks';

-- Page Views: Discoverability + Usability + Engagement
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["discoverability", "usability", "engagement"]', true)
WHERE slug = 'page-views';

-- Sessions: Desirability + Usability + Engagement
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["desirability", "usability", "engagement"]', true)
WHERE slug = 'sessions';

-- Users: Discoverability + Desirability + Engagement
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["discoverability", "desirability", "engagement"]', true)
WHERE slug = 'users';

-- Time on Page: Desirability + Usability
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["desirability", "usability"]', true)
WHERE slug = 'time-on-page';

-- Bounce Rate: Desirability + Usability
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["desirability", "usability"]', true)
WHERE slug = 'bounce-rate';

-- ====================================================================
-- BUSINESS GOAL METADATA
-- ====================================================================

-- Single-category metrics first
-- Adoption only
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["adoption"]', true)
WHERE slug IN (
  'time-to-load', 'time-to-onboard', 'time-to-first-action', 'feature-adoption-rate', 'feature-discovery-rate',
  'learnability', 'customer-acquisition-cost', 'first-impression', 'feature-usage', 'completion-rate-onboarding'
);

-- Conversion only
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["conversion"]', true)
WHERE slug IN (
  'click-through-rate', 'conversion-rate', 'drop-off-rate', 'completion-rate-form', 'completion-rate-funnel',
  'path-efficiency-score', 'workflow-efficiency-score', 'success-rate-task'
);

-- Satisfaction only
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction"]', true)
WHERE slug IN (
  'time-to-first-success', 'time-on-task', 'confusion-rate', 'error-rate', 'error-recovery-rate', 'success-rate-task',
  'success-rate-search', 'success-rate-first-click', 'errors', 'confidence', 'customer-effort-score', 'customer-satisfaction-score',
  'perceived-task-difficulty', 'accessibility-compliance-score', 'heuristic-evaluation-score', 'navigation-efficiency-score',
  'single-usability-metric', 'system-usability-scale', 'usability-metric-for-user-experience', 'visual-design',
  'user-satisfaction', 'aesthetic-appeal', 'wcag-level'
);

-- Retention only
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["retention"]', true)
WHERE slug IN (
  'time-to-value', 'active-user-rate', 'exit-rate', 'retention-rate', 'return-visit-rate',
  'interaction-depth', 'user-engagement-score', 'trust', 'customer-lifetime-value', 'feature-usage'
);

-- Revenue only
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["revenue"]', true)
WHERE slug IN (
  'transactions-number', 'transaction-value', 'average-order-value', 'revenue-per-user'
);

-- Referral only
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["referral"]', true)
WHERE slug IN (
  'brand-perception', 'net-promoter-score', 'user-satisfaction', 'customer-satisfaction-score'
);

-- Multi-category metrics
-- Users: Adoption + Conversion + Retention + Revenue + Referral
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["adoption", "conversion", "retention", "revenue", "referral"]', true)
WHERE slug = 'users';

-- Sessions: Adoption + Conversion + Satisfaction + Retention + Revenue + Referral
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["adoption", "conversion", "satisfaction", "retention", "revenue", "referral"]', true)
WHERE slug = 'sessions';

-- Clicks: Adoption + Conversion + Retention
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["adoption", "conversion", "retention"]', true)
WHERE slug = 'clicks';

-- Page Views: Adoption + Conversion + Retention
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["adoption", "conversion", "retention"]', true)
WHERE slug = 'page-views';

-- Bounce Rate: Adoption + Satisfaction
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["adoption", "satisfaction"]', true)
WHERE slug = 'bounce-rate';

-- Time on Page: Satisfaction + Retention
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction", "retention"]', true)
WHERE slug = 'time-on-page';

-- ====================================================================
-- USER JOURNEY STAGE METADATA
-- ====================================================================

-- Awareness: Initial product discovery and first impressions
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["awareness"]', true)
WHERE slug IN (
  'time-to-load', 'bounce-rate', 'click-through-rate'
);

-- Onboarding: Learning and starting to use the product
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["onboarding"]', true)
WHERE slug IN (
  'time-to-onboard', 'time-to-first-action', 'completion-rate-onboarding', 'feature-discovery-rate', 'feature-adoption-rate',
  'success-rate-first-click', 'confusion-rate', 'wcag-level'
);

-- Usage: Ongoing product interaction
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["usage"]', true)
WHERE slug IN (
  'time-to-first-success', 'time-on-task', 'feature-usage', 'interaction-depth', 'success-rate-task', 'success-rate-search',
  'error-rate', 'drop-off-rate'
);

-- Retention: Long-term engagement
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["retention"]', true)
WHERE slug IN (
  'active-user-rate', 'exit-rate', 'retention-rate', 'return-visit-rate', 'user-engagement-score', 'trust', 'customer-lifetime-value'
);

-- Advocacy: Promoting and recommending
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["advocacy"]', true)
WHERE slug IN (
  'net-promoter-score', 'user-satisfaction', 'aesthetic-appeal', 'visual-design', 'customer-satisfaction-score'
);

-- Multi-stage metrics
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["awareness", "onboarding", "usage", "retention"]', true)
WHERE slug = 'page-views';

UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["awareness", "onboarding", "usage"]', true)
WHERE slug IN ('sessions', 'clicks');

UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["onboarding", "usage"]', true)
WHERE slug = 'errors';

UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["usage", "retention"]', true)
WHERE slug IN ('time-on-page', 'time-per-session');

UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["awareness", "advocacy"]', true)
WHERE slug IN ('brand-perception', 'first-impression');

-- ====================================================================
-- MEASUREMENT TIMING METADATA
-- ====================================================================

-- Real-time: Immediate data collection during interaction
UPDATE metrics SET metadata = jsonb_set(metadata, '{measurement_timing}', '["real-time"]', true)
WHERE slug IN (
  'time-to-load', 'time-to-first-action', 'bounce-rate', 'click-through-rate', 'conversion-rate', 'drop-off-rate',
  'error-rate', 'exit-rate', 'completion-rate-form', 'completion-rate-funnel', 'success-rate-search', 'success-rate-first-click',
  'clicks', 'page-views', 'errors', 'users', 'sessions'
);

-- Post-task: Evaluation after task completion
UPDATE metrics SET metadata = jsonb_set(metadata, '{measurement_timing}', '["post-task"]', true)
WHERE slug IN (
  'time-to-onboard', 'time-to-first-success', 'time-on-task', 'confusion-rate', 'error-recovery-rate', 'completion-rate-onboarding',
  'success-rate-task', 'aesthetic-appeal', 'brand-perception', 'confidence', 'customer-effort-score', 'customer-satisfaction-score',
  'first-impression', 'perceived-task-difficulty', 'visual-design', 'user-satisfaction', 'accessibility-compliance-score',
  'learnability', 'heuristic-evaluation-score', 'navigation-efficiency-score', 'path-efficiency-score', 'single-usability-metric',
  'system-usability-scale', 'usability-metric-for-user-experience', 'workflow-efficiency-score', 'wcag-level'
);

-- Longitudinal: Long-term tracking and trends
UPDATE metrics SET metadata = jsonb_set(metadata, '{measurement_timing}', '["longitudinal"]', true)
WHERE slug IN (
  'time-to-value', 'time-per-session', 'active-user-rate', 'feature-adoption-rate', 'feature-discovery-rate', 'retention-rate',
  'return-visit-rate', 'sessions', 'feature-usage', 'interaction-depth', 'net-promoter-score', 'user-engagement-score',
  'transactions-number', 'transaction-value', 'average-order-value', 'customer-acquisition-cost', 'customer-lifetime-value',
  'revenue-per-user', 'trust', 'users', 'page-views'
);

-- Multi-timing metrics that can be measured at different intervals
UPDATE metrics SET metadata = jsonb_set(metadata, '{measurement_timing}', '["real-time", "longitudinal"]', true)
WHERE slug IN (
  'clicks', 'page-views', 'sessions', 'users'
);

UPDATE metrics SET metadata = jsonb_set(metadata, '{measurement_timing}', '["real-time", "post-task"]', true)
WHERE slug IN (
  'time-on-page'
);

-- ====================================================================
-- VERIFICATION QUERIES
-- ====================================================================

-- Migration verification
SELECT 
    'Lexicon Migration Verification' as category,
    COUNT(*) as total_metrics,
    COUNT(CASE WHEN metadata ? 'user_data' THEN 1 END) as metrics_with_user_data,
    COUNT(CASE WHEN metadata ? 'data_source' THEN 1 END) as metrics_with_old_data_source
FROM metrics;

-- Check User Data distribution
SELECT 
    'User Data Distribution' as category,
    jsonb_array_elements_text(metadata->'user_data') as subcategory,
    COUNT(*) as metric_count
FROM metrics 
WHERE metadata->'user_data' IS NOT NULL AND metadata->'user_data' != '[]'::jsonb
GROUP BY jsonb_array_elements_text(metadata->'user_data')
ORDER BY subcategory;

-- Check Design Goal distribution
SELECT 
    'Design Goal Distribution' as category,
    jsonb_array_elements_text(metadata->'design_goal') as subcategory,
    COUNT(*) as metric_count
FROM metrics 
WHERE metadata->'design_goal' IS NOT NULL AND metadata->'design_goal' != '[]'::jsonb
GROUP BY jsonb_array_elements_text(metadata->'design_goal')
ORDER BY subcategory;

-- Check Business Goal distribution
SELECT 
    'Business Goal Distribution' as category,
    jsonb_array_elements_text(metadata->'business_goal') as subcategory,
    COUNT(*) as metric_count
FROM metrics 
WHERE metadata->'business_goal' IS NOT NULL AND metadata->'business_goal' != '[]'::jsonb
GROUP BY jsonb_array_elements_text(metadata->'business_goal')
ORDER BY subcategory;

-- Check User Journey Stage distribution
SELECT 
    'User Journey Stage Distribution' as category,
    jsonb_array_elements_text(metadata->'user_journey_stage') as subcategory,
    COUNT(*) as metric_count
FROM metrics 
WHERE metadata->'user_journey_stage' IS NOT NULL AND metadata->'user_journey_stage' != '[]'::jsonb
GROUP BY jsonb_array_elements_text(metadata->'user_journey_stage')
ORDER BY subcategory;

-- Check Measurement Timing distribution
SELECT 
    'Measurement Timing Distribution' as category,
    jsonb_array_elements_text(metadata->'measurement_timing') as subcategory,
    COUNT(*) as metric_count
FROM metrics 
WHERE metadata->'measurement_timing' IS NOT NULL AND metadata->'measurement_timing' != '[]'::jsonb
GROUP BY jsonb_array_elements_text(metadata->'measurement_timing')
ORDER BY subcategory;

-- Sample verification for discoverability (should include clicks)
SELECT 
    slug,
    name,
    metadata->'design_goal' as design_goal
FROM metrics 
WHERE metadata->'design_goal' ? 'discoverability'
ORDER BY slug;

COMMIT;
