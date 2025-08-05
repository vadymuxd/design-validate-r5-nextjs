-- ============================================================================
-- ADD METHOD METADATA MIGRATION
-- ============================================================================
-- This script adds a metadata JSONB column to methods table and populates 
-- it with view classifications for the new method views feature

-- ============================================================================
-- STEP 1: Add metadata column to methods table
-- ============================================================================
ALTER TABLE methods 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- ============================================================================
-- STEP 2: Populate metadata for all existing methods
-- ============================================================================

-- A/B Testing
UPDATE methods SET metadata = '{
  "research_type": "quantitative",
  "design_timing": "after", 
  "user_awareness": "implicit",
  "cognitive_stage": "act"
}' WHERE slug = 'ab-testing';

-- User Feedback  
UPDATE methods SET metadata = '{
  "research_type": "qualitative",
  "design_timing": "after",
  "user_awareness": "explicit", 
  "cognitive_stage": "feel"
}' WHERE slug = 'user-feedback';

-- Event Tracking
UPDATE methods SET metadata = '{
  "research_type": "quantitative",
  "design_timing": "after",
  "user_awareness": "implicit",
  "cognitive_stage": "act"
}' WHERE slug = 'event-tracking';

-- Surveys
UPDATE methods SET metadata = '{
  "research_type": "mixed",
  "design_timing": "before",
  "user_awareness": "explicit",
  "cognitive_stage": "feel"
}' WHERE slug = 'surveys';

-- Usability Testing
UPDATE methods SET metadata = '{
  "research_type": "mixed",
  "design_timing": "during",
  "user_awareness": "explicit",
  "cognitive_stage": "act"
}' WHERE slug = 'usability-testing';

-- User Interviews
UPDATE methods SET metadata = '{
  "research_type": "qualitative",
  "design_timing": "before",
  "user_awareness": "explicit",
  "cognitive_stage": "feel"
}' WHERE slug = 'user-interviews';

-- Funnels
UPDATE methods SET metadata = '{
  "research_type": "quantitative", 
  "design_timing": "after",
  "user_awareness": "implicit",
  "cognitive_stage": "act"
}' WHERE slug = 'funnels';

-- User Data Intelligence
UPDATE methods SET metadata = '{
  "research_type": "quantitative",
  "design_timing": "after",
  "user_awareness": "implicit",
  "cognitive_stage": "think"
}' WHERE slug = 'user-data-intelligence';

-- Heatmaps (note: actual slug is 'heat-maps' not 'heatmaps')
UPDATE methods SET metadata = '{
  "research_type": "quantitative",
  "design_timing": "after", 
  "user_awareness": "implicit",
  "cognitive_stage": "think"
}' WHERE slug = 'heat-maps';

-- Concept Testing
UPDATE methods SET metadata = '{
  "research_type": "mixed",
  "design_timing": "before",
  "user_awareness": "explicit",
  "cognitive_stage": "think"
}' WHERE slug = 'concept-testing';

-- Session Replays
UPDATE methods SET metadata = '{
  "research_type": "mixed",
  "design_timing": "after",
  "user_awareness": "implicit", 
  "cognitive_stage": "act"
}' WHERE slug = 'session-replays';

-- Card Sorting
UPDATE methods SET metadata = '{
  "research_type": "mixed",
  "design_timing": "before",
  "user_awareness": "explicit",
  "cognitive_stage": "think"
}' WHERE slug = 'card-sorting';

-- Tree Testing
UPDATE methods SET metadata = '{
  "research_type": "quantitative",
  "design_timing": "during",
  "user_awareness": "explicit",
  "cognitive_stage": "think" 
}' WHERE slug = 'tree-testing';

-- Form Analytics
UPDATE methods SET metadata = '{
  "research_type": "quantitative",
  "design_timing": "after",
  "user_awareness": "implicit",
  "cognitive_stage": "act"
}' WHERE slug = 'form-analytics';

-- First-Click Testing (note: actual slug is 'first-click' not 'first-click-testing')
UPDATE methods SET metadata = '{
  "research_type": "quantitative",
  "design_timing": "during",
  "user_awareness": "explicit",
  "cognitive_stage": "think"
}' WHERE slug = 'first-click';

-- Accessibility Testing
UPDATE methods SET metadata = '{
  "research_type": "mixed",
  "design_timing": "during",
  "user_awareness": "explicit",
  "cognitive_stage": "act"
}' WHERE slug = 'accessibility-testing';

-- Field Study
UPDATE methods SET metadata = '{
  "research_type": "qualitative",
  "design_timing": "before",
  "user_awareness": "explicit",
  "cognitive_stage": "feel"
}' WHERE slug = 'field-study';

-- Diary Study
UPDATE methods SET metadata = '{
  "research_type": "qualitative",
  "design_timing": "after",
  "user_awareness": "explicit",
  "cognitive_stage": "feel"
}' WHERE slug = 'diary-study';

-- ============================================================================
-- STEP 3: Verification queries
-- ============================================================================

-- Check all methods have metadata
SELECT 
  slug,
  name,
  metadata->'research_type' as research_type,
  metadata->'design_timing' as design_timing,
  metadata->'user_awareness' as user_awareness,
  metadata->'cognitive_stage' as cognitive_stage
FROM methods 
WHERE collection_id = (SELECT id FROM collections WHERE slug = 'tools')
ORDER BY name;

-- Count methods by each classification
SELECT 'Research Type Distribution' as category;
SELECT 
  metadata->'research_type' as value,
  COUNT(*) as count
FROM methods 
WHERE collection_id = (SELECT id FROM collections WHERE slug = 'tools')
GROUP BY metadata->'research_type'
ORDER BY count DESC;

SELECT 'Design Timing Distribution' as category;
SELECT 
  metadata->'design_timing' as value,
  COUNT(*) as count  
FROM methods
WHERE collection_id = (SELECT id FROM collections WHERE slug = 'tools')
GROUP BY metadata->'design_timing'
ORDER BY count DESC;

SELECT 'User Awareness Distribution' as category;
SELECT 
  metadata->'user_awareness' as value,
  COUNT(*) as count
FROM methods
WHERE collection_id = (SELECT id FROM collections WHERE slug = 'tools') 
GROUP BY metadata->'user_awareness'
ORDER BY count DESC;

SELECT 'Cognitive Stage Distribution' as category;
SELECT 
  metadata->'cognitive_stage' as value,
  COUNT(*) as count
FROM methods
WHERE collection_id = (SELECT id FROM collections WHERE slug = 'tools')
GROUP BY metadata->'cognitive_stage' 
ORDER BY count DESC;

-- Success message
SELECT 'Method metadata migration completed successfully!' as result; 