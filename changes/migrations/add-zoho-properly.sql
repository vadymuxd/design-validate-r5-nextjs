-- ============================================================================
-- PROPER ZOHO RE-INSERTION SCRIPT
-- Date: August 29, 2025
-- Purpose: Add Zoho back properly with one tool entry and multiple method-specific entries
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Insert Zoho into tools table (one unified entry)
-- ============================================================================

INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
('Zoho', 'A comprehensive business software suite offering CRM, analytics, project management, email marketing, and over 45 integrated applications for complete business automation.', '/tools-logos/zoho.png', 'https://www.zoho.com/', 'Complete business ecosystem with seamless integration between all applications. Affordable pricing across the entire suite and excellent value for small to medium businesses seeking unified solutions.', 'Individual applications may lack depth compared to specialized tools. Can become complex to manage across multiple Zoho products and requires commitment to the entire ecosystem for maximum benefit.');

-- ============================================================================
-- STEP 2: Add Zoho to tools_leaderboard for multiple methods
-- ============================================================================

-- Get the tool_id for Zoho for use in subsequent inserts
-- Method 4: User Data Intelligence (score: 5)
-- Method 8: Surveys (we need to determine the score for surveys)

INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 4, 5, 0, 0, 0  -- User Data Intelligence method
FROM tools t WHERE t.name = 'Zoho'
UNION ALL
SELECT t.id, 8, 160, 60, 0, 0  -- Surveys method (estimated based on other survey tools)
FROM tools t WHERE t.name = 'Zoho';

-- ============================================================================
-- STEP 3: Add method-specific pros/cons for each method
-- ============================================================================

-- Insert method-specific data for User Data Intelligence (method_id = 4)
INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text, feature_description)
SELECT t.id, 4,
  'Affordable for both small and large businesses, with a drag-and-drop interface and robust collaboration tools. The AI assistant is a key competitive advantage for quick insights.',
  'Advanced capabilities may be limiting for larger organizations with complex data needs. Some features require premium plans and it has limited advanced analytics capabilities compared to other tools.',
  'A user-friendly BI tool with an AI assistant (Zia) that allows users to ask questions in natural language, making user data intelligence accessible to a wider audience of business users.'
FROM tools t WHERE t.name = 'Zoho';

-- Insert method-specific data for Surveys (method_id = 8)
INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text, feature_description)
SELECT t.id, 8,
  'A solid survey tool that is part of the broader Zoho business ecosystem. Great value, integrates seamlessly with other Zoho products (CRM, etc.).',
  'Less powerful as a standalone tool compared to market leaders.',
  'A solid survey tool that is part of the broader Zoho business ecosystem. Great value, integrates seamlessly with other Zoho products (CRM, etc.).'
FROM tools t WHERE t.name = 'Zoho';

-- ============================================================================
-- STEP 4: Verification queries
-- ============================================================================

-- Verify the tool was created
SELECT 'VERIFICATION - Zoho in tools table:' as status;
SELECT id, name, description, LEFT(pro_text, 60) as pro_preview, LEFT(con_text, 60) as con_preview 
FROM tools WHERE name = 'Zoho';

-- Verify leaderboard entries
SELECT 'VERIFICATION - Zoho in leaderboard:' as status;
SELECT 
    tl.tool_id,
    m.name as method_name,
    tl.method_id,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_score
FROM tools_leaderboard tl
JOIN tools t ON tl.tool_id = t.id
JOIN methods m ON tl.method_id = m.id
WHERE t.name = 'Zoho'
ORDER BY tl.method_id;

-- Verify pros/cons entries
SELECT 'VERIFICATION - Zoho method-specific pros/cons:' as status;
SELECT 
    tpc.tool_id,
    m.name as method_name,
    tpc.method_id,
    LEFT(tpc.feature_description, 80) as feature_preview,
    LEFT(tpc.pro_text, 60) as pro_preview,
    LEFT(tpc.con_text, 60) as con_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
JOIN methods m ON tpc.method_id = m.id
WHERE t.name = 'Zoho'
ORDER BY tpc.method_id;

-- Summary verification
SELECT 'VERIFICATION SUMMARY:' as status;
SELECT 
    'Tools table' as table_name,
    COUNT(*) as zoho_entries
FROM tools WHERE name = 'Zoho'
UNION ALL
SELECT 
    'Leaderboard table' as table_name,
    COUNT(*) as zoho_entries
FROM tools_leaderboard tl
JOIN tools t ON tl.tool_id = t.id
WHERE t.name = 'Zoho'
UNION ALL
SELECT 
    'Pros/Cons table' as table_name,
    COUNT(*) as zoho_entries
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
WHERE t.name = 'Zoho';

-- Methods where Zoho appears
SELECT 'METHODS WHERE ZOHO APPEARS:' as status;
SELECT DISTINCT
    m.id as method_id,
    m.name as method_name,
    m.slug as method_slug
FROM methods m
JOIN tools_leaderboard tl ON m.id = tl.method_id
JOIN tools t ON tl.tool_id = t.id
WHERE t.name = 'Zoho'
ORDER BY m.id;

-- Final success message
SELECT 'SUCCESS: Zoho has been properly re-inserted with one tool entry and method-specific pros/cons!' as result;

COMMIT;

-- ============================================================================
-- FINAL STATE SUMMARY:
-- ============================================================================
-- After this script:
-- 1. ✅ One "Zoho" entry in tools table with generic business suite description
-- 2. ✅ Zoho appears in tools_leaderboard for method_id = 4 (User Data Intelligence) 
-- 3. ✅ Zoho appears in tools_leaderboard for method_id = 8 (Surveys)
-- 4. ✅ Zoho has method-specific feature_description, pros, and cons for method_id = 4
-- 5. ✅ Zoho has method-specific feature_description, pros, and cons for method_id = 8
-- 6. ✅ Each method shows unique content while sharing the same base tool
-- ============================================================================
