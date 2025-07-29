-- This script corrects the 'business_goal' metadata for all metrics
-- based on refined definitions focusing on self-declared satisfaction metrics

-- Step 1: Clear all existing 'business_goal' metadata to ensure a clean slate
UPDATE metrics SET metadata = metadata - 'business_goal';

-- Step 2: Assign 'business_goal' metadata based on corrected categories

-- ADOPTION: How users begin using the product and its features (10 metrics)
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["adoption"]')
WHERE slug IN (
  'time-to-load',
  'time-to-onboard',
  'time-to-first-action',
  'bounce-rate',
  'feature-adoption-rate',
  'feature-discovery-rate',
  'completion-rate-onboarding',
  'customer-acquisition-cost',
  'learnability',
  'first-impression'
);

-- CONVERSION: How users complete key business actions (7 metrics)
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["conversion"]')
WHERE slug IN (
  'click-through-rate',
  'conversion-rate',
  'drop-off-rate',
  'completion-rate-form',
  'completion-rate-funnel',
  'path-efficiency-score',
  'workflow-efficiency-score'
);

-- SATISFACTION: Self-declared metrics + error indicators (12 metrics)
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction"]')
WHERE slug IN (
  'error-rate',
  'error-recovery-rate',
  'aesthetic-appeal',
  'brand-perception',
  'confidence',
  'customer-effort-score',
  'customer-satisfaction-score',
  'net-promoter-score',
  'perceived-task-difficulty',
  'trust',
  'user-satisfaction',
  'system-usability-scale',
  'usability-metric-for-user-experience'
);

-- RETENTION: How users return and remain active over time (11 metrics)
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["retention"]')
WHERE slug IN (
  'time-to-value',
  'time-on-page',
  'time-per-session',
  'active-user-rate',
  'exit-rate',
  'retention-rate',
  'return-visit-rate',
  'feature-usage',
  'interaction-depth',
  'user-engagement-score',
  'customer-lifetime-value'
);

-- REVENUE: Direct financial results (4 metrics)
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["revenue"]')
WHERE slug IN (
  'transactions-number',
  'transaction-value',
  'average-order-value',
  'revenue-per-user'
);

-- REFERRAL: User advocacy and recommendations (4 metrics)
UPDATE metrics SET metadata = jsonb_set(metadata, '{business_goal}', '["referral"]')
WHERE slug IN (
  'brand-perception',
  'customer-satisfaction-score',
  'net-promoter-score',
  'user-satisfaction'
);

-- Step 3: Handle multi-category metrics (metrics that belong to multiple business goals)

-- First Impression: Both Adoption and Satisfaction
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', '["adoption", "satisfaction"]')
WHERE slug = 'first-impression';

-- Customer Satisfaction Score (CSAT): Both Satisfaction and Referral
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction", "referral"]')
WHERE slug = 'customer-satisfaction-score';

-- Net Promoter Score (NPS): Both Satisfaction and Referral
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction", "referral"]')
WHERE slug = 'net-promoter-score';

-- User Satisfaction: Both Satisfaction and Referral
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction", "referral"]')
WHERE slug = 'user-satisfaction';

-- Brand Perception: Both Satisfaction and Referral
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction", "referral"]')
WHERE slug = 'brand-perception';
