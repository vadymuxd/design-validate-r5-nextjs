-- User Journey Stage Metadata Backfill
-- This script properly sets user_journey_stage metadata for metrics that can appear in multiple stages
-- Date: July 21, 2025

BEGIN;

-- Clear existing user_journey_stage metadata first
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '[]'::jsonb, true);

-- Metrics that appear in ONLY Awareness
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Awareness"]', true)
WHERE slug IN (
  'time-to-load',
  'bounce-rate',
  'first-impression',
  'brand-perception',
  'click-through-rate'
);

-- Metrics that appear in ONLY Onboarding
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Onboarding"]', true)
WHERE slug IN (
  'time-to-onboard',
  'time-to-first-action',
  'completion-rate-onboarding',
  'feature-discovery-rate',
  'feature-adoption-rate',
  'success-rate-first-click',
  'confusion-rate'
);

-- Metrics that appear in ONLY Usage
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Usage"]', true)
WHERE slug IN (
  'time-to-first-success',
  'time-on-task',
  'feature-usage',
  'interaction-depth',
  'success-rate-task',
  'success-rate-search',
  'error-rate',
  'drop-off-rate'
);

-- Metrics that appear in ONLY Retention
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Retention"]', true)
WHERE slug IN (
  'active-user-rate',
  'exit-rate',
  'retention-rate',
  'return-visit-rate',
  'user-engagement-score',
  'trust',
  'customer-lifetime-value'
);

-- Metrics that appear in ONLY Advocacy
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Advocacy"]', true)
WHERE slug IN (
  'net-promoter-score',
  'user-satisfaction',
  'aesthetic-appeal',
  'visual-design',
  'customer-satisfaction-score'
);

-- Metrics that appear in MULTIPLE stages
-- Page Views: Awareness, Onboarding, Usage, Retention
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Awareness", "Onboarding", "Usage", "Retention"]', true)
WHERE slug = 'page-views';

-- Sessions: Awareness, Onboarding, Usage
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Awareness", "Onboarding", "Usage"]', true)
WHERE slug = 'sessions';

-- Errors: Onboarding, Usage
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Onboarding", "Usage"]', true)
WHERE slug = 'errors';

-- Time on Page: Usage, Retention
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Usage", "Retention"]', true)
WHERE slug = 'time-on-page';

-- Time per Session: Usage, Retention
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Usage", "Retention"]', true)
WHERE slug = 'time-per-session';

-- Brand Perception: Awareness, Advocacy
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Awareness", "Advocacy"]', true)
WHERE slug = 'brand-perception';

-- First Impression: Awareness, Advocacy
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Awareness", "Advocacy"]', true)
WHERE slug = 'first-impression';

-- Clicks: Awareness, Onboarding, Usage (interaction tracking across stages)
UPDATE metrics SET metadata = jsonb_set(metadata, '{user_journey_stage}', '["Awareness", "Onboarding", "Usage"]', true)
WHERE slug = 'clicks';

-- Verification query
SELECT 
    slug,
    name,
    metadata->'user_journey_stage' as user_journey_stage
FROM metrics 
WHERE slug IN (
    'time-to-load', 'bounce-rate', 'first-impression', 'brand-perception', 
    'click-through-rate', 'page-views', 'sessions'
)
ORDER BY slug;

COMMIT;

-- Final count verification
SELECT 
    stage,
    COUNT(*) as metric_count
FROM (
    SELECT 
        slug,
        jsonb_array_elements_text(metadata->'user_journey_stage') as stage
    FROM metrics 
    WHERE metadata->'user_journey_stage' IS NOT NULL
) stage_metrics
GROUP BY stage
ORDER BY stage;
