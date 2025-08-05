-- Update contact_messages table to support community feedback functionality
-- This migration adds columns to track feedback source, component type, and user email

-- Add new columns to contact_messages table
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS feedback_source TEXT,
ADD COLUMN IF NOT EXISTS component TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Add indexes for the new columns to improve query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_feedback_source ON contact_messages(feedback_source);
CREATE INDEX IF NOT EXISTS idx_contact_messages_component ON contact_messages(component);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_email ON contact_messages(user_email);

-- Update existing records to have proper feedback_source and component values
-- All existing records are from the contact form on the about page
UPDATE contact_messages 
SET 
  feedback_source = 'about',
  component = 'contact-form'
WHERE 
  feedback_source IS NULL 
  AND component IS NULL;

-- Add comments to document the new columns
COMMENT ON COLUMN contact_messages.feedback_source IS 'Source page where feedback was submitted (e.g., community, about, tools, etc.)';
COMMENT ON COLUMN contact_messages.component IS 'Component that triggered the feedback (e.g., viewer, contributor, partner, contact-form)';
COMMENT ON COLUMN contact_messages.user_email IS 'Email address provided by the user for follow-up communication';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'contact_messages' 
ORDER BY ordinal_position;

-- Sample query to test the new structure
-- SELECT id, message, feedback_source, component, user_email, created_at 
-- FROM contact_messages 
-- ORDER BY created_at DESC 
-- LIMIT 5;

-- Expected values for the new columns:
-- feedback_source: 'community', 'about', 'tools', 'methods', 'frameworks', 'metrics', 'cases'
-- component: 'viewer', 'contributor', 'partner', 'contact-form'
-- user_email: user-provided email address for community feedback (optional for contact-form)
