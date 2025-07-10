-- Add new columns for better user experience
ALTER TABLE contact_messages 
ADD COLUMN browser TEXT,
ADD COLUMN os TEXT;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_contact_messages_browser ON contact_messages(browser);
CREATE INDEX IF NOT EXISTS idx_contact_messages_os ON contact_messages(os);

-- Update existing records (optional - for existing data)
-- This will parse existing user_agent data to populate browser and os columns
UPDATE contact_messages 
SET 
  browser = CASE 
    WHEN user_agent LIKE '%Chrome%' THEN 'Chrome'
    WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
    WHEN user_agent LIKE '%Safari%' AND user_agent NOT LIKE '%Chrome%' THEN 'Safari'
    WHEN user_agent LIKE '%Edge%' THEN 'Edge'
    WHEN user_agent LIKE '%Opera%' THEN 'Opera'
    ELSE 'Unknown'
  END,
  os = CASE 
    WHEN user_agent LIKE '%Macintosh%' THEN 'macOS'
    WHEN user_agent LIKE '%Windows NT%' THEN 'Windows'
    WHEN user_agent LIKE '%Linux%' THEN 'Linux'
    WHEN user_agent LIKE '%Android%' THEN 'Android'
    WHEN user_agent LIKE '%iPhone%' THEN 'iOS'
    WHEN user_agent LIKE '%iPad%' THEN 'iOS'
    ELSE 'Unknown'
  END
WHERE browser IS NULL OR os IS NULL; 