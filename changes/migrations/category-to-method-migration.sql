-- ============================================================================
-- MIGRATION: Rename "categories" to "methods" and create proper leaderboard structure
-- ============================================================================
-- This script renames all category-related tables and columns to use "method" terminology
-- and creates a proper tools_leaderboard table structure for future expansion
-- Run these queries in order, one section at a time

-- ============================================================================
-- STEP 1: Drop all foreign key constraints that reference categories or category_id
-- ============================================================================

-- Drop foreign keys from tool_category_leaderboard
ALTER TABLE tool_category_leaderboard 
DROP CONSTRAINT IF EXISTS tool_category_leaderboard_category_id_fkey;

ALTER TABLE tool_category_leaderboard 
DROP CONSTRAINT IF EXISTS tool_category_leaderboard_tool_id_fkey;

-- Drop foreign keys from tool_pros_and_cons  
ALTER TABLE tool_pros_and_cons 
DROP CONSTRAINT IF EXISTS tool_pros_and_cons_category_id_fkey;

ALTER TABLE tool_pros_and_cons 
DROP CONSTRAINT IF EXISTS tool_pros_and_cons_tool_id_fkey;

-- Drop foreign keys from votes
ALTER TABLE votes 
DROP CONSTRAINT IF EXISTS votes_category_id_fkey;

ALTER TABLE votes 
DROP CONSTRAINT IF EXISTS votes_tool_id_fkey;

-- Drop foreign key from categories table
ALTER TABLE categories 
DROP CONSTRAINT IF EXISTS categories_collection_id_fkey;

-- ============================================================================
-- STEP 2: Rename tables
-- ============================================================================

-- Rename main categories table to methods
ALTER TABLE categories RENAME TO methods;

-- Rename junction table to tools_leaderboard (for tools-specific leaderboards)
ALTER TABLE tool_category_leaderboard RENAME TO tools_leaderboard;

-- ============================================================================
-- STEP 3: Rename columns in renamed and existing tables
-- ============================================================================

-- Rename category_id to method_id in tools_leaderboard
ALTER TABLE tools_leaderboard RENAME COLUMN category_id TO method_id;

-- Rename category_id to method_id in tool_pros_and_cons
ALTER TABLE tool_pros_and_cons RENAME COLUMN category_id TO method_id;

-- Rename category_id to method_id in votes
ALTER TABLE votes RENAME COLUMN category_id TO method_id;

-- Rename category_slug to method_slug in app_feedback
ALTER TABLE app_feedback RENAME COLUMN category_slug TO method_slug;

-- ============================================================================
-- STEP 4: Recreate foreign key constraints with new names
-- ============================================================================

-- Add foreign key for methods table (renamed from categories)
ALTER TABLE methods 
ADD CONSTRAINT methods_collection_id_fkey 
FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE;

-- Add foreign keys for tools_leaderboard (renamed from tool_category_leaderboard)
ALTER TABLE tools_leaderboard 
ADD CONSTRAINT tools_leaderboard_method_id_fkey 
FOREIGN KEY (method_id) REFERENCES methods(id) ON DELETE CASCADE;

ALTER TABLE tools_leaderboard 
ADD CONSTRAINT tools_leaderboard_tool_id_fkey 
FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;

-- Add primary key constraint for tools_leaderboard
ALTER TABLE tools_leaderboard 
ADD CONSTRAINT tools_leaderboard_pkey 
PRIMARY KEY (tool_id, method_id);

-- Add foreign keys for tool_pros_and_cons
ALTER TABLE tool_pros_and_cons 
ADD CONSTRAINT tool_pros_and_cons_method_id_fkey 
FOREIGN KEY (method_id) REFERENCES methods(id) ON DELETE CASCADE;

ALTER TABLE tool_pros_and_cons 
ADD CONSTRAINT tool_pros_and_cons_tool_id_fkey 
FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;

-- Add composite foreign key for tool_pros_and_cons to ensure consistency
ALTER TABLE tool_pros_and_cons 
ADD CONSTRAINT tool_pros_and_cons_tools_leaderboard_fkey 
FOREIGN KEY (tool_id, method_id) REFERENCES tools_leaderboard(tool_id, method_id) ON DELETE CASCADE;

-- Add foreign keys for votes
ALTER TABLE votes 
ADD CONSTRAINT votes_method_id_fkey 
FOREIGN KEY (method_id) REFERENCES methods(id) ON DELETE CASCADE;

ALTER TABLE votes 
ADD CONSTRAINT votes_tool_id_fkey 
FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;

-- ============================================================================
-- STEP 5: Update any unique constraints to use new column names
-- ============================================================================

-- Drop old unique constraint on categories table (now methods)
ALTER TABLE methods 
DROP CONSTRAINT IF EXISTS categories_collection_id_slug_key;

-- Add new unique constraint
ALTER TABLE methods 
ADD CONSTRAINT methods_collection_id_slug_key 
UNIQUE (collection_id, slug);

-- ============================================================================
-- VERIFICATION QUERIES - Run these to verify the migration was successful
-- ============================================================================

-- Check table structure using information_schema
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('methods', 'tools_leaderboard', 'tool_pros_and_cons', 'votes', 'app_feedback')
    AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Check foreign key constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('methods', 'tools_leaderboard', 'tool_pros_and_cons', 'votes')
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- Verify data integrity
SELECT 'methods' as table_name, COUNT(*) as row_count FROM methods
UNION ALL
SELECT 'tools_leaderboard', COUNT(*) FROM tools_leaderboard  
UNION ALL
SELECT 'tool_pros_and_cons', COUNT(*) FROM tool_pros_and_cons
UNION ALL
SELECT 'votes', COUNT(*) FROM votes
UNION ALL
SELECT 'app_feedback', COUNT(*) FROM app_feedback;

-- Test a sample query with the new schema
SELECT 
    m.name as method_name,
    t.name as tool_name,
    tl.initial_upvotes,
    tl.initial_downvotes
FROM methods m
JOIN tools_leaderboard tl ON m.id = tl.method_id
JOIN tools t ON tl.tool_id = t.id
LIMIT 5;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. After running this migration, you'll need to update your application code
-- 2. Update all API endpoints to use /api/methods instead of /api/categories  
-- 3. Update all references from tool_method_leaderboard to tools_leaderboard in your codebase
-- 4. Update TypeScript types to reflect the new schema
-- 5. Test all functionality to ensure the migration was successful
-- 6. Future: Create methods_leaderboard table for methods-specific leaderboards 