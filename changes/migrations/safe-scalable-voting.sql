-- ============================================================================
-- SAFE SCALABLE VOTING MIGRATION
-- ============================================================================
-- This script safely migrates to scalable voting without function conflicts
-- Run this AFTER simple-voting-fix.sql

-- ============================================================================
-- STEP 1: Add vote entity type enum
-- ============================================================================

-- Create the enum for vote types (safe - won't conflict if it exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_entity_type') THEN
        CREATE TYPE vote_entity_type AS ENUM (
            'tool', 
            'method', 
            'case', 
            'metric', 
            'article', 
            'framework'
        );
    END IF;
END $$;

-- ============================================================================
-- STEP 2: Add new columns to votes table
-- ============================================================================

-- Add vote_type column (safe - won't fail if it exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'votes' AND column_name = 'vote_type'
    ) THEN
        ALTER TABLE votes ADD COLUMN vote_type vote_entity_type;
    END IF;
END $$;

-- Add entity_id column (safe - won't fail if it exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'votes' AND column_name = 'entity_id'
    ) THEN
        ALTER TABLE votes ADD COLUMN entity_id text;
    END IF;
END $$;

-- ============================================================================
-- STEP 3: Backfill existing data
-- ============================================================================

-- Update existing tool votes (safe - only updates if not already done)
UPDATE votes 
SET 
    vote_type = 'tool',
    entity_id = tool_id::text
WHERE tool_id IS NOT NULL AND vote_type IS NULL;

-- Update existing method votes (safe - only updates if not already done)  
UPDATE votes 
SET 
    vote_type = 'method',
    entity_id = method_id::text
WHERE tool_id IS NULL AND vote_type IS NULL;

-- ============================================================================
-- STEP 4: Add constraints (safe - only if not already set)
-- ============================================================================

-- Make vote_type required (safe check first)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'votes' 
        AND column_name = 'vote_type' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE votes ALTER COLUMN vote_type SET NOT NULL;
    END IF;
END $$;

-- Make entity_id required (safe check first)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'votes' 
        AND column_name = 'entity_id' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE votes ALTER COLUMN entity_id SET NOT NULL;
    END IF;
END $$;

-- ============================================================================
-- STEP 5: Add performance indexes (safe - won't conflict)
-- ============================================================================

-- Create indexes for new query patterns (safe - uses IF NOT EXISTS equivalent)
CREATE INDEX IF NOT EXISTS idx_votes_type_entity_device 
ON votes (vote_type, entity_id, device_id);

CREATE INDEX IF NOT EXISTS idx_votes_type_entity_context 
ON votes (vote_type, entity_id, method_id);

-- ============================================================================
-- STEP 6: Verification (safe queries only)
-- ============================================================================

-- Show vote distribution by type
SELECT 
    vote_type,
    COUNT(*) as total_votes,
    COUNT(*) FILTER (WHERE sentiment = 'UPVOTE') as upvotes,
    COUNT(*) FILTER (WHERE sentiment = 'DOWNVOTE') as downvotes
FROM votes 
WHERE vote_type IS NOT NULL
GROUP BY vote_type
ORDER BY vote_type;

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'votes' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
SELECT 'Scalable voting migration completed! Ready for any entity type.' as result; 