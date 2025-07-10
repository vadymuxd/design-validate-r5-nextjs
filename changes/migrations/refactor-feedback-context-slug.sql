-- Refactor app_feedback table: method_slug -> context_slug
-- This makes the feedback system more scalable across different collections

-- 1. Add new context_slug column
ALTER TABLE public.app_feedback 
ADD COLUMN context_slug text;

-- 2. Copy existing data from method_slug to context_slug  
UPDATE public.app_feedback 
SET context_slug = method_slug
WHERE method_slug IS NOT NULL;

-- 3. Drop the old method_slug column
ALTER TABLE public.app_feedback 
DROP COLUMN method_slug;

-- 4. Add helpful comment explaining the new field
COMMENT ON COLUMN public.app_feedback.context_slug IS 'Context identifier for the active filter/pill when feedback was given. Examples: method slug on tools page, view slug on methods page, etc.';

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'app_feedback' 
  AND table_schema = 'public'
ORDER BY ordinal_position; 