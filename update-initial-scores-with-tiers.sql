-- ============================================================================
-- UPDATE INITIAL SCORES WITH NEW TIER-BASED VALUES
-- ============================================================================
-- This script updates the initial_score column with new tier-based values
-- and includes tier classifications as comments for reference

-- ============================================================================
-- STEP 1: Update initial_score values by method name
-- ============================================================================

-- TIER 1: Core Skills
UPDATE methods SET initial_score = 2150 WHERE name = 'A/B Testing';        -- Tier 1: Core Skill
UPDATE methods SET initial_score = 1980 WHERE name = 'User Feedback';      -- Tier 1: Core Skill  
UPDATE methods SET initial_score = 1740 WHERE name = 'Event Tracking';     -- Tier 1: Core Skill
UPDATE methods SET initial_score = 1620 WHERE name = 'Surveys';            -- Tier 1: Core Skill

-- TIER 2: Foundational
UPDATE methods SET initial_score = 1490 WHERE name = 'Usability Testing';  -- Tier 2: Foundational
UPDATE methods SET initial_score = 1310 WHERE name = 'User Interviews';    -- Tier 2: Foundational
UPDATE methods SET initial_score = 1180 WHERE name = 'Funnels';            -- Tier 2: Foundational

-- TIER 3: Important Specialism
UPDATE methods SET initial_score = 950 WHERE name = 'UX Data Analysis';    -- Tier 3: Important Specialism
UPDATE methods SET initial_score = 730 WHERE name = 'Heatmaps';            -- Tier 3: Important Specialism
UPDATE methods SET initial_score = 560 WHERE name = 'Concept Testing';     -- Tier 3: Important Specialism

-- TIER 4: Common Niche
UPDATE methods SET initial_score = 410 WHERE name = 'Session Replays';     -- Tier 4: Common Niche
UPDATE methods SET initial_score = 280 WHERE name = 'Card Sorting';        -- Tier 4: Common Niche

-- TIER 5: Specialist Niche
UPDATE methods SET initial_score = 190 WHERE name = 'Tree Testing';        -- Tier 5: Specialist Niche
UPDATE methods SET initial_score = 150 WHERE name = 'Form Analytics';      -- Tier 5: Specialist Niche
UPDATE methods SET initial_score = 85 WHERE name = 'First-Click Testing';  -- Tier 5: Specialist Niche

-- TIER 6: Emerging & Rare
UPDATE methods SET initial_score = 31 WHERE name = 'AI Validation';        -- Tier 6: Emerging & Rare

-- ============================================================================
-- STEP 2: Verification queries
-- ============================================================================

-- Check all updated values
SELECT 
    name,
    initial_score,
    CASE 
        WHEN initial_score >= 1620 THEN 'Tier 1: Core Skill'
        WHEN initial_score >= 1180 THEN 'Tier 2: Foundational' 
        WHEN initial_score >= 560 THEN 'Tier 3: Important Specialism'
        WHEN initial_score >= 280 THEN 'Tier 4: Common Niche'
        WHEN initial_score >= 85 THEN 'Tier 5: Specialist Niche'
        ELSE 'Tier 6: Emerging & Rare'
    END as tier_classification
FROM methods 
WHERE initial_score > 0
ORDER BY initial_score DESC;

-- Check total and summary
SELECT 
    'Updated successfully!' as status,
    COUNT(*) as total_methods_updated,
    SUM(initial_score) as total_initial_score,
    MAX(initial_score) as highest_score,
    MIN(initial_score) as lowest_score,
    ROUND(AVG(initial_score), 0) as average_score
FROM methods 
WHERE initial_score > 0;

-- Test the updated scoring function
SELECT 
    name,
    initial_score,
    net_score,
    (net_score - initial_score) as user_vote_contribution,
    CASE 
        WHEN initial_score >= 1620 THEN 'Tier 1: Core'
        WHEN initial_score >= 1180 THEN 'Tier 2: Foundational' 
        WHEN initial_score >= 560 THEN 'Tier 3: Specialism'
        WHEN initial_score >= 280 THEN 'Tier 4: Niche'
        WHEN initial_score >= 85 THEN 'Tier 5: Specialist'
        ELSE 'Tier 6: Emerging'
    END as tier
FROM get_methods_with_scores()
ORDER BY net_score DESC
LIMIT 10;

-- ============================================================================
-- STEP 3: Show tier breakdown
-- ============================================================================
SELECT 
    CASE 
        WHEN initial_score >= 1620 THEN 'Tier 1: Core Skill'
        WHEN initial_score >= 1180 THEN 'Tier 2: Foundational' 
        WHEN initial_score >= 560 THEN 'Tier 3: Important Specialism'
        WHEN initial_score >= 280 THEN 'Tier 4: Common Niche'
        WHEN initial_score >= 85 THEN 'Tier 5: Specialist Niche'
        ELSE 'Tier 6: Emerging & Rare'
    END as tier,
    COUNT(*) as method_count,
    MIN(initial_score) as min_score,
    MAX(initial_score) as max_score,
    ROUND(AVG(initial_score), 0) as avg_score
FROM methods 
WHERE initial_score > 0
GROUP BY 
    CASE 
        WHEN initial_score >= 1620 THEN 'Tier 1: Core Skill'
        WHEN initial_score >= 1180 THEN 'Tier 2: Foundational' 
        WHEN initial_score >= 560 THEN 'Tier 3: Important Specialism'
        WHEN initial_score >= 280 THEN 'Tier 4: Common Niche'
        WHEN initial_score >= 85 THEN 'Tier 5: Specialist Niche'
        ELSE 'Tier 6: Emerging & Rare'
    END
ORDER BY min_score DESC; 